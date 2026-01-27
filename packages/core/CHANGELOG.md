# [6.0.0-alpha.1](https://github.com/AmanKrr/A-MultiLayout-Splitter/compare/v5.2.1...v6.0.0-alpha.1) (2026-01-27)

### Bug Fixes

- Preserve user-resized pane dimensions by conditionally applying initial sizes and update pane content when children change without resetting layout. ([7d96bdc](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/7d96bdcc334a51f6c27363ac9dd623adb6fa1293))
- The handlebar space calculation only considers handlebars belonging to the current Split container ([ca49f4e](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/ca49f4e58653d07fe69e229e71ea64b52f7fb1b9))

- feat!: introduce v6 core architecture ([fc3c07f](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/fc3c07f0b697c519e5c2a038ddd3847039c9de48))

### Features

- complete v6 documentation site with interactive demos and github actions deployment ([f3331e9](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/f3331e981451adc9b0ed029d7a1a8c3c9f48697e))
- introduce `useSplitController` hook for external state management, enhance `Split` initial size handling, and add comprehensive nested layout documentation and demos. ([c609a7b](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/c609a7b6d325f169a59c3d766f3e6d00eaf304cf))
- Introduce SplitRef API for imperative control, define core types for a plugin architecture, and add a props playground example. ([f619720](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/f619720d55412612fa82d050829d5b3be5ebb7eb))

### BREAKING CHANGES

- The Split component has been completely re-architected.
  v6 introduces a new layout engine, plugin system, imperative SplitRef API,
  new hooks (useSplitController), and removes v5 legacy behavior.
  The v5 API is not compatible with v6.
