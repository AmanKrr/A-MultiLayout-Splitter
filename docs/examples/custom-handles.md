<script setup>
import CustomHandleDemo from '../.vitepress/theme/demos/CustomHandleDemo'
</script>

# Custom Handles Demo

Replace the standard resize bar with your own UI elements.

<ReactContainer :component="CustomHandleDemo" />

```tsx
import { Split, customHandleRenderPlugin } from '@a-multilayout-splitter/core';

const MyHandle = (props) => (
  <div 
    onMouseDown={props.onMouseDown}
    style={{
      width: '10px',
      background: props.disabled ? '#eee' : '#3498db',
      cursor: 'col-resize',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}
  >
    <div style={{ width: '2px', height: '20px', background: 'white' }} />
  </div>
);

export default () => (
  <Split 
    plugins={[customHandleRenderPlugin(MyHandle)]}
  >
    <div>Pane 1</div>
    <div>Pane 2</div>
  </Split>
);
```

## Styling options:
- **`customHandlePlugin`**: Pass a full component.
- **`customHandleRenderPlugin`**: Pass a simple render function.
- **CSS Variables**: Alternatively, just override `--split-primary-color` for a simpler look.
