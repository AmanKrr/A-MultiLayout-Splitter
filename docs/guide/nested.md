# Nested Layouts

**A-MultiLayout-Splitter** is built from the ground up to handle complex, multi-level nested layouts.

## Automatic Context Handling

When you nest a `Split` component inside another `Split`, the library automatically detects the nesting level. This allows it to:
1. Prevent event bubbling issues.
2. Apply necessary CSS fixes for deep flexbox nesting.
3. Manage coordinate systems correctly during dragging.

## Example: IDE Layout

A common use case is a Sidebar splitting a main area, which is then split into an Editor and a Terminal.

```tsx
<Split mode="horizontal" initialSizes={['200px', '1fr']}>
  <div className="sidebar">Explorer</div>
  
  {/* Nested Vertical Split */}
  <Split mode="vertical" initialSizes={['70%', '30%']}>
    <div className="editor">Main Code Editor</div>
    <div className="terminal">Internal Terminal</div>
  </Split>
</Split>
```

## Tips for Better Performance

- **Avoid Re-renders**: If you have a deep tree, use `memo` on your pane content components to prevent unnecessary React reconciliation during the splitter's final state update.
- **Controlled Nesting**: Use the `useNestingLevel()` hook if you need to style components differently based on how deep they are placed.
