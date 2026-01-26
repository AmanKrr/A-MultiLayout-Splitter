# Migration from v5

Moving from **v5 (Legacy)** to **v6 (Modern)** involves several breaking changes designed to make the library faster, smaller, and easier to use with modern React patterns.

## Overview of Changes

| Feature | v5 (Legacy) | v6 (Modern) |
| :--- | :--- | :--- |
| **Component Type** | Class-based | Functional (Hooks) |
| **State Management** | Required `SplitStateProvider` wrapper | Native and Optional |
| **Imperative API** | Static methods or mixed refs | Standard `SplitRef` via `forwardRef` |
| **Dependencies** | Requires `lodash` | **Zero Dependencies** |
| **Styling** | Built-in CSS-in-JS (sometimes) | Standard CSS file + CSS Variables |

## 1. Component Imports

In v5, you might have used multiple components for a single split. In v6, everything is centered around the named `Split` export.

```tsx
// v5
import { SplitLayout, Pane } from 'react-multilayout-split';

// v6
import { Split } from '@a-multilayout-splitter/core';
import '@a-multilayout-splitter/core/style.css';
```

## 2. Removing the Provider

One of the biggest improvements in v6 is that you no longer need a top-level provider for basic usage.

```tsx
// v5 (No longer needed)
<SplitStateProvider>
  <SplitLayout>...</SplitLayout>
</SplitStateProvider>

// v6 (Simple and clean)
<Split>...</Split>
```

## 3. Props Remapping

Most props have remained similar, but some have changed for clarity:

- `gutterSize` ⮕ Handlebars are now styled via CSS variables (`--split-bg-color`, etc.) or custom renderers.
- `onResize` ⮕ Renamed to `onDragging` for continuous updates, and `onDragEnd` for the final drop.
- `initialPanes` ⮕ You should now just pass standard React elements as `children`.

## 4. Imperative API

If you were using static methods to toggle panes, you must now use a `ref`.

```tsx
// v5
SplitLayout.togglePane(id);

// v6
const splitRef = useRef<SplitRef>(null);
// ...
splitRef.current?.togglePane(0);
```

## Summary Recommendation

We recommend all users migrate to v6 as soon as possible. It is significantly faster and aligns better with the direction of the React ecosystem (Server Components, Concurrent Mode, etc.).

::: warning
The `legacy-v5` code has been archived. No new features will be added to the old architecture.
:::
