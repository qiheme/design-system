# @q-labs/cobalt

## 0.1.1

### Patch Changes

- c8f9011: Add missing auth token line to consumer `.npmrc` install instructions in README.

## 0.1.0

### Minor Changes

- a196e32: Initial release of Cobalt — 43 React components across Typography, Atoms, Molecules, Organisms, and Templates. Includes a full CSS custom-property token system (cobalt + crimson palette, dark-first), 100% test coverage enforced via Vitest v8, Storybook 8 with play functions, dual ESM/CJS build via Vite lib mode, and GitHub Actions workflows for CI, Storybook Pages, README stats, and publishing.

- 2f18611: Refactored the build to support per-component imports with colocated CSS. Added `gen-exports.mjs` and `build-css-bundle.mjs` scripts; updated `vite.config.ts` to emit individual entry points and a single `styles.css` bundle alongside each component's scoped stylesheet.

- ad5edbe: Fixed Storybook deployment: excluded the `colocateCss` Vite plugin from the Storybook build and set the correct `base` path for GitHub Pages. Added CI workflow (`ci.yml`) and the Storybook publish workflow (`storybook.yml`).

- 62cb2e3: Rebranded the package scope from `@qiheme/cobalt` to `@q-labs/cobalt`. Updated repository, homepage, and bugs URLs. Adopted Changesets for version management and publishing — added `@changesets/cli`, `.changeset/config.json`, and the `changeset.yml` GitHub Actions workflow that opens a Version PR on pending changesets and publishes to GitHub Packages when that PR merges.
