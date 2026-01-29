# [6.0.0-alpha.5](https://github.com/AmanKrr/A-MultiLayout-Splitter/compare/v6.0.0-alpha.4...v6.0.0-alpha.5) (2026-01-29)


### Bug Fixes

* remove default export to avoid CJS/ESM interop issues ([64d116f](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/64d116fc59c30d9e629a4617f0ae4f73fb893303))


### Features

* Added new test cases ([de3da5e](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/de3da5e1a08ba2a37ed8efa6c260a1f92a1e9570))
* Added support for react 17 and 19 ([1521e17](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/1521e17bd6e473e6ad71fca3829e8ad387bbbaa1))

# [6.0.0-alpha.4](https://github.com/AmanKrr/A-MultiLayout-Splitter/compare/v6.0.0-alpha.3...v6.0.0-alpha.4) (2026-01-28)


### Bug Fixes

* **docs:** update license badge link to v6 branch ([a85b293](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/a85b2938f7ef4cb081d1ff1091483269864b5cd4))

# [6.0.0-alpha.3](https://github.com/AmanKrr/A-MultiLayout-Splitter/compare/v6.0.0-alpha.2...v6.0.0-alpha.3) (2026-01-28)


### Features

* **docs:** Add button star on github ([7170661](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/7170661c9bbf69798c075a170b18cb45a85a262e))
* **docs:** add SVG logo, favicon, and improve UI styling ([e87a87f](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/e87a87ff7af96ee173729292f6043d1e68241f68))

# [6.0.0-alpha.2](https://github.com/AmanKrr/A-MultiLayout-Splitter/compare/v6.0.0-alpha.1...v6.0.0-alpha.2) (2026-01-28)


### Bug Fixes

* **ci:** update pnpm version to 10 for lockfile compatibility ([d9ed569](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/d9ed569692718ea0bf7ee5d1edf445cbe436a7e5))
* **core:** add package metadata and README for npm ([12c7e7a](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/12c7e7a580eb24144fb679ac2587c50d47c499cb))

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
