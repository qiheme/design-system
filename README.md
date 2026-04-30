# Cobalt

> React component library for the Quincy OS design system by Cloud129 Technologies.

[![CI](https://github.com/q-labs/cobalt/actions/workflows/ci.yml/badge.svg)](https://github.com/q-labs/cobalt/actions/workflows/ci.yml)
[![Storybook](https://img.shields.io/badge/Storybook-live-FF4785?logo=storybook&logoColor=white)](https://q-labs.github.io/cobalt)
[![npm](https://img.shields.io/badge/npm-%40q--labs%2Fcobalt-blue)](https://github.com/q-labs/cobalt/packages)

Dark-first. Cobalt and crimson. Space Grotesk / DM Sans / JetBrains Mono.

---

## Install

Add to `.npmrc` in your project:

```
@q-labs:registry=https://npm.pkg.github.com
```

Then install:

```bash
npm install @q-labs/cobalt
```

## Usage

```tsx
import { CobaltProvider, Button, Badge } from '@q-labs/cobalt'
import '@q-labs/cobalt/styles.css'

export default function App() {
  return (
    <CobaltProvider>
      <Button variant="primary">Launch</Button>
      <Badge variant="active">Active</Badge>
    </CobaltProvider>
  )
}
```

### Per-component imports (optional, for leaner bundles)

If your app only uses a few components and you want to avoid shipping the full stylesheet, import each component from its own subpath. Each subpath pulls only that component's JS and CSS:

```tsx
import { CobaltProvider } from '@q-labs/cobalt/CobaltProvider'
import { Button } from '@q-labs/cobalt/Button'
import { Badge } from '@q-labs/cobalt/Badge'
// Skip '@q-labs/cobalt/styles.css' — each component imports its own scoped CSS.

export default function App() {
  return (
    <CobaltProvider>
      <Button variant="primary">Launch</Button>
      <Badge variant="active">Active</Badge>
    </CobaltProvider>
  )
}
```

`CobaltProvider` injects design tokens automatically. Both import styles can be mixed; with proper ESM tree-shaking they produce equivalent bundles, but the subpath form is a guaranteed-minimal entrypoint for bundlers that don't fully tree-shake CSS side-effects through the root barrel.

---

## Components

<!-- STATS:START -->
| Metric | Value |
|---|---|
| Version | `v0.1.0` |
| Total components | 42 |
| Typography | 5 |
| Atoms | 11 |
| Molecules | 12 |
| Organisms | 10 |
| Templates | 4 |
| Test coverage | 100% |
<!-- STATS:END -->

### Typography
`Display` `Heading` `Body` `Label` `Mono`

### Atoms
`Button` `Badge` `Tag` `Avatar` `Input` `ProgressBar` `ProgressMini` `StatusDot` `Divider` `NavBadge` `LogoMark`

### Molecules
`NavItem` `MetricCard` `StatItem` `SignalItem` `TimelineItem` `MissionItem` `UserBlock` `ContactItem` `QuickStatRow` `SkillRow` `ExperienceRole` `EducationEntry`

### Organisms
`Card` `TopNav` `Topbar` `Hero` `ProjectCard` `FeatureCard` `Sidebar` `StatsRow` `ExperienceBlock` `StatusBar`

### Templates
`DashboardLayout` `PortfolioLayout` `ResumeLayout` `LandingLayout`

---

## Development

```bash
npm run storybook        # Component explorer on :6006
npm run test:coverage    # Run tests with 100% coverage enforcement
npm run typecheck        # TypeScript type check
npm run build            # Library build → dist/
npm run build-storybook  # Static Storybook → storybook-static/
```

## Publishing

Releases are managed by Changesets. See [CLAUDE.md](./CLAUDE.md) for the contributor workflow.

---

## Design Tokens

Import tokens directly for custom integrations:

```css
@import '@q-labs/cobalt/tokens';
```

Token categories: color primitives (`--cobalt-*`, `--crimson-*`), semantic colors (`--bg-base`, `--text-primary`, `--accent-default`), typography scale, spacing, border radius.

---

## License

MIT © Cloud129 Technologies
