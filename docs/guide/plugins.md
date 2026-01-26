# Plugin System Overview

Extend the core engine with modular functionality.

## Architecture

The plugin system is inspired by middleware patterns. Each plugin is a plain object that "hooks" into the component lifecycle. Plugins can:
- **Modify State**: Dispatch internal actions.
- **Listen to Events**: React to drags, adds, or removals.
- **Inject UI**: Provide custom handlebar or pane wrappers.

## Available Plugins

| Plugin | Purpose |
| :--- | :--- |
| `keyboardPlugin` | Accessibility via Arrows/Numbers. |
| `persistencePlugin` | JSON serialization to storage. |
| `customHandlePlugin` | Complete UI replacement for resize bars. |

## Why use Plugins?

By moving non-core features (like keyboard logic) into plugins, the core library stays extremely small and specialized. You only pay the "bundle size tax" for the features you actually use.

## Next Steps

Check the [Plugin API Reference](../api/plugins) to learn how to write your own custom logic.
