# Contributing Guide

Thank you for your interest in contributing to A-MultiLayout-Splitter! This guide will help you get set up and familiar with the project workflow.

## Prerequisites

Before you begin, make sure you have the following installed:

| Tool | Version |
| ---- | ------- |
| [Node.js](https://nodejs.org/) | >= 16 (20 recommended) |
| [pnpm](https://pnpm.io/) | >= 8 |
| [Git](https://git-scm.com/) | Latest |

::: warning
This project uses **pnpm** as its package manager. Do not use npm or yarn — they will not work correctly with the monorepo setup.
:::

## Project Structure

```
A-MultiLayout-Splitter/
├── packages/
│   └── core/              # Main library package
│       ├── src/            # Source code
│       │   ├── __tests__/  # Unit tests
│       │   └── test/       # Test setup & mocks
│       ├── examples/       # Internal examples
│       └── vite.config.ts  # Build & test config
├── docs/                   # VitePress documentation site
│   ├── .vitepress/
│   │   ├── config.ts       # Docs site config
│   │   └── theme/          # Custom theme & demos
│   ├── guide/              # Guide pages
│   ├── api/                # API reference pages
│   └── examples/           # Interactive demo pages
├── examples/               # Standalone example apps
├── release.config.mjs      # Semantic release config
└── pnpm-workspace.yaml     # Monorepo workspace config
```

## Getting Started

### 1. Fork & Clone

```bash
git clone https://github.com/<your-username>/A-MultiLayout-Splitter.git
cd A-MultiLayout-Splitter
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Start Development

```bash
# Run the example app with hot-reload
pnpm dev

# Or build the core library in watch mode
pnpm --filter @a-multilayout-splitter/core dev
```

### 4. Run the Docs Site Locally

```bash
pnpm docs:dev
```

## Development Workflow

### Branching

| Branch | Purpose |
| ------ | ------- |
| `main` | Stable production releases |
| `v6` | Active development (v6 alpha/beta) |

**Always branch off `v6`** for new work:

```bash
git checkout v6
git pull origin v6
git checkout -b feat/your-feature
```

### Commit Messages

This project uses [Conventional Commits](https://www.conventionalcommits.org/) for automated releases via semantic-release.

**Format:** `type(scope): description`

| Type | When to use |
| ---- | ----------- |
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation only changes |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `test` | Adding or updating tests |
| `chore` | Maintenance tasks (CI, build, deps) |

**Examples:**

```
feat(core): add collapsible pane support
fix(core): prevent layout shift on rapid resize
docs: add nested layout guide
test: add coverage for keyboard plugin
```

## Running Tests

Tests are written with [Vitest](https://vitest.dev/) and [Testing Library](https://testing-library.com/).

```bash
# Run all tests
pnpm test

# Run tests for the core package only
pnpm --filter @a-multilayout-splitter/core test

# Run tests with the Vitest UI
pnpm --filter @a-multilayout-splitter/core test:ui
```

### Coverage Requirements

The project enforces **80% minimum** coverage thresholds across:

- Lines
- Functions
- Branches
- Statements

Make sure your changes don't drop coverage below these thresholds.

## Code Style

This project uses [Prettier](https://prettier.io/) for formatting. There is no ESLint configuration — Prettier handles all style concerns.

**Key formatting rules:**

| Rule | Value |
| ---- | ----- |
| Print width | 180 |
| Semicolons | Yes |
| Quotes | Single |
| Trailing commas | ES5 |
| Indentation | 2 spaces |

### Formatting Commands

```bash
# Format all files
pnpm format
```

If you use VS Code, formatting is applied automatically on save via the included workspace settings.

## Building

```bash
# Build the core library
pnpm build:core

# Build everything (all packages)
pnpm build
```

The core library outputs:

- `dist/index.js` — ES module
- `dist/index.cjs` — CommonJS
- `dist/index.d.ts` — TypeScript declarations
- `dist/style.css` — Styles

## Submitting a Pull Request

1. **Create your branch** from `v6` (not `main`).
2. **Make your changes** with clear, focused commits.
3. **Add or update tests** for any new functionality.
4. **Run tests** locally to make sure everything passes.
5. **Format your code** with `pnpm format`.
6. **Push your branch** and open a PR against the `v6` branch.

### PR Checklist

- [ ] Branch is based on `v6`
- [ ] Tests pass (`pnpm test`)
- [ ] Build succeeds (`pnpm build:core`)
- [ ] Code is formatted (`pnpm format`)
- [ ] Commit messages follow Conventional Commits
- [ ] New features include tests

## CI Pipeline

When you open a PR, GitHub Actions will automatically:

1. **Run tests** across a matrix of React versions (18 & 19)
2. **Build** the core library to verify it compiles

Both checks must pass before a PR can be merged.

## Reporting Issues

Found a bug or have a feature request? [Open an issue](https://github.com/AmanKrr/A-MultiLayout-Splitter/issues) with:

- A clear title and description
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Your environment (React version, browser, OS)

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](https://github.com/AmanKrr/A-MultiLayout-Splitter/blob/v6/LICENSE).
