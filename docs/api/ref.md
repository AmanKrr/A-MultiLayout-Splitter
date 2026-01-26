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
- `config.size`: Starting size.
- `config.position`: Optional index (defaults to end).
- `config.content`: React element to render.

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
