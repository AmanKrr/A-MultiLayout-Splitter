# SplitRef API

The `Split` component exposes an imperative API via a React `ref`. This allows you to control the layout programmatically from your parent components.

## Usage

```tsx
import { useRef } from 'react';
import { Split, type SplitRef } from '@a-multilayout-splitter/core';

function MyComponent() {
  const splitRef = useRef<SplitRef>(null);

  const resetPanes = () => {
    splitRef.current?.setPaneSize(0, '50%');
    splitRef.current?.setPaneSize(1, '50%');
  };

  return (
    <>
      <button onClick={resetPanes}>Reset Layout</button>
      <Split ref={splitRef}>...</Split>
    </>
  );
}
```

## Methods

### `addPane(config: AddPaneConfig)`
Adds a new pane dynamically to the split layout.

| Property | Type | Description |
|----------|------|-------------|
| `size` | `string` | Starting size (e.g., `'30%'`, `'200px'`). For horizontal layouts, this represents width; for vertical layouts, this represents height. |
| `position` | `number` | Optional index to insert at (defaults to end) |
| `content` | `ReactNode` | Static content - captured at call time |
| `render` | `() => ReactNode` | Render function - called on every render for reactive content |
| `collapsed` | `boolean` | Initial collapsed state |
| `minSize` | `number` | Minimum size constraint (percentage) |
| `maxSize` | `number` | Maximum size constraint (percentage) |

::: warning Size Conversion
When using `addPane` with pixel-based sizes (e.g., `'200px'`), the size will be **converted to a percentage** to ensure proper space redistribution among existing panes. This conversion uses the container's width for horizontal layouts and height for vertical layouts.

If you need precise pixel-based layouts, consider:
- Using `initialSizes` with the declarative API
- Calculating the appropriate percentage based on your container size
:::

#### Static vs Reactive Content

You can provide content in two ways:

**Static Content** - Use `content` when the pane content doesn't need to react to external state changes:

```tsx
splitRef.current?.addPane({
  size: '30%',
  content: <StaticPanel title="Fixed Title" />,
});
```

**Reactive Content** - Use `render` when you need the pane content to update when external state changes:

```tsx
const [count, setCount] = useState(0);

// The render function is called on every render,
// so the pane always shows the current count value
splitRef.current?.addPane({
  size: '30%',
  render: () => <Counter value={count} />,
});
```

::: tip
If both `content` and `render` are provided, `render` takes precedence.
:::

::: warning When to use which?
- Use `content` for static UI that doesn't depend on external state
- Use `render` when the pane needs to react to state changes from parent components, Redux, Context, etc.
- For most cases, prefer **declarative children** over `addPane` - they automatically stay reactive
:::

### `removePane(index: number)`
Removes a specific pane and redistributes its space to the remaining panes.

### `togglePane(index: number)`
Toggles the collapse state of a specific pane.

### `collapsePane(index: number)`
Programmatically collapses a pane.

### `expandPane(index: number)`
Programmatically expands a collapsed pane.

### `setPaneSize(index: number, size: string, options?: AnimationOptions)`
Updates the size of a specific pane.
- `options.animate`: If true, triggers a smooth CSS transition.

### `swapPanes(indexA: number, indexB: number)`
Swaps the position of two panes in the layout.

### `getSnapshot()`
Returns a serializable object representing the current layout state (sizes, collapsed states, mode).

### `restore(snapshot: SplitSnapshot)`
Restores the layout from a previously captured snapshot.

### `getPaneState()`
Returns the raw internal `Pane[]` array for advanced inspection.

### `resizePane(index: number, delta: number)`
Resizes a pane by a relative pixel amount.
