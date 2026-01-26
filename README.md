# A-MultiLayout-Splitter v6

Powerful, performant, and flexible resizable split layouts for React. Built with a modern architecture that prioritizes 60fps performance even with complex, deeply nested layouts.

[![npm version](https://img.shields.io/npm/v/@a-multilayout-splitter/core.svg?style=flat-square)](https://www.npmjs.com/package/@a-multilayout-splitter/core)
[![license](https://img.shields.io/npm/l/@a-multilayout-splitter/core.svg?style=flat-square)](https://github.com/AmanKrr/A-MultiLayout-Splitter/blob/main/LICENSE)

## Why v6?

Version 6 is a complete ground-up rewrite moving from legacy DOM-heavy logic to a modern "React-First" architecture.

- **🚀 60fps Dragging**: Uses direct DOM manipulation during active resizing to bypass React's render loop.
- **🏗️ Deep Nesting Support**: Built-in context to handle nested layouts with zero configuration.
- **🔌 Plugin System**: Extend functionality with a robust lifecycle-based plugin API.
- **🪝 Modern Hooks**: Full control over layout state with the `useSplitController` hook.
- **📱 Touch Support**: Seamless resizing on mobile and tablet devices.

## Installation

```bash
npm install @a-multilayout-splitter/core
```

## Basic Usage

The simplest way to create a split layout is to wrap your components in the `<Split>` component.

```tsx
import { Split } from '@a-multilayout-splitter/core';
import '@a-multilayout-splitter/core/dist/style.css';

function App() {
  return (
    <div style={{ height: '500px' }}>
      <Split mode="horizontal">
        <div style={{ background: '#f0f0f0' }}>Left Pane</div>
        <div style={{ background: '#e0e0e0' }}>Right Pane</div>
      </Split>
    </div>
  );
}
```

## Advanced Features

### Orientation & Initial Sizes

Control layout direction and define starting widths using percentages or pixels.

```tsx
<Split 
  mode="vertical" 
  initialSizes={['30%', '70%']}
  minSizes={[100, 100]} // in pixels or percentage
>
  <div>Top</div>
  <div>Bottom</div>
</Split>
```

### Programmatic Control (Hooks)

For full control over pane state, use the `useSplitController` hook.

```tsx
import { Split, useSplitController } from '@a-multilayout-splitter/core';

function Editor() {
  const { panes, addPane, togglePane } = useSplitController({
    initialSizes: ['250px', '1fr']
  });

  return (
    <div>
      <button onClick={() => togglePane(0)}>Toggle Sidebar</button>
      <Split panes={panes} />
    </div>
  );
}
```

### Persistence

Enable layout saving across sessions with a single prop.

```tsx
<Split id="main-layout" enableSessionStorage>
  <Pane 1>
  <Pane 2>
</Split>
```

## Component API

### `<Split />` Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `mode` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout orientation |
| `initialSizes` | `string[]` | `[]` | Initial sizes (e.g. `['30%', '70%']`) |
| `minSizes` | `number[]` | `[]` | Minimum percentage for each pane |
| `maxSizes` | `number[]` | `[]` | Maximum percentage for each pane |
| `collapsed` | `boolean[]` | `[]` | Initial collapsed states |
| `disable` | `boolean \| number[]` | `false` | Disable specific handlebars |
| `enableSessionStorage` | `boolean` | `false` | Enable automatic state persistence |
| `renderBar` | `Function` | `undefined` | Custom handlebar renderer |

## License

MIT © [Aman Kumar](https://github.com/AmanKrr)
