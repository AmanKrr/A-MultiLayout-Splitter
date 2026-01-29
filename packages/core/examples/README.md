# A-MultiLayout-Splitter v6 - Examples

Comprehensive examples showcasing every feature of the A-MultiLayout-Splitter library.

## 📁 Directory Structure

```
examples/
├── basic/          # Basic usage examples (6 examples)
├── advanced/       # Advanced features (5 examples)
├── api/            # API patterns (3 examples)
├── nested/         # Nested layouts (3 examples)
├── plugins/        # Plugin system (3 examples)
└── index.tsx       # Interactive examples browser
```

## 🚀 Running the Examples

### Quick Start (Recommended)

The examples are already integrated in the dev server!

```bash
# From the root directory
cd examples/basic

# Install dependencies (if needed)
pnpm install

# Start the dev server
pnpm dev
```

The browser will automatically open at http://localhost:3000 showing the **interactive examples browser** with all 20 examples!

### Alternative: From Root

```bash
# From the monorepo root
cd examples/basic && pnpm dev
```

### Option 2: Individual Examples

Each example is a standalone React component that can be imported directly:

```tsx
import SimpleHorizontal from "@a-multilayout-splitter/core/examples/basic/01-SimpleHorizontal";

function App() {
  return <SimpleHorizontal />;
}
```

## 📚 Examples Overview

### Basic Examples (6)

Learn the fundamentals of the Split component.

1. **Simple Horizontal Split** - Two panes side by side
2. **Simple Vertical Split** - Two panes stacked vertically
3. **Three Panes** - Multiple panes with multiple handlebars
4. **Min/Max Sizes** - Constraining pane sizes
5. **Initial Collapsed** - Starting with collapsed panes
6. **Pixel Sizes** - Using fixed pixel values

### Advanced Features (5)

Explore advanced capabilities for complex layouts.

1. **Disabled Handlebars** - Prevent resizing specific sections
2. **Line Bar Style** - Minimal handlebar appearance
3. **Custom Handlebar** - Custom handlebar designs
4. **Drag Callbacks** - React to user interactions
5. **Session Storage** - Automatic layout persistence

### API Patterns (3)

Learn different ways to control the Split component.

1. **Declarative API** - Control via props (recommended)
2. **Imperative API** - Control via ref methods
3. **Hook-Based API** - useSplitController hook

### Nested Layouts (3)

Master complex nested layout patterns.

1. **Simple Nested** - Basic IDE-like layout
2. **Complex Nested** - Deep multi-level nesting
3. **Auto Fix Class** - Automatic positioning for deep nesting

### Plugin System (3)

Extend functionality with plugins.

1. **Persistence Plugin** - localStorage persistence
2. **Keyboard Plugin** - Keyboard navigation & accessibility
3. **Custom Plugin** - Create your own plugins

## 🎯 Quick Start

### Basic Usage

```tsx
import { Split } from "@a-multilayout-splitter/core";
import "@a-multilayout-splitter/core/style.css";

function App() {
  return (
    <Split mode="horizontal" initialSizes={["50%", "50%"]}>
      <div>Left Pane</div>
      <div>Right Pane</div>
    </Split>
  );
}
```

### With Features

```tsx
<Split
  id="my-split"
  mode="horizontal"
  initialSizes={["40%", "60%"]}
  minSizes={[20, 30]}
  maxSizes={[60, 80]}
  collapsed={[false, false]}
  lineBar={false}
  disable={false}
  enablePersistence={true}
  onDragEnd={(prevSize, nextSize, index) => {
    console.log("Resized:", prevSize, nextSize);
  }}
>
  <div>Pane 1</div>
  <div>Pane 2</div>
</Split>
```

### Nested Layout

```tsx
<Split mode="horizontal" initialSizes={["30%", "70%"]}>
  {/* Sidebar */}
  <div>Sidebar</div>

  {/* Main area with nested vertical split */}
  <Split mode="vertical" initialSizes={["70%", "30%"]}>
    <div>Editor</div>
    <div>Terminal</div>
  </Split>
</Split>
```

### With Plugins

```tsx
import { Split, createPersistencePlugin, createKeyboardPlugin } from "@a-multilayout-splitter/core";
import "@a-multilayout-splitter/core/style.css";

const plugins = [createPersistencePlugin({ storage: "localStorage" }), createKeyboardPlugin({ resizeStep: 5 })];

<Split id="app-layout" plugins={plugins}>
  <div>Pane 1</div>
  <div>Pane 2</div>
</Split>;
```

## 🔧 Development

To add new examples:

1. Create a new `.tsx` file in the appropriate category folder
2. Follow the existing example structure:
   - JSDoc comment at the top explaining the example
   - Default export of the component
   - Inline styles for demonstration (no external CSS)
   - Clear visual indicators and labels

3. Add the example to `index.tsx`:

   ```tsx
   import NewExample from "./category/XX-NewExample";

   const EXAMPLES = [
     // ...
     {
       id: "new-example",
       title: "XX. New Example",
       description: "What this example demonstrates",
       component: NewExample,
       category: "basic", // or 'advanced', 'api', etc.
     },
   ];
   ```

## 📖 Documentation

For detailed API documentation, see:

- [Main README](../../../README.md)
- [API Reference](../docs/API.md)
- [TypeScript Types](../src/types/index.ts)

## 🎨 Styling

All examples use inline styles for portability. In production:

- Import the CSS: `import '@a-multilayout-splitter/core/style.css'`
- Customize via CSS variables or class overrides
- Use the `className` prop for custom styling

## 🤝 Contributing

To contribute new examples:

1. Ensure the example demonstrates a unique feature or pattern
2. Add clear comments and documentation
3. Test across different browsers
4. Follow the existing code style
5. Update this README

## 📝 License

MIT License - see [LICENSE](../../../LICENSE) for details
