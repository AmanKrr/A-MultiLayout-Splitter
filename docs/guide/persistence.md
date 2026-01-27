# State Persistence

Save and restore your user's favorite layouts automatically.

## How it Works

Persistence in **A-MultiLayout-Splitter** is handled by the `persistencePlugin`. It captures the `size` and `collapsed` state of every pane and serializes them to the browser's storage whenever a drag operation completes.

## Simple Usage

The easiest way to enable persistence is via the `enablePersistence` shorthand prop:

```tsx
<Split id="main-editor" enablePersistence>
  <div>Pane 1</div>
  <div>Pane 2</div>
</Split>
```

## Advanced Persistence

For more control, use the `persistencePlugin` directly. This allows you to choose between `localStorage` (persistent forever) and `sessionStorage` (cleared when tab closes).

```tsx
import { Split, persistencePlugin } from '@a-multilayout-splitter/core';

<Split 
  plugins={[
    persistencePlugin({ 
      storage: 'localStorage',
      key: 'custom-key',
      debounceDelay: 500
    })
  ]}
>
  ...
</Split>
```

## Manual Clearing

If you need to reset the layout to defaults, you can use the utility function:

```ts
import { clearPersistedState } from '@a-multilayout-splitter/core';

const handleReset = () => {
  clearPersistedState('main-editor', 'localStorage');
  window.location.reload();
};
```
