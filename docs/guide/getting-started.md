# Getting Started

Learn how to get up and running with **A-MultiLayout-Splitter v6**.

## Installation

Install the package via your preferred package manager:

```bash
# npm
npm install @a-multilayout-splitter/core

# pnpm
pnpm add @a-multilayout-splitter/core

# yarn
yarn add @a-multilayout-splitter/core
```

## Basic Usage

The simplest way to use the splitter is to wrap your content in the `Split` component.

```tsx
import { Split } from '@a-multilayout-splitter/core';
import '@a-multilayout-splitter/core/style.css';

function App() {
  return (
    <div style={{ height: '500px' }}>
      <Split mode="horizontal" initialSizes={['30%', '70%']}>
        <div style={{ background: '#f0f0f0' }}>Left Pane</div>
        <div style={{ background: '#ffffff' }}>Right Pane</div>
      </Split>
    </div>
  );
}
```

::: tip IMPORTANT
Always ensure the parent container of the `Split` component has a defined height and width. The splitter uses `flex` and fills 100% of its available space by default.
:::

## Key Prop Highlights

- **`mode`**: Choose between `'horizontal'` or `'vertical'`.
- **`initialSizes`**: Define starting dimensions as an array of strings (e.g., `['300px', '1fr']` or `['40%', '60%']`).
- **`minSizes` / `maxSizes`**: Constraint percentages for individual panes.
- **`enablePersistence`**: Enable simple auto-saving of the layout to localStorage.

## Next Steps

Explore the [Architecture Guide](./architecture) to understand how v6 achieves high-performance Resizing, or jump straight to the [API Reference](../api/props) for a full prop list.
