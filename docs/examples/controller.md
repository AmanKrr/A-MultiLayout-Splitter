<script setup>
import ControllerDemo from '../.vitepress/theme/demos/ControllerDemo'
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

## Why use the Ref API?
- **Stability**: Methods on the ref have stable identities and don't trigger parent re-renders.
- **Performance**: Operations like `collapsePane` or `addPane` happen instantly within the component.
- **Simplicity**: No need to manage complex pane state arrays in your parent component.

## Why use this?
- **Sync with UI**: Update buttons or nav items based on whether a pane is open.
- **Remote Control**: Add or remove panes from any part of your application without using a React Ref.
- **State Serialization**: Save the entire `panes` array to your own Redux or Zustand store easily.
