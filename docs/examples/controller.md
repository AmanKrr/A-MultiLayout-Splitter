<script setup>
import ControllerDemo from '../.vitepress/theme/demos/ControllerDemo'
</script>

# Interactive Controller Demo

Manage pane state externally via the `useSplitController` hook for maximum flexibility.

<ReactContainer :component="ControllerDemo" />

```tsx
import { useSplitController, Split } from '@a-multilayout-splitter/core';

export default () => {
  const { panes, togglePane, addPane } = useSplitController({
    initialSizes: ['50%', '50%']
  });

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button onClick={() => togglePane(0)}>Toggle Left</button>
        <button onClick={() => addPane({ size: '30%', content: 'Added!' })}>Add Pane</button>
      </div>

      <div style={{ height: '300px' }}>
        <Split initialPanes={panes} />
      </div>
    </div>
  );
};
```

## Why use this?
- **Sync with UI**: Update buttons or nav items based on whether a pane is open.
- **Remote Control**: Add or remove panes from any part of your application without using a React Ref.
- **State Serialization**: Save the entire `panes` array to your own Redux or Zustand store easily.
