# Plugin System

The plugin system allows you to extend the core functionality of **A-MultiLayout-Splitter** without modifying the source code. Plugins can hook into lifecycle events, customize rendering, and add new behaviors.

::: tip Interactive Demos
See the [Plugin Demos](/examples/plugins) page for live interactive examples.
:::

---

## Built-in Plugins

### `persistencePlugin`

Automatically saves and restores the layout to localStorage or sessionStorage.

```tsx
import { Split, persistencePlugin } from '@a-multilayout-splitter/core';

<Split
  id="my-layout"
  plugins={[
    persistencePlugin({
      storage: 'localStorage',  // or 'sessionStorage'
      key: 'my-custom-key',     // optional custom storage key
      debounceDelay: 300,       // ms to debounce saves
    })
  ]}
>
  ...
</Split>
```

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `storage` | `'localStorage' \| 'sessionStorage'` | `'localStorage'` | Storage backend |
| `key` | `string` | Auto-generated | Custom storage key |
| `debounceDelay` | `number` | `300` | Milliseconds to debounce save operations |

#### Utility Function

```tsx
import { clearPersistedState } from '@a-multilayout-splitter/core';

// Clear saved state for a specific split
clearPersistedState('my-layout', 'localStorage');
```

---

### `keyboardPlugin`

Enables full keyboard navigation for accessibility.

```tsx
import { Split, keyboardPlugin } from '@a-multilayout-splitter/core';

<Split
  plugins={[
    keyboardPlugin({
      enableArrowKeys: true,      // Arrow keys resize panes
      enableNumberKeys: true,     // 1-9 keys focus specific panes
      enableTabNavigation: true,  // Tab cycles through panes
      stepSize: 5,                // Resize step per arrow press
    })
  ]}
>
  ...
</Split>
```

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enableArrowKeys` | `boolean` | `true` | Enable arrow key resizing |
| `enableNumberKeys` | `boolean` | `true` | Enable 1-9 keys to focus panes |
| `enableTabNavigation` | `boolean` | `true` | Enable Tab to cycle panes |
| `stepSize` | `number` | `10` | Percentage step for each arrow press |

---

### `customHandlePlugin`

Replace the default resize handles with custom React components.

#### Using a Component

```tsx
import { Split, customHandlePlugin, type HandleRenderProps } from '@a-multilayout-splitter/core';

const MyHandle: React.FC<HandleRenderProps> = ({ index, mode, disabled, onMouseDown }) => (
  <div
    style={{
      width: mode === 'horizontal' ? '10px' : '100%',
      height: mode === 'horizontal' ? '100%' : '10px',
      background: disabled ? '#ccc' : '#007bff',
      cursor: disabled ? 'default' : mode === 'horizontal' ? 'col-resize' : 'row-resize',
    }}
    onMouseDown={disabled ? undefined : onMouseDown}
    onTouchStart={disabled ? undefined : onMouseDown}
  />
);

<Split plugins={[customHandlePlugin(MyHandle)]}>
  ...
</Split>
```

#### Using a Render Function

```tsx
import { Split, customHandleRenderPlugin } from '@a-multilayout-splitter/core';

<Split
  plugins={[
    customHandleRenderPlugin((props) => (
      <div
        style={{
          width: props.mode === 'horizontal' ? '4px' : '100%',
          height: props.mode === 'horizontal' ? '100%' : '4px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
        onMouseDown={props.onMouseDown}
      />
    ))
  ]}
>
  ...
</Split>
```

#### HandleRenderProps

| Prop | Type | Description |
|------|------|-------------|
| `index` | `number` | Handle index (1-based) |
| `mode` | `'horizontal' \| 'vertical'` | Split direction |
| `disabled` | `boolean` | Whether the handle is disabled |
| `lineBar` | `boolean` | Whether lineBar style is enabled |
| `onMouseDown` | `(e: React.MouseEvent \| React.TouchEvent) => void` | Drag handler |

---

## Creating Custom Plugins

Use the `createPlugin` helper for full TypeScript support.

```tsx
import { createPlugin } from '@a-multilayout-splitter/core';

const myPlugin = createPlugin({
  name: 'my-custom-plugin',
  version: '1.0.0',

  onInit(context) {
    console.log('Split initialized:', context.splitId);
  },

  onDragStart(event, context) {
    console.log('Drag started on pane:', event.paneIndex);
  },

  onDragMove(event, context) {
    // Return false to cancel the drag
    if (event.prevSize < 10) {
      return false;
    }
    return true;
  },

  onDragEnd(event, context) {
    console.log('Drag ended:', event.prevSize, event.nextSize);
  },

  onDestroy(context) {
    console.log('Split destroyed');
  },
});

<Split plugins={[myPlugin]}>
  ...
</Split>
```

---

## Plugin Lifecycle Hooks

| Hook | Parameters | Description |
|------|------------|-------------|
| `onInit` | `(context)` | Called when Split mounts |
| `onPaneAdd` | `(pane, context)` | Called when a pane is added |
| `onPaneRemove` | `(pane, context)` | Called when a pane is removed |
| `onDragStart` | `(event, context)` | Called when drag begins |
| `onDragMove` | `(event, context)` | Called during drag. Return `false` to cancel |
| `onDragEnd` | `(event, context)` | Called when drag ends |
| `onResize` | `(context)` | Called when container resizes |
| `renderHandle` | `(props, context)` | Custom handle renderer |
| `renderPane` | `(pane, content, context)` | Wrap pane content |
| `onDestroy` | `(context)` | Called when Split unmounts |

---

## Plugin Context

Every hook receives a `PluginContext` object:

```typescript
interface PluginContext {
  splitId: string;                    // Unique ID of the Split
  getState: () => SplitState;         // Get current state
  dispatch: (action) => void;         // Dispatch state actions
  getElement: () => HTMLElement;      // Get container element
  getPanes: () => Pane[];             // Get current panes
}
```

### Dispatching Actions

```tsx
createPlugin({
  name: 'my-plugin',

  onInit(context) {
    // Toggle a pane programmatically
    context.dispatch({ type: 'TOGGLE_PANE', payload: 0 });

    // Set pane size
    context.dispatch({
      type: 'SET_PANE_SIZE',
      payload: { index: 0, size: '40%' }
    });
  }
});
```

### Available Actions

| Action Type | Payload | Description |
|-------------|---------|-------------|
| `ADD_PANE` | `AddPaneConfig` | Add a new pane |
| `REMOVE_PANE` | `number` | Remove pane by index |
| `TOGGLE_PANE` | `number` | Toggle pane collapse |
| `SET_PANE_SIZE` | `{ index, size }` | Set pane size |
| `RESTORE_STATE` | `SplitState` | Restore entire state |
| `ADJUST_PANE_SIZE` | `{ direction, amount }` | Adjust size relatively |

---

## Combining Multiple Plugins

```tsx
import {
  Split,
  persistencePlugin,
  keyboardPlugin,
  customHandlePlugin
} from '@a-multilayout-splitter/core';

<Split
  plugins={[
    persistencePlugin({ storage: 'localStorage' }),
    keyboardPlugin({ stepSize: 5 }),
    customHandlePlugin(MyCustomHandle),
  ]}
>
  ...
</Split>
```

::: tip Plugin Order
- Lifecycle hooks (`onInit`, `onDragEnd`, etc.) are called in registration order
- For `renderHandle` and `renderPane`, the **first** plugin that returns a value wins
:::
