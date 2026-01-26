<script setup>
import PropsPlayground from '../.vitepress/theme/demos/PropsPlayground'
</script>

# Props Playground

Experiment with the different properties of the `Split` component in real-time.

<ReactContainer :component="PropsPlayground" style="min-height: 600px;" />

## Interactive Props Guide

### `mode`
Defines the direction of the split.
- **`horizontal`**: Panes are side-by-side. Handles are vertical lines.
- **`vertical`**: Panes are stacked. Handles are horizontal lines.

### `lineBar`
When enabled, the resize handle changes from a wide interactive area to a sleek, thin line. This is ideal for minimal UIs.

### `disable`
Prevents any resizing interaction. The handles remain visible (unless `visible` is false) but cannot be dragged.

### `visible`
Controls whether the resize handles are rendered at all. If set to `false`, the panes will be static.

### `minSizes`
An array of numbers representing the minimum percentage each pane must occupy. The splitter will block any drag that violates these constraints.

### `initialSizes`
Defines how the space is divided when the component first mounts. Supports percentage (e.g., `'30%'`) and absolute (e.g., `'200px'`) values.
