# Split Props

Detailed reference for all configuration properties available on the `Split` component.

## Core Configuration

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | Generated | Unique identifier for this split instance. |
| `mode` | `'horizontal' \| 'vertical'` | `'horizontal'` | The orientation of the layout. |
| `initialSizes` | `string[]` | `[]` | Starting sizes for each pane (e.g. `['30%', '70%']`). |
| `minSizes` | `number[]` | `[]` | Minimum allowed width/height for each pane (percentage). |
| `maxSizes` | `number[]` | `[]` | Maximum allowed width/height for each pane (percentage). |
| `collapsed` | `boolean[]` | `[]` | Initial visibility state for each pane. |

## UI & Styling

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `lineBar` | `boolean \| boolean[]` | `false` | If true, uses a simplified thin line style for the resize bar. |
| `visible` | `boolean \| boolean[]` | `true` | Controls the visibility of the resize handlebars. |
| `disable` | `boolean \| boolean[]` | `false` | Prevents user interaction with specific handlebars. |
| `className` | `string` | `''` | Extra CSS class for the split container. |
| `style` | `CSSProperties` | `{}` | Inline styles for the split container. |
| `renderBar` | `function` | `undefined` | Custom renderer to replace the default handlebar UI. |

## Advanced Features

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `plugins` | `SplitPlugin[]` | `[]` | Array of plugins to extend the component's functionality. |
| `enablePersistence` | `boolean` | `false` | Enable automatic auto-save/restore to `localStorage`. |
| `fixClass` | `boolean` | `false` | Force-apply a legacy CSS fix for specific deep-nesting bugs. |

## Event Callbacks

### `onDragging`
Triggered continuously during a user resize operation.
```ts
onDragging?: (prevSize: number, nextSize: number, paneIndex: number) => void;
```

### `onDragEnd`
Triggered once the user releases the resize handlebar.
```ts
onDragEnd?: (prevSize: number, nextSize: number, paneIndex: number) => void;
```

### `onLayoutChange`
A generic catch-all callback for any layout state change (open/close/add/remove).
```ts
onLayoutChange?: (
  index: number,
  paneId: string,
  status: PaneStatus,
  direction: Direction | null
) => void;
```

## Styling with CSS Variables

Instead of passing props for colors, v6 relies on modern CSS variables which can be overridden in your global stylesheet:

```css
:root {
  --split-primary-color: #9c27b0;
  --split-bg-color: #e0e0e0;
  --split-icon-color: #666;
  --split-focus-ring: #4285f4;
}
```
