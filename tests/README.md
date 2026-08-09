# tests: the jaen notebook verification suite

A Jupyter test suite for the jaen monorepo. **One notebook per concern**, every
notebook records a list of named checks through [`jaen_testkit.py`](jaen_testkit.py),
and every check comes out as PASS, FAIL, SKIP or WARN with the evidence attached.

The suite is written in Python on purpose. The implementation is TypeScript;
the tests judge what a build actually produced — compiled artifacts, generated
pages, `sitemap.xml`, GraphQL schemas — instead of shortcutting through the
implementation's own internals.

Building is allowed, deploying is not: notebooks may install and build the
working copies, but anything that publishes (push, deploy, send real mail)
belongs in a **markdown** cell for a human to run.

## The notebooks

| Notebook | Verifies |
|---|---|
| `00-preflight.ipynb` | toolchain, working copies, workspace layout |
| `01-build.ipynb` | package builds: jaen, gatsby-plugin-jaen, gatsby-source-jaen, gatsby-jaen-emailwerk |
| `02-cms-i18n.ipynb` | CMS locale dictionaries: completeness across all locales, ICU syntax, locale resolution order |
| `03-pages-i18n.ipynb` | the fixture site build: localized page variants, `<html lang>`, canonical links |
| `04-sitemap.ipynb` | `sitemap.xml`: well-formed, absolute URLs, full reciprocal hreflang matrix + x-default, exclusions, `robots.txt` |
| `05-emailwerk.ipynb` | emailwerk API parity with the jaen client's expectations |
| `06-zitadel-gql.ipynb` | zitadel-gql client/SDL conformance; no legacy REST usergrant calls |

## Install

```bash
cd tests
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

The testkit itself needs nothing but the Python standard library. The
requirements file exists for Jupyter and papermill.

## Run

Interactively:

```bash
source .venv/bin/activate
jupyter lab
```

Headless:

```bash
source .venv/bin/activate
papermill 04-sitemap.ipynb out/04-sitemap-output.ipynb
```

## Configuration

Everything is overridable through the environment (see `CONFIG` in the
testkit): `JAEN_ROOT` (monorepo root), `JAEN_SITE_DIR` (the netsnek.com
checkout used as the end-to-end fixture), `JAEN_EMAILWERK_DIR`,
`JAEN_IAM_SDL`, `JAEN_EMAILWERK_URL`, `JAEN_ZITADEL_GQL_URL`,
`JAEN_SITE_LOCALES`, `JAEN_SITE_DEFAULT_LOCALE`, `JAEN_CMS_LOCALES`.
Checks whose preconditions are missing SKIP with a reason instead of failing.
