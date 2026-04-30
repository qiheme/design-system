# Cobalt Design System — CLAUDE.md

**Package:** `@q-labs/cobalt`
**Repo:** https://github.com/q-labs/cobalt
**Storybook:** https://q-labs.github.io/cobalt

Cobalt is the React component library for the Quincy OS design system by Cloud129 Technologies. It is dark-first, cobalt-and-crimson accented, and built on Space Grotesk / DM Sans / JetBrains Mono.

---

## Architecture

Components are organized by **Atomic Design** levels:

```
src/
  tokens/       CSS custom properties (primitives + semantic)
  typography/   Display, Heading, Body, Label, Mono
  atoms/        Button, Badge, Tag, Avatar, Input, ProgressBar, StatusDot, ...
  molecules/    NavItem, MetricCard, SignalItem, TimelineItem, ...
  organisms/    Sidebar, TopNav, Hero, ProjectCard, Card, ...
  templates/    DashboardLayout, PortfolioLayout, ResumeLayout, LandingLayout
  provider/     CobaltProvider (injects tokens, sets data-theme)
  index.ts      Master export
```

---

## Adding a New Component

Every component lives in its own directory and ships 5 files:

```
atoms/MyComponent/
  MyComponent.tsx       implementation
  MyComponent.module.css styles (CSS Modules)
  MyComponent.test.tsx  unit + interaction tests
  MyComponent.stories.tsx Storybook stories
  index.ts              re-export
```

Then add the export to the parent level's `index.ts` and to `src/index.ts`.

---

## GitHub Issue → PR Workflow

**Every piece of work starts with a GitHub issue. No exceptions.**

1. **Open an issue first** — before writing any code, open a GitHub issue that describes what will be built, why, and any design decisions. Use `gh issue create`. Reference the issue number in all commits (`#123`) and in the PR description.

2. **Branch from the issue** — create a branch named after the issue: `feat/123-my-component` or `fix/123-broken-thing`.

3. **Close on merge** — the PR description must include `Closes #123` so the issue auto-closes when the PR merges.

If you are asked to implement something and no issue exists, create one before touching any code.

---

## TDD Workflow (Red → Green → Refactor)

**Every component is built across 3 commits. No exceptions.**

1. **Red commit** — write `MyComponent.test.tsx` and `MyComponent.stories.tsx` first. The test file imports a component that doesn't exist yet, so `vitest run` will fail. Commit with message: `test(MyComponent): red — tests before implementation (#123)`.

2. **Green commit** — write `MyComponent.tsx` and `MyComponent.module.css` with the minimal implementation that makes all tests pass. Commit: `feat(MyComponent): green — minimal passing implementation (#123)`.

3. **Refactor commit** — clean up, extract shared patterns, tighten CSS. Tests must still pass. Commit: `refactor(MyComponent): clean up implementation (#123)`.

CI enforces 100% coverage. A PR cannot merge until all checks are green.

---

## CSS Rules

- **CSS Modules only** — no inline styles, no Tailwind, no styled-components.
- **All values use design tokens** — `var(--accent-default)` not `#2563EB`.
- Token file: `src/tokens/index.css`. Primitive tokens are prefixed `--cobalt-*`. Semantic tokens are unprefixed (`--bg-base`, `--text-primary`, etc.).
- Dark mode is the default (`:root`). Light mode overrides via `[data-theme="light"]`.
- Use `CobaltProvider` or set `data-theme` on any ancestor element.

---

## Testing Rules

- **100% coverage enforced** on lines, functions, branches, and statements.
- Stories (`.stories.tsx`) and config files are excluded from coverage.
- Every variant prop must be exercised in tests.
- Interactive components must test user events via `@testing-library/user-event`.
- Storybook `play` functions are used for integration-level interaction tests.

Run coverage locally:
```bash
npm run test:coverage
```

---

## Storybook

Stories live alongside components. Organize by atomic level in `.storybook/preview.ts`. The Storybook is dark-default and uses the Cobalt token CSS.

```bash
npm run storybook       # dev server on :6006
npm run build-storybook # static output → storybook-static/
```

---

## Publishing

The package is published to **GitHub Packages** as `@q-labs/cobalt` using [Changesets](https://github.com/changesets/changesets).

### As a contributor — add a changeset to your PR

Every PR that changes component behaviour, API, or tokens must include a changeset file. Run this inside the repo:

```bash
npx changeset
```

The CLI prompts you to pick `patch` / `minor` / `major` and write a short human-readable summary. It creates a file like `.changeset/fuzzy-cat-drinks.md` — commit it with your PR. A PR with no changeset file will not trigger a version bump or publish when merged.

| Bump type | When to use |
|---|---|
| `patch` | Bug fixes, internal refactors with no API change |
| `minor` | New components or props, backwards-compatible additions |
| `major` | Removed/renamed exports, breaking prop changes, token renames |

### How the release pipeline works

1. Your PR (with `.changeset/*.md`) merges to `main`.
2. The `changeset.yml` workflow detects pending changesets and opens (or updates) a **"Version Packages" PR** that bumps `package.json` and appends to `CHANGELOG.md`.
3. The team merges the "Version Packages" PR.
4. The workflow runs again — no pending changesets remain, so it runs `npm run release` and publishes to GitHub Packages automatically.

### For consumers

Add to `.npmrc` in your project:
```
@q-labs:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=<GITHUB_PAT_WITH_READ_PACKAGES>
```

Then install:
```bash
npm install @q-labs/cobalt
```

Wrap your app and import components:
```tsx
import { CobaltProvider, Button, Badge } from '@q-labs/cobalt'
import '@q-labs/cobalt/styles.css'
```

---

## Self-Updating README

The `readme.yml` workflow runs on every push to `main`. It counts components, reads coverage from the lcov report, and rewrites the README stats table. Never manually edit the auto-generated section between `<!-- STATS:START -->` and `<!-- STATS:END -->`.
