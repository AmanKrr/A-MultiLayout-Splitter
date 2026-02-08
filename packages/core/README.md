# A-MultiLayout-Splitter v6

**High-performance resizable split layouts for React.** Built for the modern web with a focus on speed, accessibility, and developer experience.

[![CI](https://github.com/AmanKrr/A-MultiLayout-Splitter/actions/workflows/test.yml/badge.svg?branch=v6)](https://github.com/AmanKrr/A-MultiLayout-Splitter/actions/workflows/test.yml)
[![npm version](https://img.shields.io/npm/v/@a-multilayout-splitter/core/alpha.svg?style=flat-square)](https://www.npmjs.com/package/@a-multilayout-splitter/core?activeTab=versions)
![React](https://img.shields.io/badge/React-18%20%7C%2019-61dafb?style=flat-square)
[![license](https://img.shields.io/github/license/AmanKrr/A-MultiLayout-Splitter?style=flat-square)](https://github.com/AmanKrr/A-MultiLayout-Splitter/blob/v6/LICENSE)
[![docs](https://img.shields.io/badge/docs-v6-blueviolet?style=flat-square)](https://amankrr.github.io/A-MultiLayout-Splitter/)

## 🚀 Why A-MultiLayout-Splitter?

Most React splitters suffer from "jitter" because they trigger a full React render loop 60 times per second during a drag operation. A-MultiLayout-Splitter uses a **hybrid architecture** that bypasses React for resizing interaction while maintaining a perfect React-first state model.

### Key Features

- ⚡️ **60fps Performance**: Direct DOM manipulation during interaction ensures zero-lag dragging.
- 🌲 **Deep Nesting**: Effortlessly create complex IDE-grade layouts (Sidebars within Topbars within Views).
- 🧩 **Plugin System**: Modular architecture for features like Keyboard Navigation, Persistence, and Custom UI.
- 🪝 **First-Class Hooks**: Manage state externally with `useSplitController` for advanced programmatic Control.
- 💾 **State Persistence**: Built-in support for remembering user layouts across page reloads.
- 📦 **Zero Dependencies**: Lightweight, tree-shakable, and built with pure modern TypeScript.

---

## 📖 Documentation & Demos

**[View Full Documentation Site](https://amankrr.github.io/A-MultiLayout-Splitter/)**

Our documentation site contains:

- **Interactive Demos**: Live examples of every feature.
- **Guide**: Detailed explanation of the React-First architecture.
- **Deep-Dives**: Learn how to build custom plugins and handle nested layouts.
- **API Reference**: Comprehensive list of props, hooks, and types.

---

## 📦 Installation

```bash
# npm
npm install @a-multilayout-splitter/core

# pnpm
pnpm add @a-multilayout-splitter/core

# yarn
yarn add @a-multilayout-splitter/core
```

## 🛠️ Basic Quick Start

```tsx
import { Split } from '@a-multilayout-splitter/core';
import '@a-multilayout-splitter/core/style.css';

function App() {
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <Split mode="horizontal" initialSizes={['30%', '70%']}>
        <div className="sidebar">Sidebar</div>
        <div className="main">Main Content Area</div>
      </Split>
    </div>
  );
}
```

---

## 🧩 Plugins

Extend the splitter with powerful built-in plugins:

```tsx
import { Split, keyboardPlugin, persistencePlugin } from '@a-multilayout-splitter/core';
import '@a-multilayout-splitter/core/style.css';

<Split
  plugins={[
    keyboardPlugin(), // Arrows and numbers to resize/focus
    persistencePlugin({ key: 'user-layout' }), // Auto-save state
  ]}
>
  {/* Panes */}
</Split>;
```

---

## 💖 Support

If you find this project useful, consider supporting its development:

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-ffdd00?style=flat-square&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/amankr)

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](https://github.com/AmanKrr/A-MultiLayout-Splitter/blob/v6/CONTRIBUTING.md) to get started.

## 📄 License

MIT © [Aman Kumar](https://github.com/AmanKrr)
