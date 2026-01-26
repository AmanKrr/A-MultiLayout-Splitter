# Plugin System

The plugin system allows you to extend the core functionality of **A-MultiLayout-Splitter** without modifying the source code.

## Built-in Plugins

### `keyboardPlugin`
Enables full keyboard navigation using Arrows and Number keys.
```ts
import { keyboardPlugin } from '@a-multilayout-splitter/core';

<Split plugins={[keyboardPlugin()]} />
```

### `persistencePlugin`
Automatically saves and restores the layout. This is the plugin version of the simpler `enableSessionStorage` prop.
```ts
import { persistencePlugin } from '@a-multilayout-splitter/core';

<Split plugins={[persistencePlugin({ key: 'my-layout' })]} />
```

### `customHandlePlugin`
Allows you to replace the default resize bar with your own React component.

---

## Creating a Plugin

Plugins are simple objects with lifecycle hooks. Use the `createPlugin` helper for full TypeScript support.

```tsx
import { createPlugin } from '@a-multilayout-splitter/core';

const myPlugin = createPlugin({
  name: 'my-custom-plugin',
  
  onInit(context) {
    console.log('Split initialized:', context.splitId);
  },

  onDragEnd(event, context) {
    console.log('User settled at:', event.prevSize);
  },

  renderHandle(props, context) {
    // Custom JSX for the resize handle
    return <div class="my-handle" onMouseDown={props.onMouseDown} />;
  }
});

// Usage
<Split plugins={[myPlugin]} />
```

## Plugin Lifecycle Hooks

- `onInit`: Called when the Split component mounts.
- `onPaneAdd` / `onPaneRemove`: Called when the layout structure changes.
- `onDragStart` / `onDragMove` / `onDragEnd`: Captured resize events.
- `onResize`: Triggered when the parent container changes size.
- `renderHandle`: Custom handle renderer.
- `renderPane`: Wrap every pane content with a custom component.
- `onDestroy`: Cleanup hook when the splitter unmounts.
