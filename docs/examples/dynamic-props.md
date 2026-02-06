<script setup>
import DynamicPropsDemo from '../.vitepress/theme/demos/DynamicPropsDemo'
</script>

# Dynamic Props Update

This example demonstrates that **props updated externally are correctly propagated** to components inside panes. This is a common pattern when integrating with larger applications where state is managed at a higher level (Redux, Zustand, Context, etc.).

<ReactContainer :component="DynamicPropsDemo" />

## How It Works

State is managed in the parent component and passed down as props to child components inside the split panes. When state updates, the children automatically receive the new values.

```tsx
function App() {
  const [count, setCount] = useState(0);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  return (
    <Split mode="horizontal" initialSizes={['50%', '50%']}>
      {/* Props are passed directly - updates propagate correctly */}
      <DataPanel count={count} theme={theme} />
      <CounterDisplay value={count} />
    </Split>
  );
}
```

## Features Demonstrated

| Feature | Description |
|---------|-------------|
| **Manual Updates** | Click buttons to increment count, add items, or toggle theme |
| **Auto Updates** | Seconds counter increments automatically every second |
| **Nested Splits** | Props propagate correctly even through nested `<Split>` components |
| **Theme Switching** | Visual feedback shows props are updating in real-time |

## Why This Matters

When integrating a splitter into a larger application, you often need child components to react to external state changes:

- **Global state** (Redux, Zustand, Jotai) updating component props
- **API responses** populating data in pane contents
- **User interactions** elsewhere in the app affecting pane content
- **Real-time updates** (WebSocket, polling) refreshing displayed data

A-MultiLayout-Splitter handles this correctly by deriving content from the `children` prop at render time, ensuring props always propagate as expected.

## Code Example

```tsx
import { useState, useEffect } from 'react';
import { Split } from '@a-multilayout-splitter/core';

// Component that receives props
function DataPanel({ data, isLoading }) {
  if (isLoading) return <div>Loading...</div>;
  return <div>{data.map(item => <Item key={item.id} {...item} />)}</div>;
}

// Parent manages state and passes to children in panes
function App() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData().then(result => {
      setData(result);
      setIsLoading(false);
    });
  }, []);

  return (
    <Split initialSizes={['30%', '70%']}>
      <Sidebar />
      {/* Props update when data changes - works correctly! */}
      <DataPanel data={data} isLoading={isLoading} />
    </Split>
  );
}
```

## Dynamic Panes with `addPane`

When using the imperative `addPane` API, you have two options for content:

### Static Content (Default)

Content is captured at call time and won't update if state changes:

```tsx
// ⚠️ This count value is captured once - won't update later
splitRef.current?.addPane({
  size: '30%',
  content: <Counter value={count} />,
});
```

### Reactive Content with `render`

Use a render function to keep dynamic panes reactive to state changes:

```tsx
const [count, setCount] = useState(0);

// ✅ Render function is called on every render - stays reactive!
splitRef.current?.addPane({
  size: '30%',
  render: () => <Counter value={count} />,
});
```

::: tip Best Practice
For panes that need to react to state changes, prefer:
1. **Declarative children** (automatically reactive)
2. **`render` function** for imperatively added panes

Use `content` only for truly static panes that don't depend on external state.
:::
