<script setup>
import NestedRefDemo from '../.vitepress/theme/demos/NestedRefDemo'
import NestedHookDemo from '../.vitepress/theme/demos/NestedHookDemo'
import NestedMixedDemo from '../.vitepress/theme/demos/NestedMixedDemo'
</script>

# Controlling Nested Layouts

For complex IDE-like layouts with nested splits, you can control specific nested panes using multiple refs or controllers. Each `Split` component maintains its own state, so you need a separate ref or controller for each level you want to control.

---

## Using Ref API for Nested Layouts

The simplest approach for nested control - use a separate `ref` for each `Split` you want to control.

<ReactContainer :component="NestedRefDemo" />

```tsx
import { useRef } from 'react';
import { Split, type SplitRef } from '@a-multilayout-splitter/core';

function NestedRefLayout() {
  // Ref for outer horizontal split
  const outerRef = useRef<SplitRef>(null);

  // Ref for inner vertical split
  const innerRef = useRef<SplitRef>(null);

  return (
    <div>
      <header>
        {/* Control outer split */}
        <button onClick={() => outerRef.current?.togglePane(0)}>
          Toggle Sidebar
        </button>
        <button onClick={() => outerRef.current?.togglePane(2)}>
          Toggle Right Panel
        </button>

        {/* Control inner split */}
        <button onClick={() => innerRef.current?.togglePane(1)}>
          Toggle Terminal
        </button>
      </header>

      {/* Outer horizontal split */}
      <Split ref={outerRef} mode="horizontal" initialSizes={['20%', '50%', '30%']}>
        <div>Sidebar</div>

        {/* Nested vertical split */}
        <Split ref={innerRef} mode="vertical" initialSizes={['70%', '30%']}>
          <div>Editor</div>
          <div>Terminal</div>
        </Split>

        <div>Right Panel</div>
      </Split>
    </div>
  );
}
```

### Why use Ref API for nested layouts?
- **Simple and direct**: Just add a ref to each Split you need to control.
- **No extra state**: The Split component manages its own state internally.
- **Performance**: Ref methods don't cause parent re-renders.

---

## Using Hook API for Nested Layouts

When you need to read and react to pane state (e.g., show different UI based on collapsed state), use `useSplitController` for each nested Split.

<ReactContainer :component="NestedHookDemo" />

```tsx
import { useSplitController, Split } from '@a-multilayout-splitter/core';

function NestedHookLayout() {
  // Controller for outer horizontal split
  const outerController = useSplitController({
    mode: 'horizontal',
    initialPanes: [
      { id: 'sidebar', size: '20%', collapsed: false, minSize: 10, maxSize: 40, content: null },
      { id: 'center', size: '50%', collapsed: false, minSize: 30, maxSize: 70, content: null },
      { id: 'right', size: '30%', collapsed: false, minSize: 15, maxSize: 50, content: null },
    ],
  });

  // Controller for inner vertical split
  const innerController = useSplitController({
    mode: 'vertical',
    initialPanes: [
      { id: 'editor', size: '70%', collapsed: false, minSize: 30, maxSize: 85, content: null },
      { id: 'terminal', size: '30%', collapsed: false, minSize: 15, maxSize: 50, content: null },
    ],
  });

  // Map collapsed states to pass to Split components
  const outerCollapsed = outerController.panes.map(p => p.collapsed);
  const innerCollapsed = innerController.panes.map(p => p.collapsed);

  return (
    <div>
      <header>
        {/* Outer controls with reactive labels */}
        <button onClick={() => outerController.togglePane(0)}>
          {outerController.panes[0]?.collapsed ? 'Show' : 'Hide'} Sidebar
        </button>
        <button onClick={() => outerController.togglePane(2)}>
          {outerController.panes[2]?.collapsed ? 'Show' : 'Hide'} Right Panel
        </button>

        {/* Inner controls with reactive labels */}
        <button onClick={() => innerController.togglePane(1)}>
          {innerController.panes[1]?.collapsed ? 'Show' : 'Hide'} Terminal
        </button>

        {/* Display current state */}
        <span>
          Sidebar: {outerController.panes[0]?.collapsed ? 'closed' : 'open'} |
          Terminal: {innerController.panes[1]?.collapsed ? 'closed' : 'open'}
        </span>
      </header>

      {/* Outer split */}
      <Split
        mode="horizontal"
        initialSizes={['20%', '50%', '30%']}
        collapsed={outerCollapsed}
        minSizes={[10, 30, 15]}
      >
        <div>Sidebar</div>

        {/* Inner split controlled by hook */}
        <Split
          mode="vertical"
          initialSizes={['70%', '30%']}
          collapsed={innerCollapsed}
          minSizes={[30, 15]}
        >
          <div>Editor</div>
          <div>Terminal</div>
        </Split>

        <div>Right Panel</div>
      </Split>
    </div>
  );
}
```

### Why use Hook API for nested layouts?
- **Reactive UI**: Button labels and status indicators update automatically.
- **State access**: Read pane state directly from `controller.panes`.
- **External sync**: Integrate with Redux, Zustand, or localStorage via `onPaneChange`.

---

## Mixed Approach (Ref + Hook)

Use Ref API for simple toggle actions and Hook API only where you need reactive state. This gives you the best of both worlds.

<ReactContainer :component="NestedMixedDemo" />

```tsx
import { useRef } from 'react';
import { Split, type SplitRef, useSplitController } from '@a-multilayout-splitter/core';

function MixedNestedLayout() {
  // Ref for outer split (simple toggle, no state needed)
  const outerRef = useRef<SplitRef>(null);

  // Ref for center split (simple toggle)
  const centerRef = useRef<SplitRef>(null);

  // Hook for right panel (need reactive state for UI)
  const rightPanelController = useSplitController({
    mode: 'vertical',
    initialPanes: [
      { id: 'preview', size: '60%', collapsed: false, minSize: 20, maxSize: 80, content: null },
      { id: 'console', size: '40%', collapsed: false, minSize: 15, maxSize: 60, content: null },
    ],
  });

  // Map collapsed state for the right panel
  const rightPanelCollapsed = rightPanelController.panes.map(p => p.collapsed);

  return (
    <div>
      <header>
        {/* Outer controls via Ref (simple) */}
        <button onClick={() => outerRef.current?.togglePane(0)}>
          Toggle Sidebar
        </button>

        {/* Center controls via Ref (simple) */}
        <button onClick={() => centerRef.current?.togglePane(1)}>
          Toggle Terminal
        </button>

        {/* Right panel controls via Hook (reactive) */}
        <button onClick={() => rightPanelController.togglePane(1)}>
          {rightPanelController.panes[1]?.collapsed ? 'Show' : 'Hide'} Console
        </button>
      </header>

      <Split
        ref={outerRef}
        mode="horizontal"
        initialSizes={['20%', '50%', '30%']}
        minSizes={[10, 30, 15]}
      >
        <div>Sidebar</div>

        {/* Center - Ref API */}
        <Split ref={centerRef} mode="vertical" initialSizes={['70%', '30%']} minSizes={[30, 15]}>
          <div>Editor</div>
          <div>Terminal</div>
        </Split>

        {/* Right panel - Hook API for reactive state */}
        <Split
          mode="vertical"
          initialSizes={['60%', '40%']}
          collapsed={rightPanelCollapsed}
          minSizes={[20, 15]}
        >
          <div>Preview</div>
          <div>Console ({rightPanelController.panes[1]?.collapsed ? 'hidden' : 'visible'})</div>
        </Split>
      </Split>
    </div>
  );
}
```

### When to use Mixed Approach?
- **Ref** for simple toggle buttons where you don't need to know the current state.
- **Hook** for UI that needs to react to pane state (dynamic labels, status indicators, conditional rendering).

---

## Key Points

| Point | Description |
|-------|-------------|
| **One ref/controller per Split** | Each `Split` needs its own ref or controller |
| **Pane indices are local** | `togglePane(1)` refers to index 1 of that specific Split |
| **Parent collapse hides children** | Collapsing an outer pane hides all nested Splits inside |
| **State is independent** | Each Split maintains its own state separately |
