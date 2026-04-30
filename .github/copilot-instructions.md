# GitHub Copilot Instructions — Cobalt Design System

## What this repo is
`@q-labs/cobalt` is a React component library following Atomic Design principles (atoms → molecules → organisms → templates). It is the UI layer for the Quincy OS / Cloud129 design system.

## File structure for every component
Each component lives in its own folder with exactly these files:
- `ComponentName.tsx` — React component
- `ComponentName.module.css` — CSS Modules styles
- `ComponentName.test.tsx` — Vitest + React Testing Library tests
- `ComponentName.stories.tsx` — Storybook stories
- `index.ts` — re-export: `export { default } from './ComponentName'`

## Issue → PR workflow
**Always open a GitHub issue before writing any code.** Use `gh issue create` with a title and body describing what will be built. Reference the issue number in every commit message (`#123`) and include `Closes #123` in the PR description so the issue auto-closes on merge. If an issue already exists, use it. If it doesn't, create it first.

Branch naming: `feat/123-my-component` or `fix/123-broken-thing`.

## TDD first
Always write the test file before the implementation. The test must fail first (Red), then be made to pass (Green), then refactored.

## CSS rules
- CSS Modules only — `import styles from './ComponentName.module.css'`
- No inline `style={{}}` props
- No hardcoded color/spacing values — always use `var(--token-name)`
- Design tokens are in `src/tokens/index.css`, prefixed `--cobalt-*` for primitives and unprefixed for semantic tokens (`--bg-base`, `--text-primary`, `--accent-default`, etc.)
- Dark mode is default on `:root`; light mode is `[data-theme="light"]`

## TypeScript rules
- No `any` types
- All component props must be fully typed with a named interface: `interface ButtonProps { ... }`
- Use `React.ComponentPropsWithoutRef<'button'>` spread for native element props
- Export the props interface from `index.ts`

## Testing rules
- 100% coverage required — every branch and variant must be tested
- Use `@testing-library/user-event` for click, type, focus events (not `fireEvent`)
- Use `screen.getByRole` and semantic queries over `getByTestId`
- Every variant prop value must have at least one test case

## Storybook rules
- Every component needs a `Default` story plus one named story per major variant
- Use `play` functions for interactive components (Button click, Input type, etc.)
- Stories are excluded from coverage

## What NOT to do
- Do not add Tailwind, emotion, styled-components, or any CSS-in-JS
- Do not hardcode colors, spacing, or font values
- Do not use `any` or `@ts-ignore`
- Do not write comments explaining what code does — only write comments for non-obvious WHY
- Do not create new files outside the component folder pattern
