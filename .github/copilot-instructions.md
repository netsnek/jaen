<!-- Copilot / AI agent instructions for contributors and coding agents -->

# Copilot Instructions — jaen (monorepo)

Purpose: give an AI coding agent the minimal, actionable context to be immediately productive in this repository.

- Big picture
  - This is a Yarn workspaces monorepo (see [package.json](package.json)).
  - The project is a Gatsby-based CMS framework. Major pieces live under `packages/` (core libs and Gatsby plugins) and `examples/` (consumer Gatsby sites).
  - Key packages to inspect when making changes: `packages/jaen`, `packages/gatsby-plugin-jaen`, `packages/gatsby-source-jaen`, `packages/gatsby-jaen-app`, `packages/gatsby-jaen-lens`, `packages/gatsby-jaen-mailpress`, and `packages/gatsby-jaen-resource`.

- How to run / build (use these exact commands)
  - Install dependencies: `yarn install` (root). Do not use `npm` — the repo expects Yarn workspaces.
  - Build all packages: `yarn build` (root) — this runs the workspace build scripts defined in `package.json`.
  - Run an example site locally: `cd examples/my-gatsby-site && yarn install && yarn start` (open at http://localhost:8000).
  - To build an individual package from root: `yarn workspace <package-name> run build` (e.g. `yarn workspace gatsby-plugin-jaen run build`).

- Repository conventions and patterns
  - Code is TypeScript where applicable; some Gatsby entry files use CommonJS (`gatsby-node.js`, `gatsby-config.js`).
  - Gatsby plugins and themes follow Gatsby conventions: `gatsby-node.js`, `gatsby-config.js`, `gatsby-ssr.tsx`, `gatsby-browser.tsx` inside the package folder.
  - Reusable UI/data primitives are in `packages/*/src` — prefer editing in-package and then running the package build.
  - Fields and page editable components follow the Jaen Field API described in the root README (see [README.md](README.md#how-to-code)).

- Integration points & external dependencies
  - The project integrates with Gatsby (static site generation) and IPFS for image hosting (see Field docs in README).
  - Releases use `semantic-release` and monorepo-aware publishing; changelogs and commit-analysis tooling are configured in `package.json` devDependencies.

- What to change and test locally
  - When changing a package that is consumed by examples, update the package, run `yarn workspace <pkg> run build`, then start the example site to verify behavior.
  - For UI changes, test in the example sites under `examples/` — they reflect realistic usage patterns.

- Notes for code edits by AI agents
  - Preserve public APIs and package.json exported names unless the change is intentionally breaking.
  - Maintain TypeScript typings; run local builds to catch type errors (`yarn build`).
  - Use existing project patterns: follow `gatsby-*` plugin structure, keep field names descriptive (see README Fields section).

- Helpful files to open first
  - [README.md](README.md) — project overview and developer notes.
  - [package.json](package.json) — workspaces and root scripts.
  - [packages/gatsby-plugin-jaen/gatsby-config.js](packages/gatsby-plugin-jaen/gatsby-config.js) — example plugin structure.
  - [packages/gatsby-jaen-resource/client/iam/schema.generated.ts](packages/gatsby-jaen-resource/client/iam/schema.generated.ts) — example generated file to avoid editing by hand.

If anything here is unclear or you want additional examples (build logs, preferred test commands, or key source files to reference), tell me which area to expand and I will update this file.
