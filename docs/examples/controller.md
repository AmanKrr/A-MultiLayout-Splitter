<script setup>
import ControllerDemo from '../.vitepress/theme/demos/ControllerDemo'
import UseSplitControllerDemo from '../.vitepress/theme/demos/UseSplitControllerDemo'
</script>

# Interactive Controller Demo

The `Split` component allows for imperative control via a React `ref`. This is the recommended way to trigger layout changes from outside the component, such as header buttons or sidebar toggles.

<ReactContainer :component="ControllerDemo" />

## Using the Ref API

To control the splitter programmatically, capture the `SplitRef` and call its built-in methods.

```tsx
import { useRef } from 'react';
import { Split, type SplitRef } from '@a-multilayout-splitter/core';

function MyView() {
  const splitRef = useRef<SplitRef>(null);

  return (
    <>
      <button onClick={() => splitRef.current?.togglePane(0)}>
        Toggle Sidebar
      </button>

      <Split ref={splitRef}>
        <div>Sidebar</div>
        <div>Main Content</div>
      </Split>
    </>
  );
}
```

### Why use the Ref API?
- **Stability**: Methods on the ref have stable identities and don't trigger parent re-renders.
- **Performance**: Operations like `collapsePane` or `addPane` happen instantly within the component.
- **Simplicity**: No need to manage complex pane state arrays in your parent component.

---

## Using the `useSplitController` Hook

For scenarios where you need to manage pane state externally (e.g., sync with Redux/Zustand, build custom toolbars), use the `useSplitController` hook. The controller state can drive the `collapsed` prop on `Split` for reactive updates with full drag functionality.

<ReactContainer :component="UseSplitControllerDemo" />

```tsx
import { useSplitController, Split } from '@a-multilayout-splitter/core';

function ControlledSplitLayout() {
  const controller = useSplitController({
    mode: 'horizontal',
    initialPanes: [
      { id: 'sidebar', size: '25%', collapsed: false, minSize: 10, maxSize: 50, content: null },
      { id: 'main', size: '50%', collapsed: false, minSize: 20, maxSize: 80, content: null },
      { id: 'panel', size: '25%', collapsed: false, minSize: 10, maxSize: 50, content: null },
    ],
    onPaneChange: (panes) => {
      // Sync with your state management (Redux, Zustand, etc.)
      console.log('Panes updated:', panes);
    },
  });

  // Derive collapsed array from controller to sync with Split
  const collapsedState = controller.panes.map(p => p.collapsed);

  return (
    <div>
      {/* External Control Panel */}
      <header>
        <button onClick={() => controller.togglePane(0)}>
          {controller.panes[0]?.collapsed ? 'Show' : 'Hide'} Sidebar
        </button>
        <button onClick={() => controller.togglePane(2)}>
          {controller.panes[2]?.collapsed ? 'Show' : 'Hide'} Panel
        </button>
        <span>Collapsed: {controller.panes.filter(p => p.collapsed).length}</span>
      </header>

      {/* Split with draggable handles, controlled by hook state */}
      <Split
        initialSizes={['25%', '50%', '25%']}
        collapsed={collapsedState}
        minSizes={[10, 20, 10]}
        maxSizes={[50, 80, 50]}
      >
        <div>Sidebar</div>
        <div>Main Content</div>
        <div>Right Panel</div>
      </Split>
    </div>
  );
}
```

### Why use the Hook API?
- **Sync with UI**: Update buttons or nav items based on whether a pane is open.
- **State Management**: Integrate with Redux, Zustand, or any external store via `onPaneChange`.
- **State Serialization**: Save the entire `panes` array for persistence or undo/redo functionality.
- **Reactive UI**: Build dynamic toolbars that reflect current pane state in real-time.

### Available Controller Methods

| Method | Description |
|--------|-------------|
| `addPane(config)` | Add a new pane at a specific position |
| `removePane(index)` | Remove a pane and redistribute its size |
| `removePanes(indices)` | Remove multiple panes at once |
| `togglePane(index)` | Toggle a pane's collapsed state |
| `collapsePane(index)` | Force collapse a pane |
| `expandPane(index)` | Force expand a pane |
| `setPaneSize(index, size)` | Set a specific pane's size |
| `swapPanes(indexA, indexB)` | Swap two panes' positions |
| `getSnapshot()` | Get a serializable snapshot of the current state |
| `restore(snapshot)` | Restore state from a snapshot |

### Controller State

The hook also returns reactive state:

```tsx
const { panes, mode, isDragging } = useSplitController({ ... });

// panes: Pane[] - current pane configurations
// mode: 'horizontal' | 'vertical' - the layout direction
// isDragging: boolean - whether user is currently resizing
```

## Ref API vs Hook API

| Feature | Ref API (`SplitRef`) | Hook API (`useSplitController`) |
|---------|---------------------|--------------------------------|
| State ownership | Internal to Split | External, in your component |
| Reading pane state | Via callbacks | Directly from `controller.panes` |
| Triggering actions | `ref.current?.method()` | `controller.method()` |
| Best for | Simple toggling, quick actions | Complex state sync, custom UIs |
| Re-renders | Minimal (ref is stable) | When panes change |

---

## Nested Layouts

For controlling nested splits (IDE-like layouts), see the dedicated [Nested Control](/examples/nested-control) guide.
