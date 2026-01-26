# Core Architecture

Understand the "React-First" performance model that powers **A-MultiLayout-Splitter v6**.

## The Performance Paradox

In traditional React components, every user interaction (like dragging a mouse) triggers a state update, a re-render, and a DOM update. While React is fast, doing this 60 times per second during a complex layout resize can lead to "input lag" or "jitter," especially if the panes contain heavy charts, data grids, or iframe content.

**A-MultiLayout-Splitter** solves this by separating the **Interaction Phase** from the **State Phase**.

## 1. The Interaction Phase (Native Speed)

When a user begins dragging a handlebar:
1. **React is Bypassed**: We stop letting React manage the pane dimensions temporarily.
2. **Direct DOM Manipulation**: The `useDragHandler` hook listens to raw pointer events and updates the `flex-basis` of the DOM elements directly using high-frequency updates.
3. **Throttled Logic**: Calculations are throttled to match the browser's refresh rate (typically 60fps), ensuring no wasted CPU cycles.

## 2. The State Phase (React Sync)

Once the user releases the mouse button:
1. **Snap to State**: The final dimensions are calculated as clean percentages.
2. **React Re-render**: A single React state update is triggered.
3. **Consistency**: The internal `panes` state is updated, ensuring that the "source of truth" remains in React for future lifecycle events (like adding/removing panes).

## 3. High-Efficiency Contexts

To prevent the entire layout from re-rendering when only a single property changes, v6 uses a **Triple Context** architecture:

- **ConfigContext**: Stores static IDs and modes. (Never re-renders after mount).
- **StateContext**: Stores reactive data like pane sizes. (Subscribed to by the `Pane` components).
- **ActionsContext**: Provides stable method references (like `togglePane`). (Never triggers re-renders for consumers).

## Results

This hybrid approach allows you to build IDE-grade interfaces that feel as responsive as a native C++ application while retaining the simplicity of the React declarative mental model.

---

### Key Technical Specs

- **Drag Performance**: ~16ms frame budget (60fps)
- **Memory Overhead**: Minimal (Pure functional approach)
- **Dependency Tree**: Zero (Built on raw browser APIs)
