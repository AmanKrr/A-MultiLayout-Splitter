# A-MultiLayout-Splitter v6

**High-performance resizable split layouts for React.** Built for the modern web with a focus on speed, accessibility, and developer experience.

[![npm version](https://img.shields.io/npm/v/@a-multilayout-splitter/core.svg?style=flat-square)](https://www.npmjs.com/package/@a-multilayout-splitter/core)
[![license](https://img.shields.io/npm/l/@a-multilayout-splitter/core.svg?style=flat-square)](https://github.com/AmanKrr/A-MultiLayout-Splitter/blob/main/LICENSE)
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
npm install @a-multilayout-splitter/core
```

## 🛠️ Basic Quick Start

```tsx
import { Split } from '@a-multilayout-splitter/core';

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

<Split 
  plugins={[
    keyboardPlugin(), // Arrows and numbers to resize/focus
    persistencePlugin({ key: 'user-layout' }) // Auto-save state
  ]}
>
  {/* Panes */}
</Split>
```

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](https://github.com/AmanKrr/A-MultiLayout-Splitter/blob/v6/CONTRIBUTING.md) to get started.

## 📄 License

MIT © [Aman Kumar](https://github.com/AmanKrr)
