# Hooks API

**A-MultiLayout-Splitter** provides several React hooks for advanced control and building custom extensions.

## `useSplitController`

The most powerful hook in the library. It allows you to manage the split state "ahead of time" and pass it into the `Split` component. This is useful for complex UIs where sidebar content might depend on the splitter's internal state.

```tsx
import { useSplitController, Split } from '@a-multilayout-splitter/core';

function MasterDetailLayout() {
  const { panes, togglePane } = useSplitController({
    initialSizes: ['300px', '1fr'],
  });

  return (
    <div>
      <button onClick={() => togglePane(0)}>Toggle Sidebar</button>
      <Split initialPanes={panes}>
        <div>Sidebar Content</div>
        <div>Main Content</div>
      </Split>
    </div>
  );
}
```

## Context Hooks

If your Split component is wrapped in a `SplitProvider`, you can access these hooks from any deeply nested child component.

### `useSplitState()`
Returns the reactive state (panes, dragging status).
```ts
const { panes, isDragging } = useSplitState();
```

### `useSplitActions()`
Provides methods (like `togglePane`, `addPane`) with stable references.
```ts
const { togglePane } = useSplitActions();
```

### `usePane(index: number)`
Subscribes to updates for a specific pane only. This is highly efficient for large layouts.
```ts
const pane = usePane(0);
```

### `useIsDragging()`
A simple boolean hook to know if the user is currently resizing. Useful for showing "ghost" overlays or masking iframes.

---

## Low-level Hooks

### `useDragHandler`
Used internally by the `Split` component. You can use this to build a completely custom splitter that doesn't use the `Split` component but reuses the high-performance core logic.

### `usePersistence`
Manages the logic for saving layout state to `localStorage`.
