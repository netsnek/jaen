"""Shared foundation for the jaen notebook test suite.

The suite verifies the jaen monorepo feature branch by observing artifacts:
build outputs, generated pages, sitemap.xml, robots.txt, GraphQL schemas and
client sources. It is written in Python on purpose — a different language than
the implementation — so the checks judge what a build actually produced instead
of shortcutting through TypeScript internals.

Three properties hold everywhere in this module:

* Runners never raise at a caller. They return structured results, checks
  record PASS, FAIL, SKIP or WARN, and an unexpected exception inside a
  :func:`check` block becomes a FAIL instead of killing the notebook.
* Building is allowed, deploying is not. Notebooks may run installs and builds
  in the working copies below; anything that publishes (push, deploy, send a
  real mail) belongs in a markdown cell for a human to run.
* Evidence is redacted. Every stored or printed evidence string passes through
  :func:`redact`, so a check can quote command output without leaking a token.

Typical use::

    import jaen_testkit as k
    k.start_run("04-sitemap")

    with k.check("sitemap is well-formed XML") as c:
        tree = c.require(k.xml_file(k.site_path("public/sitemap.xml")))
        c.expect_true(len(tree.root) > 0, "%d url entries" % len(tree.root))

    k.summary()
    k.verdict()
"""

import json as _json
import os as _os
import re as _re
import shlex as _shlex
import subprocess as _subprocess
import time as _time
import traceback as _traceback
import urllib.error as _urlerror
import urllib.request as _urlrequest
import xml.etree.ElementTree as _etree
from contextlib import contextmanager as _contextmanager
from dataclasses import asdict as _asdict
from dataclasses import dataclass as _dataclass
from pathlib import Path as _Path

try:  # optional, only used to render the HTML summary inside a notebook
    from IPython.display import HTML as _HTML
    from IPython.display import display as _display

    _HAVE_IPYTHON = True
except Exception:  # pragma: no cover - plain python or no IPython installed
    _HAVE_IPYTHON = False


VERSION = "1.0.0"

PASS = "PASS"
FAIL = "FAIL"
SKIP = "SKIP"
WARN = "WARN"

_RANK = {SKIP: 0, PASS: 1, WARN: 2, FAIL: 3}

__all__ = [
    "VERSION",
    "PASS",
    "FAIL",
    "SKIP",
    "WARN",
    "CONFIG",
    "Check",
    "CheckContext",
    "CmdResult",
    "HttpResult",
    "XmlResult",
    "SkipCheck",
    "start_run",
    "reset",
    "run_info",
    "section",
    "report",
    "ok",
    "fail",
    "warn",
    "skip",
    "check",
    "expect_true",
    "expect_equal",
    "expect_contains",
    "results",
    "counts",
    "summary",
    "verdict",
    "results_json",
    "save_results",
    "sh",
    "yarn",
    "node_eval",
    "http_get",
    "http_post_json",
    "graphql",
    "read_text",
    "xml_file",
    "sitemap_entries",
    "repo_path",
    "site_path",
    "redact",
    "preview",
]


# ---------------------------------------------------------------------------
# configuration
# ---------------------------------------------------------------------------


def _env(name, default):
    value = _os.environ.get(name)
    if value is None or value == "":
        return default
    return value


def _env_int(name, default):
    try:
        return int(_env(name, default))
    except (TypeError, ValueError):
        return default


_TESTS_DIR = _Path(__file__).resolve().parent
_DEFAULT_ROOT = _TESTS_DIR.parent

CONFIG = {
    # working copies. SITE_DIR is the end-to-end fixture (netsnek.com checkout).
    "repo_root": _env("JAEN_ROOT", str(_DEFAULT_ROOT)),
    "site_dir": _env("JAEN_SITE_DIR", str(_Path.home() / "git" / "netsnek.com")),
    "emailwerk_dir": _env("JAEN_EMAILWERK_DIR", str(_Path.home() / "git" / "emailwerk-fido-test")),
    "iam_sdl": _env(
        "JAEN_IAM_SDL",
        str(_Path.home() / "git" / "walther-deployment" / "iam" / ".pylon" / "schema.graphql"),
    ),
    # endpoints for optional live checks. Empty means SKIP those checks.
    "emailwerk_url": _env("JAEN_EMAILWERK_URL", "http://127.0.0.1:3000/graphql"),
    "zitadel_gql_url": _env("JAEN_ZITADEL_GQL_URL", ""),
    # expectations of the fixture site
    "site_locales": _env("JAEN_SITE_LOCALES", "de,en,sl,it,ja").split(","),
    "site_default_locale": _env("JAEN_SITE_DEFAULT_LOCALE", "de"),
    "cms_locales": _env(
        "JAEN_CMS_LOCALES", "en-US,de-AT,sl-SI,it-IT,ja-JP,tr-TR,ar-EG"
    ).split(","),
    # runtime behaviour
    "cmd_timeout": _env_int("JAEN_CMD_TIMEOUT", 120),
    "build_timeout": _env_int("JAEN_BUILD_TIMEOUT", 1800),
    "http_timeout": _env_int("JAEN_HTTP_TIMEOUT", 15),
    "evidence_width": _env_int("JAEN_EVIDENCE_WIDTH", 96),
}


def repo_path(*parts):
    """A path inside the jaen monorepo working copy."""
    return str(_Path(CONFIG["repo_root"]).joinpath(*parts))


def site_path(*parts):
    """A path inside the fixture site working copy (netsnek.com)."""
    return str(_Path(CONFIG["site_dir"]).joinpath(*parts))


# ---------------------------------------------------------------------------
# redaction and evidence formatting
# ---------------------------------------------------------------------------

_REDACT_PATTERNS = [
    (
        _re.compile(
            r"-----BEGIN [A-Z ]*PRIVATE KEY-----.*?-----END [A-Z ]*PRIVATE KEY-----",
            _re.S,
        ),
        "<redacted-private-key>",
    ),
    (
        _re.compile(r"\beyJ[A-Za-z0-9_\-]{6,}\.[A-Za-z0-9_\-]{6,}\.[A-Za-z0-9_\-]{4,}"),
        "<redacted-jwt>",
    ),
    (
        _re.compile(r"(?i)\b(authorization\s*[:=]\s*)(?:bearer\s+|basic\s+)?[^\s\"',]+"),
        r"\1<redacted>",
    ),
    (
        _re.compile(
            r"(?i)\b(password|passwd|pwd|secret|client_secret|private_key|privatekey|"
            r"api_key|apikey|access_token|refresh_token|id_token|token|key)"
            r"(\"?\s*[:=]\s*)"
            r"(\"[^\"]*\"|'[^']*'|[^\s,;)\]}]+)"
        ),
        r"\1\2<redacted>",
    ),
    (_re.compile(r"://[^/\s:@]+:[^/\s@]+@"), "://<redacted>@"),
]


def redact(value):
    """Return ``value`` as a string with secret shaped substrings masked."""
    if value is None:
        return ""
    text = value if isinstance(value, str) else str(value)
    for pattern, replacement in _REDACT_PATTERNS:
        text = pattern.sub(replacement, text)
    return text


def preview(value, limit=300):
    """A redacted, whitespace collapsed, truncated one line preview."""
    text = redact(value)
    text = _re.sub(r"\s+", " ", text).strip()
    if len(text) > limit:
        text = text[: limit - 3] + "..."
    return text


# ---------------------------------------------------------------------------
# the check registry
# ---------------------------------------------------------------------------


@_dataclass
class Check:
    """One recorded observation: a name, a status, and the evidence for it."""

    index: int
    name: str
    status: str
    evidence: str = ""
    detail: str = ""
    section: str = ""
    notebook: str = ""
    duration_ms: int = 0
    timestamp: float = 0.0

    def as_dict(self):
        return _asdict(self)


class SkipCheck(Exception):
    """Raised inside a :func:`check` block to abandon it as a SKIP."""


class _AbortCheck(Exception):
    """Internal: abandon a check block that already recorded a failure."""


_RESULTS = []
_RUN = {"notebook": "", "started": 0.0, "section": ""}


def start_run(notebook, reset_results=True):
    """Label this notebook run and clear the registry. Call once, first cell."""
    if reset_results:
        reset()
    _RUN["notebook"] = str(notebook)
    _RUN["started"] = _time.time()
    _RUN["section"] = ""
    return dict(_RUN)


def reset():
    """Drop every recorded check."""
    del _RESULTS[:]
    _RUN["section"] = ""


def run_info():
    return dict(_RUN)


@_contextmanager
def section(title):
    """Group the checks recorded inside the block under one heading."""
    previous = _RUN["section"]
    _RUN["section"] = str(title)
    try:
        yield title
    finally:
        _RUN["section"] = previous


def report(name, status, evidence="", detail=None, duration_ms=0):
    """Record one check and return it. Never raises, whatever the status."""
    if status not in _RANK:
        status = WARN
        evidence = "unknown status requested. " + str(evidence)
    entry = Check(
        index=len(_RESULTS) + 1,
        name=str(name),
        status=status,
        evidence=redact(evidence),
        detail=redact(detail) if detail else "",
        section=_RUN["section"],
        notebook=_RUN["notebook"],
        duration_ms=int(duration_ms),
        timestamp=_time.time(),
    )
    _RESULTS.append(entry)
    return entry


def ok(name, evidence="", detail=None):
    """Record a PASS."""
    return report(name, PASS, evidence, detail)


def fail(name, evidence="", detail=None):
    """Record a FAIL. The notebook keeps running."""
    return report(name, FAIL, evidence, detail)


def warn(name, evidence="", detail=None):
    """Record a WARN: observed, not a blocker, worth a human look."""
    return report(name, WARN, evidence, detail)


def skip(name, reason="", detail=None):
    """Record a SKIP: the preconditions for this check were not met."""
    return report(name, SKIP, reason, detail)


class CheckContext:
    """The object a :func:`check` block yields. Records, never raises."""

    def __init__(self, name, detail=None):
        self.name = str(name)
        self._status = None
        self._notes = []
        self._detail = [redact(detail)] if detail else []
        self._started = _time.time()
        self._traceback = ""

    # evidence -------------------------------------------------------------

    def note(self, text):
        text = preview(text, CONFIG["evidence_width"])
        if text:
            self._notes.append(text)
        return self

    def detail(self, text):
        text = redact(text)
        if text:
            self._detail.append(text)
        return self

    # status ---------------------------------------------------------------

    def _bump(self, status):
        if self._status is None or _RANK[status] > _RANK[self._status]:
            self._status = status

    def ok(self, evidence=""):
        self._bump(PASS)
        return self.note(evidence)

    def warn(self, evidence=""):
        self._bump(WARN)
        return self.note(evidence)

    def fail(self, evidence="", abort=False):
        self._bump(FAIL)
        self.note(evidence)
        if abort:
            raise _AbortCheck(evidence)
        return self

    def skip(self, reason=""):
        self._status = SKIP
        self.note(reason)
        raise SkipCheck(reason)

    # expectations ---------------------------------------------------------

    def expect_true(self, condition, evidence=""):
        if condition:
            self._bump(PASS)
            if evidence:
                self.note(evidence)
            return True
        self._bump(FAIL)
        self.note(evidence or "expected a truthy value")
        return False

    def expect_equal(self, actual, expected, evidence=None):
        if actual == expected:
            self._bump(PASS)
            self.note(evidence if evidence else "%s" % preview(actual, 60))
            return True
        self._bump(FAIL)
        self.note(
            "expected %s, observed %s%s"
            % (
                preview(expected, 80),
                preview(actual, 80),
                (". " + preview(evidence, 80)) if evidence else "",
            )
        )
        return False

    def expect_contains(self, haystack, needle, evidence=None):
        text = haystack if isinstance(haystack, str) else str(haystack)
        if needle in text:
            self._bump(PASS)
            self.note(evidence if evidence else "found %s" % preview(needle, 60))
            return True
        self._bump(FAIL)
        self.note(
            "missing %s in %s%s"
            % (
                preview(needle, 60),
                preview(text, 120),
                (". " + preview(evidence, 60)) if evidence else "",
            )
        )
        return False

    def expect_not_contains(self, haystack, needle, evidence=None):
        text = haystack if isinstance(haystack, str) else str(haystack)
        if needle not in text:
            self._bump(PASS)
            self.note(evidence if evidence else "absent %s" % preview(needle, 60))
            return True
        self._bump(FAIL)
        self.note("unexpected %s present" % preview(needle, 60))
        return False

    def require(self, result, what=None):
        """Gate the block on a runner result and return it when usable.

        SKIPs the check when the runner could not run at all and FAILs it when
        the command ran and returned nonzero or the request errored. Both
        abandon the block.
        """
        label = (
            what
            or getattr(result, "label", "")
            or preview(getattr(result, "cmd", ""), 60)
            or "precondition"
        )
        if getattr(result, "skipped", False):
            self.skip("%s unavailable: %s" % (label, getattr(result, "skip_reason", "")))
        if not getattr(result, "ok", False):
            detail = getattr(result, "stderr", "") or getattr(result, "error", "")
            detail = detail or getattr(result, "stdout", "")
            detail = preview(detail, 140) or "failed"
            self.fail("%s failed: %s" % (label, detail), abort=True)
        return result

    # lifecycle ------------------------------------------------------------

    def _finish(self):
        status = self._status if self._status is not None else PASS
        evidence = ". ".join(self._notes)
        if not evidence:
            evidence = "observed" if status == PASS else ""
        detail = "\n".join([line for line in self._detail if line])
        if self._traceback:
            detail = (detail + "\n" + self._traceback).strip()
        return report(
            self.name,
            status,
            evidence,
            detail,
            duration_ms=int((_time.time() - self._started) * 1000),
        )


@_contextmanager
def check(name, detail=None):
    """Context manager recording exactly one check for the block it wraps."""
    ctx = CheckContext(name, detail=detail)
    try:
        yield ctx
    except SkipCheck:
        pass
    except _AbortCheck:
        pass
    except Exception as exc:  # noqa: BLE001 - a check must never kill the notebook
        ctx._bump(FAIL)
        ctx.note("unexpected %s: %s" % (type(exc).__name__, exc))
        ctx._traceback = _traceback.format_exc()
    finally:
        ctx._finish()


def expect_true(name, condition, evidence="", detail=None):
    """Standalone expectation: record one check from one condition."""
    if condition:
        report(name, PASS, evidence or "condition holds", detail)
        return True
    report(name, FAIL, evidence or "expected a truthy value", detail)
    return False


def expect_equal(name, actual, expected, evidence=None, detail=None):
    """Standalone expectation: record one check comparing two values."""
    if actual == expected:
        report(name, PASS, evidence or preview(actual, 80), detail)
        return True
    report(
        name,
        FAIL,
        "expected %s, observed %s" % (preview(expected, 80), preview(actual, 80)),
        detail,
    )
    return False


def expect_contains(name, haystack, needle, evidence=None, detail=None):
    """Standalone expectation: record one check for a substring."""
    text = haystack if isinstance(haystack, str) else str(haystack)
    if needle in text:
        report(name, PASS, evidence or "found %s" % preview(needle, 60), detail)
        return True
    report(
        name,
        FAIL,
        "missing %s in %s" % (preview(needle, 60), preview(text, 120)),
        detail,
    )
    return False


# ---------------------------------------------------------------------------
# summary and verdict
# ---------------------------------------------------------------------------


def results():
    return list(_RESULTS)


def counts():
    tally = {PASS: 0, FAIL: 0, SKIP: 0, WARN: 0}
    for entry in _RESULTS:
        tally[entry.status] = tally.get(entry.status, 0) + 1
    tally["TOTAL"] = len(_RESULTS)
    return tally


def _text_table(entries, evidence_width):
    rows = [("#", "STATUS", "SECTION", "CHECK", "EVIDENCE")]
    for entry in entries:
        rows.append(
            (
                str(entry.index),
                entry.status,
                entry.section[:24],
                entry.name[:52],
                entry.evidence[:evidence_width],
            )
        )
    widths = [max(len(row[col]) for row in rows) for col in range(5)]
    lines = []
    for position, row in enumerate(rows):
        lines.append("  ".join(row[col].ljust(widths[col]) for col in range(5)).rstrip())
        if position == 0:
            lines.append("  ".join("-" * widths[col] for col in range(5)))
    return "\n".join(lines)


_HTML_COLORS = {PASS: "#2da44e", FAIL: "#f85149", WARN: "#d29922", SKIP: "#8b949e"}


def _escape(text):
    return (
        str(text)
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def _html_table(entries, title, tally):
    head = (
        '<div style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13px">'
        '<div style="font-weight:600;margin-bottom:6px">%s</div>'
        '<div style="margin-bottom:8px">%s</div>'
        '<table style="border-collapse:collapse;width:100%%">'
        "<thead><tr>%s</tr></thead><tbody>"
    ) % (
        _escape(title),
        " &nbsp; ".join(
            '<span style="color:%s">%s %d</span>' % (_HTML_COLORS[key], key, tally.get(key, 0))
            for key in (PASS, FAIL, WARN, SKIP)
        ),
        "".join(
            '<th style="text-align:left;padding:3px 8px;border-bottom:1px solid #8886">%s</th>'
            % label
            for label in ("#", "Status", "Section", "Check", "Evidence")
        ),
    )
    body = []
    for entry in entries:
        body.append(
            "<tr>"
            '<td style="padding:3px 8px;opacity:.6">%d</td>'
            '<td style="padding:3px 8px;color:%s;font-weight:600">%s</td>'
            '<td style="padding:3px 8px;opacity:.75">%s</td>'
            '<td style="padding:3px 8px">%s</td>'
            '<td style="padding:3px 8px;opacity:.85">%s</td>'
            "</tr>"
            % (
                entry.index,
                _HTML_COLORS.get(entry.status, "#8b949e"),
                entry.status,
                _escape(entry.section),
                _escape(entry.name),
                _escape(entry.evidence),
            )
        )
    return head + "".join(body) + "</tbody></table></div>"


def summary(title=None, html=True, only=None, evidence_width=None):
    """Render the compact result table and return it as plain text."""
    entries = results()
    if only:
        wanted = only if isinstance(only, (list, tuple, set, frozenset)) else [only]
        entries = [entry for entry in entries if entry.status in wanted]
    label = title or ("jaen checks: %s" % (_RUN["notebook"] or "unnamed run"))
    tally = counts()
    width = evidence_width or CONFIG["evidence_width"]
    if not entries:
        text = "%s\nno checks recorded" % label
        print(text)
        return text
    table = _text_table(entries, width)
    footer = "%s   TOTAL %d" % (
        "  ".join("%s %d" % (key, tally.get(key, 0)) for key in (PASS, FAIL, WARN, SKIP)),
        tally["TOTAL"],
    )
    text = "%s\n%s\n%s" % (label, table, footer)
    if html and _HAVE_IPYTHON:
        _display(_HTML(_html_table(entries, label, tally)))
    else:
        print(text)
    return text


def verdict(fail_on_warn=False, quiet=False):
    """Return 0 when the run is clean and 1 when it is not. Never raises."""
    tally = counts()
    bad = tally.get(FAIL, 0) + (tally.get(WARN, 0) if fail_on_warn else 0)
    status = FAIL if bad else PASS
    if not quiet:
        line = "VERDICT %s   %s failed, %s warned, %s skipped, %s passed, %s total" % (
            status,
            tally.get(FAIL, 0),
            tally.get(WARN, 0),
            tally.get(SKIP, 0),
            tally.get(PASS, 0),
            tally.get("TOTAL", 0),
        )
        if _HAVE_IPYTHON:
            _display(
                _HTML(
                    '<div style="font-family:ui-monospace,monospace;font-weight:600;color:%s">%s</div>'
                    % (_HTML_COLORS[status], _escape(line))
                )
            )
        else:
            print(line)
    return 1 if bad else 0


def results_json(indent=2):
    payload = {
        "notebook": _RUN["notebook"],
        "started": _RUN["started"],
        "testkit_version": VERSION,
        "counts": counts(),
        "checks": [entry.as_dict() for entry in _RESULTS],
    }
    return _json.dumps(payload, indent=indent, sort_keys=False)


def save_results(path):
    """Write :func:`results_json` to ``path`` and return the path."""
    with open(path, "w", encoding="utf-8") as handle:
        handle.write(results_json())
    return path


# ---------------------------------------------------------------------------
# command runners
# ---------------------------------------------------------------------------


@_dataclass
class CmdResult:
    """The structured outcome of a command. Runners never raise, they return this."""

    rc: int = 0
    stdout: str = ""
    stderr: str = ""
    cmd: str = ""
    label: str = ""
    duration_s: float = 0.0
    timed_out: bool = False
    skipped: bool = False
    skip_reason: str = ""

    @property
    def ok(self):
        return (not self.skipped) and (not self.timed_out) and self.rc == 0

    @property
    def text(self):
        return self.stdout.strip()

    @property
    def lines(self):
        return [line for line in self.stdout.splitlines() if line.strip()]

    def json(self, default=None):
        try:
            return _json.loads(self.stdout)
        except Exception:
            return default

    def evidence(self, limit=200):
        if self.skipped:
            return "skipped: %s" % self.skip_reason
        if self.timed_out:
            return "timed out after %.1fs" % self.duration_s
        body = self.stdout.strip() or self.stderr.strip()
        return "rc=%s %s" % (self.rc, preview(body, limit))


def _skipped_cmd(cmd, reason, label=""):
    return CmdResult(rc=-1, cmd=cmd, label=label, skipped=True, skip_reason=reason)


def sh(cmd, timeout=None, cwd=None, env=None, label=""):
    """Run a local command and return a :class:`CmdResult`. Never raises."""
    timeout = timeout or CONFIG["cmd_timeout"]
    shown = cmd if isinstance(cmd, str) else " ".join(_shlex.quote(part) for part in cmd)
    started = _time.time()
    merged_env = None
    if env:
        merged_env = dict(_os.environ)
        merged_env.update(env)
    try:
        proc = _subprocess.run(
            cmd,
            shell=isinstance(cmd, str),
            cwd=cwd,
            env=merged_env,
            capture_output=True,
            text=True,
            timeout=timeout,
        )
        return CmdResult(
            rc=proc.returncode,
            stdout=proc.stdout or "",
            stderr=proc.stderr or "",
            cmd=shown,
            label=label,
            duration_s=_time.time() - started,
        )
    except _subprocess.TimeoutExpired:
        return CmdResult(
            rc=124,
            stderr="timed out after %ss" % timeout,
            cmd=shown,
            label=label,
            duration_s=_time.time() - started,
            timed_out=True,
        )
    except FileNotFoundError as exc:
        return CmdResult(
            rc=127, stderr=str(exc), cmd=shown, label=label, duration_s=_time.time() - started
        )
    except Exception as exc:  # noqa: BLE001 - runners never raise at the caller
        return CmdResult(
            rc=1, stderr=str(exc), cmd=shown, label=label, duration_s=_time.time() - started
        )


def yarn(args, cwd=None, timeout=None, env=None, label=""):
    """Run a yarn command in the monorepo (or ``cwd``)."""
    return sh(
        "yarn %s" % args,
        cwd=cwd or CONFIG["repo_root"],
        timeout=timeout or CONFIG["build_timeout"],
        env=env,
        label=label or ("yarn %s" % preview(args, 40)),
    )


def node_eval(source, cwd=None, timeout=None, label="node"):
    """Run a short JavaScript snippet through ``node -e`` and return the result.

    The snippet should print JSON on stdout; ``result.json()`` parses it.
    Used for probes that must execute the built artifacts (for example
    importing a compiled locale module and dumping its keys).
    """
    return sh(
        ["node", "-e", source],
        cwd=cwd or CONFIG["repo_root"],
        timeout=timeout or CONFIG["cmd_timeout"],
        label=label,
    )


# ---------------------------------------------------------------------------
# http and graphql
# ---------------------------------------------------------------------------


@_dataclass
class HttpResult:
    """The structured outcome of an HTTP request. Runners never raise."""

    status: int = 0
    body: str = ""
    headers: dict = None
    url: str = ""
    error: str = ""
    skipped: bool = False
    skip_reason: str = ""

    @property
    def ok(self):
        return (not self.skipped) and (not self.error) and 200 <= self.status < 400

    def json(self, default=None):
        try:
            return _json.loads(self.body)
        except Exception:
            return default

    def evidence(self, limit=200):
        if self.skipped:
            return "skipped: %s" % self.skip_reason
        if self.error:
            return "error: %s" % preview(self.error, limit)
        return "HTTP %s %s" % (self.status, preview(self.body, limit))


def http_get(url, headers=None, timeout=None, label=""):
    """GET ``url`` and return an :class:`HttpResult`. Never raises."""
    if not url:
        return HttpResult(url=url, skipped=True, skip_reason="no url configured")
    timeout = timeout or CONFIG["http_timeout"]
    request = _urlrequest.Request(url, headers=headers or {})
    try:
        with _urlrequest.urlopen(request, timeout=timeout) as response:
            return HttpResult(
                status=response.status,
                body=response.read().decode("utf-8", "replace"),
                headers=dict(response.headers),
                url=url,
            )
    except _urlerror.HTTPError as exc:
        return HttpResult(
            status=exc.code,
            body=exc.read().decode("utf-8", "replace") if exc.fp else "",
            url=url,
        )
    except Exception as exc:  # noqa: BLE001
        return HttpResult(url=url, error=str(exc))


def http_post_json(url, payload, headers=None, timeout=None):
    """POST ``payload`` as JSON and return an :class:`HttpResult`."""
    if not url:
        return HttpResult(url=url, skipped=True, skip_reason="no url configured")
    timeout = timeout or CONFIG["http_timeout"]
    data = _json.dumps(payload).encode("utf-8")
    merged = {"Content-Type": "application/json"}
    merged.update(headers or {})
    request = _urlrequest.Request(url, data=data, headers=merged, method="POST")
    try:
        with _urlrequest.urlopen(request, timeout=timeout) as response:
            return HttpResult(
                status=response.status,
                body=response.read().decode("utf-8", "replace"),
                headers=dict(response.headers),
                url=url,
            )
    except _urlerror.HTTPError as exc:
        return HttpResult(
            status=exc.code,
            body=exc.read().decode("utf-8", "replace") if exc.fp else "",
            url=url,
        )
    except Exception as exc:  # noqa: BLE001
        return HttpResult(url=url, error=str(exc))


def graphql(url, query, variables=None, headers=None, timeout=None):
    """POST a GraphQL query and return an :class:`HttpResult`."""
    return http_post_json(
        url,
        {"query": query, "variables": variables or {}},
        headers=headers,
        timeout=timeout,
    )


# ---------------------------------------------------------------------------
# files and xml
# ---------------------------------------------------------------------------


def read_text(path, default=None):
    """Read a text file, returning ``default`` when it does not exist."""
    try:
        return _Path(path).read_text(encoding="utf-8")
    except Exception:
        return default


@_dataclass
class XmlResult:
    """A parsed XML document, or the reason it could not be parsed."""

    root: object = None
    path: str = ""
    error: str = ""

    @property
    def ok(self):
        return self.root is not None

    def evidence(self, limit=200):
        if self.error:
            return "xml error: %s" % preview(self.error, limit)
        return "parsed %s" % self.path


# XML namespaces of a sitemap with hreflang alternates
SITEMAP_NS = {
    "sm": "http://www.sitemaps.org/schemas/sitemap/0.9",
    "xhtml": "http://www.w3.org/1999/xhtml",
}


def xml_file(path):
    """Parse an XML file and return an :class:`XmlResult`. Never raises."""
    try:
        tree = _etree.parse(path)
        return XmlResult(root=tree.getroot(), path=str(path))
    except Exception as exc:  # noqa: BLE001
        return XmlResult(path=str(path), error=str(exc))


def sitemap_entries(root):
    """Flatten a parsed sitemap urlset into a list of dicts.

    Each entry carries ``loc``, ``lastmod``, ``changefreq``, ``priority`` and
    ``alternates`` (a list of ``{"hreflang": ..., "href": ...}``).
    """
    entries = []
    for url in root.findall("sm:url", SITEMAP_NS):
        entry = {
            "loc": (url.findtext("sm:loc", default="", namespaces=SITEMAP_NS) or "").strip(),
            "lastmod": (url.findtext("sm:lastmod", default="", namespaces=SITEMAP_NS) or "").strip(),
            "changefreq": (
                url.findtext("sm:changefreq", default="", namespaces=SITEMAP_NS) or ""
            ).strip(),
            "priority": (
                url.findtext("sm:priority", default="", namespaces=SITEMAP_NS) or ""
            ).strip(),
            "alternates": [
                {
                    "hreflang": link.get("hreflang", ""),
                    "href": link.get("href", ""),
                }
                for link in url.findall("xhtml:link", SITEMAP_NS)
                if link.get("rel") == "alternate"
            ],
        }
        entries.append(entry)
    return entries
