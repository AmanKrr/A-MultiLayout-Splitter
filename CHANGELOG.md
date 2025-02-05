## [5.2.1](https://github.com/AmanKrr/A-MultiLayout-Splitter/compare/v5.2.0...v5.2.1) (2025-02-05)


### Bug Fixes

* context state logical render ([eabeaa3](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/eabeaa353cfd617e3ff32e3a3262ceece024b7bc))

# [5.2.0](https://github.com/AmanKrr/A-MultiLayout-Splitter/compare/v5.1.1...v5.2.0) (2024-12-11)


### Bug Fixes

* reset localStorage when pane count changes ([50ecddf](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/50ecddfdc874288944b77c3ce33ef68c26e2fa5a))


### Features

* export panel size saving utilities ([d430f33](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/d430f33411cd0753d1d31bc7a5243861093cdd3c))

## [5.1.1](https://github.com/AmanKrr/A-MultiLayout-Splitter/compare/v5.1.0...v5.1.1) (2024-11-18)


### Bug Fixes

* prevent pane movement beyond min/max on sudden mouse up ([b6006a7](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/b6006a75e547470c059cc3216665e370901fc8ba))

# [5.1.0](https://github.com/AmanKrr/A-MultiLayout-Splitter/compare/v5.0.0...v5.1.0) (2024-11-14)


### Features

* Add direction argument in onLayoutChange callback ([fffc4bb](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/fffc4bba357a227be806038c1008e55e62cf8e2d))

# [5.0.0](https://github.com/AmanKrr/A-MultiLayout-Splitter/compare/v4.2.0...v5.0.0) (2024-10-14)


### Bug Fixes

* draghandle open/close direction, onLayoutChange callback size and reason argument improvement. ([478d274](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/478d274844862b8e2606b5bcb783a12963270978))
* local storage removal while adding or removing pane ([b6f810a](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/b6f810ab2012922b8be41a4d86829ba388cfdcc7))
* mis configuration of pane while initialize ([07e33fb](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/07e33fbc4f367d88c465f38337aa32e99f19b365))
* Remove pane method do not resize the pane. ([8589b94](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/8589b94a337aecd68ae404b942903e1d3def9a48))
* set local storage layout if current layout pane count match ([6b99a9a](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/6b99a9a7893a4f60c15520811380c91672e001b4))
* Type fix and context export fix ([02e67f4](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/02e67f4c0c3695edf60c3d57fd242fa8e2b83abb))


### Features

* add and remove panes with context provider. ([ce9604e](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/ce9604e1d848f287c9e191d367a5d015544f3f0f))


### BREAKING CHANGES

* The Split component must now be wrapped in SplitStateProvider for proper state management.

# [4.3.0-beta-preview.7](https://github.com/AmanKrr/A-MultiLayout-Splitter/compare/v4.3.0-beta-preview.6...v4.3.0-beta-preview.7) (2024-10-13)


### Bug Fixes

* draghandle open/close direction, onLayoutChange callback size and reason argument improvement. ([a8bd83c](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/a8bd83c09865215b3b54ad9b60b3b429416cbe07))

# [4.3.0-beta-preview.6](https://github.com/AmanKrr/A-MultiLayout-Splitter/compare/v4.3.0-beta-preview.5...v4.3.0-beta-preview.6) (2024-09-27)


### Bug Fixes

* mis configuration of pane while initialize ([8bb4e02](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/8bb4e02538342a1cb99b5f396d31ce2c37458d3c))

# [4.3.0-beta-preview.5](https://github.com/AmanKrr/A-MultiLayout-Splitter/compare/v4.3.0-beta-preview.4...v4.3.0-beta-preview.5) (2024-09-27)


### Bug Fixes

* set local storage layout if current layout pane count match ([7261b9e](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/7261b9e6c5f2e13c337cf120b4da9106652d3fd4))

# [4.3.0-beta-preview.4](https://github.com/AmanKrr/A-MultiLayout-Splitter/compare/v4.3.0-beta-preview.3...v4.3.0-beta-preview.4) (2024-09-26)


### Bug Fixes

* Remove pane method do not resize the pane. ([13dc7b8](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/13dc7b8126162cdbcb5b4ca3438d555481dd3694))

# [4.3.0-beta-preview.3](https://github.com/AmanKrr/A-MultiLayout-Splitter/compare/v4.3.0-beta-preview.2...v4.3.0-beta-preview.3) (2024-09-25)


### Bug Fixes

* local storage removal while adding or removing pane ([642b5bf](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/642b5bf3300ca3e64a815bf3bd2dc1f1dea089f2))

# [4.3.0-beta-preview.2](https://github.com/AmanKrr/A-MultiLayout-Splitter/compare/v4.3.0-beta-preview.1...v4.3.0-beta-preview.2) (2024-09-25)


### Bug Fixes

* Type fix and context export fix ([d3eef28](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/d3eef28147aa174240a127ad3efa0aff46f36722))

# [4.3.0-beta-preview.1](https://github.com/AmanKrr/A-MultiLayout-Splitter/compare/v4.2.0...v4.3.0-beta-preview.1) (2024-09-24)


### Features

* Add or Remove Pane from split. ([bf6de05](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/bf6de055e6f9031bb551fff2c4de7fa780dafa52))

# [4.2.0](https://github.com/AmanKrr/A-MultiLayout-Splitter/compare/v4.1.1...v4.2.0) (2024-05-12)


### Bug Fixes

* Resolve collapse bug when only one pane is closed ([945f3f7](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/945f3f75f0e548cc27c0b3b9c616c62b8fbfdc33))


### Features

* Add setResizePane method to splitUtils class ([2927dc4](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/2927dc47c7ae2359a5e6fe5012e01bc15df16ab2))
* Introduce callback props for pane open/close events ([6ee4088](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/6ee40880e2e9f4ddb4e5c79b6ec21541eca77ccc))
* Introduce callback props for pane open/close events ([12f06ea](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/12f06eab1b813f864ec6b6528dfe43ade62de5f1))


### Performance Improvements

* Improve performance by caching DOM elements ([6562f7d](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/6562f7decf3bf86b8a1928f635a3166fda069a57))


### Reverts

* Revert "feature: Introduce callback props for pane open/close events" ([426eee5](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/426eee551813a390d60717193a29453d580f21b6))

## [4.1.2](https://github.com/AmanKrr/A-MultiLayout-Splitter/compare/v4.1.1...v4.1.2) (2024-05-12)


### Bug Fixes

* Resolve collapse bug when only one pane is closed ([945f3f7](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/945f3f75f0e548cc27c0b3b9c616c62b8fbfdc33))


### Performance Improvements

* Improve performance by caching DOM elements ([6562f7d](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/6562f7decf3bf86b8a1928f635a3166fda069a57))

## [4.1.1](https://github.com/AmanKrr/A-MultiLayout-Splitter/compare/v4.1.0...v4.1.1) (2024-03-14)


### Bug Fixes

* **utils:** Bind SplitUtils methods in export ([0d94cb7](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/0d94cb7cae841ffd5e81396f4265423a976f5715))

# [4.1.0](https://github.com/AmanKrr/A-MultiLayout-Splitter/compare/v4.0.6...v4.1.0) (2024-03-13)


### Bug Fixes

* Prevent creation of new local storage keys on changing search parameters ([076bff0](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/076bff09356136e283229319820d94c49caaff1e))


### Features

* Export specific functions from SplitUtils and add SplitSessionStorage ([a4cd17a](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/a4cd17a208465d5f1a3be050b5ae5def4d4e081e))

## [4.0.6](https://github.com/AmanKrr/A-MultiLayout-Splitter/compare/v4.0.5...v4.0.6) (2024-03-03)


### Bug Fixes

* Size distribution calculation when no initialSizes porps is given ([44c59e0](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/44c59e096dcd1afdc753910b61b033642f092a55))

## [4.0.5](https://github.com/AmanKrr/A-MultiLayout-Splitter/compare/v4.0.4...v4.0.5) (2024-03-02)


### Bug Fixes

* Circumvent npm's 24-hour version name reuse policy with dummy version increment commits ([69f05ab](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/69f05abf6e00ea90fea285d51ed8a2696874826b))

## [4.0.4](https://github.com/AmanKrr/A-MultiLayout-Splitter/compare/v4.0.3...v4.0.4) (2024-03-02)


### Bug Fixes

* CSS import issue. ([12206f6](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/12206f6ddb1e2378aef490cc863f256568729b8c))

## [4.0.3](https://github.com/AmanKrr/A-MultiLayout-Splitter/compare/v4.0.2...v4.0.3) (2024-03-02)


### Bug Fixes

* Resolve import issues encountered in build due to file rename during minification ([04e6605](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/04e6605b441e801c8a5817a4f0e32a86b0dd44d7))

## [4.0.2](https://github.com/AmanKrr/A-MultiLayout-Splitter/compare/v4.0.1...v4.0.2) (2024-03-02)


### Bug Fixes

* Import errors while working in containers like codesanbox or stackblitz ([e5c892e](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/e5c892e07aec102c60e8f72ae7efb29fdca75b21))

## [4.0.1](https://github.com/AmanKrr/A-MultiLayout-Splitter/compare/v4.0.0...v4.0.1) (2024-03-02)


### Bug Fixes

* pkg error ([d0b0fbc](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/d0b0fbc77f48e360aed64cbaa1ba7a91af31e6cf))
* SplitUtils import fix ([4981c11](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/4981c116fc46b8e71f4d95af88dbdd84b61cd8a1))

# [4.0.0](https://github.com/AmanKrr/A-MultiLayout-Splitter/compare/v3.0.2...v4.0.0) (2024-03-02)


### Bug Fixes

* Add cross browser css properties ([496f68c](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/496f68c6bfc99ea18ca0a67046e31704774be2ba))
* Fix issue where nested layout handlebar arrow icons trigger different split pane behavior ([aec74fb](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/aec74fb8ffeee68b3f946038e07ac840ad7e882e))
* Layout issues. ([e1d2a87](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/e1d2a877164e099ce0bec36a32d674c4e718f005))
* Move lodash to dependencies from peerDependencies and add lodash type as devDependencies ([8db4558](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/8db4558025ccca279df7761de7aefbf3090438de))
* overflow container issue. ([a195595](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/a1955950b1262b736d106e223d1dbec2d359cdd9))


### Performance Improvements

* Code refactor ([0577ad1](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/0577ad1652bdbf4e0f4359f8f68c7b7f70c50495))


### BREAKING CHANGES

* Splitter component now requires providing an ID, and the openSplitter and closeSplitter methods now require an instance of the split pane.

## [3.0.2](https://github.com/AmanKrr/A-MultiLayout-Splitter/compare/v3.0.1...v3.0.2) (2024-02-26)


### Bug Fixes

* Nested layout render only one mode ([7416fdb](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/7416fdb50b4130e769feeb0d81b5ad4ca9d3b9e8))


### Performance Improvements

* Resize performance improvement ([b17151c](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/b17151c1c110dc986c8c0927b808c322415d0f45))

## [3.0.1](https://github.com/AmanKrr/A-MultiLayout-Splitter/compare/v3.0.0...v3.0.1) (2024-02-25)


### Bug Fixes

* auto distribution of size if no initialSizes is given ([3559bce](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/3559bce60e58fb9573727745d724d29dedf60f26))

# [3.0.0](https://github.com/AmanKrr/A-MultiLayout-Splitter/compare/v2.0.0...v3.0.0) (2024-02-24)


### Build System

* chore(release): Add compiled/built code ([96fc106](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/96fc106a672d29831e70e7b1133204a391f4d713))


### BREAKING CHANGES

* CSS improvements include class changes, affecting existing stylesheets. Developers integrating this code should update their stylesheets accordingly.

# [2.0.0](https://github.com/AmanKrr/A-MultiLayout-Splitter/compare/v1.0.0...v2.0.0) (2024-02-24)


### Bug Fixes

* Ensure proper className forwarding for React components used with splitter ([e76bd23](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/e76bd237c7d632611541722eac41206ba988b66a))
* Layout flex shrink unexpected behaviour fix. ([0df5d48](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/0df5d484fceeff21fddb4bec1d9ab46e8088a020))
* Layout shrinkage issue ([1ccabb6](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/1ccabb660bdabe5d919fc5d2112e5b94f30f533e))
* Size distribution improvement if splitter section increase more than two. ([859c079](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/859c079fd99a3cf5d5d3f32b826ae26239eae750))
* **types:** types correction on calling localstorage ([2d696c6](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/2d696c6e842396bfdf6d0fe25735f7a70a5d2466))


### Features

* Implement linebar resizing, disable feature, and vertical orientation session storage ([e4c45d4](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/e4c45d4c200628f4d91be78f69027ae5ea0ced04))
* support for pixel and percentage based layout. ([b5c91c2](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/b5c91c2a67cb0b10f33bea20875f21403df5bd2f))


### BREAKING CHANGES

* CSS improvements involve changes to existing classes.

## [1.0.1](https://github.com/AmanKrr/A-MultiLayout-Splitter/compare/v1.0.0...v1.0.1) (2024-02-04)


### Bug Fixes

* **types:** types correction on calling localstorage ([2d696c6](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/2d696c6e842396bfdf6d0fe25735f7a70a5d2466))

## [1.0.1](https://github.com/AmanKrr/A-MultiLayout-Splitter/compare/v1.0.0...v1.0.1) (2024-02-04)


### Bug Fixes

* **types:** types correction on calling localstorage ([2d696c6](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/2d696c6e842396bfdf6d0fe25735f7a70a5d2466))

## [1.0.1](https://github.com/AmanKrr/A-MultiLayout-Splitter/compare/v1.0.0...v1.0.1) (2024-02-04)


### Bug Fixes

* **types:** types correction on calling localstorage ([2d696c6](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/2d696c6e842396bfdf6d0fe25735f7a70a5d2466))

## [1.0.1](https://github.com/AmanKrr/A-MultiLayout-Splitter/compare/v1.0.0...v1.0.1) (2024-02-04)


### Bug Fixes

* **types:** types correction on calling localstorage ([2d696c6](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/2d696c6e842396bfdf6d0fe25735f7a70a5d2466))

# 1.0.0 (2024-02-04)


### Features

* maxSize introduces, session storage introduces\ ([0d87480](https://github.com/AmanKrr/A-MultiLayout-Splitter/commit/0d87480e43a6f2d8e0b70786e551de7ee20dad6b))
