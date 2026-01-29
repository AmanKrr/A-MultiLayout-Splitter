import {
  SplitPlugin,
  PluginContext,
  DragStartEvent,
  DragMoveEvent,
  DragEndEvent,
  PaneAddEvent,
  PaneRemoveEvent,
  PaneCollapseEvent,
  PaneExpandEvent,
  ResizeEvent,
  HandleRenderProps,
  Pane,
} from '../types';
import { ReactNode } from 'react';

/**
 * PluginManager
 *
 * Internal class that orchestrates the lifecycle and events of Split plugins.
 * Acts as a bridge between the Split component and registered plugin instances.
 */
export class PluginManager {
  private plugins: SplitPlugin[] = [];
  private context: PluginContext;

  constructor(context: PluginContext) {
    this.context = context;
  }

  /**
   * Registers a set of plugins and triggers their initialization.
   */
  registerPlugins(plugins: SplitPlugin[]): void {
    this.plugins = plugins;
    this.plugins.forEach((plugin) => {
      if (plugin.onInit) {
        plugin.onInit(this.context);
      }
    });
  }

  /**
   * Cleans up all plugins and triggers their destruction hooks.
   */
  destroy(): void {
    this.plugins.forEach((plugin) => {
      if (plugin.onDestroy) {
        plugin.onDestroy(this.context);
      }
    });
    this.plugins = [];
  }

  /**
   * Notifies plugins when a pane is added.
   */
  onPaneAdd(event: PaneAddEvent): void {
    this.plugins.forEach((plugin) => {
      if (plugin.onPaneAdd) {
        plugin.onPaneAdd(event, this.context);
      }
    });
  }

  /**
   * Notifies plugins when a pane is removed.
   */
  onPaneRemove(event: PaneRemoveEvent): void {
    this.plugins.forEach((plugin) => {
      if (plugin.onPaneRemove) {
        plugin.onPaneRemove(event, this.context);
      }
    });
  }

  /**
   * Notifies plugins when a pane is collapsed.
   */
  onPaneCollapse(event: PaneCollapseEvent): void {
    this.plugins.forEach((plugin) => {
      if (plugin.onPaneCollapse) {
        plugin.onPaneCollapse(event, this.context);
      }
    });
  }

  /**
   * Notifies plugins when a pane is expanded.
   */
  onPaneExpand(event: PaneExpandEvent): void {
    this.plugins.forEach((plugin) => {
      if (plugin.onPaneExpand) {
        plugin.onPaneExpand(event, this.context);
      }
    });
  }

  /**
   * Notifies plugins when a drag operation begins.
   */
  onDragStart(event: DragStartEvent): void {
    this.plugins.forEach((plugin) => {
      if (plugin.onDragStart) {
        plugin.onDragStart(event, this.context);
      }
    });
  }

  /**
   * Notifies plugins during drag movement.
   * Plugins can return false to cancel the default drag behavior.
   */
  onDragMove(event: DragMoveEvent): boolean {
    let shouldContinue = true;

    for (const plugin of this.plugins) {
      if (plugin.onDragMove) {
        const result = plugin.onDragMove(event, this.context);
        if (result === false) {
          shouldContinue = false;
        }
      }
    }

    return shouldContinue;
  }

  /**
   * Notifies plugins when a drag operation ends.
   */
  onDragEnd(event: DragEndEvent): void {
    this.plugins.forEach((plugin) => {
      if (plugin.onDragEnd) {
        plugin.onDragEnd(event, this.context);
      }
    });
  }

  /**
   * Notifies plugins when the split container is resized.
   */
  onResize(event: ResizeEvent): void {
    this.plugins.forEach((plugin) => {
      if (plugin.onResize) {
        plugin.onResize(event, this.context);
      }
    });
  }

  /**
   * Allows plugins to provide a custom handlebar renderer.
   * Returns the first valid renderer found.
   */
  renderHandle(props: HandleRenderProps): ReactNode | null {
    for (const plugin of this.plugins) {
      if (plugin.renderHandle) {
        const customHandle = plugin.renderHandle(props, this.context);
        if (customHandle) {
          return customHandle;
        }
      }
    }
    return null;
  }

  /**
   * Allows plugins to provide a custom pane wrapper.
   * Returns the first valid renderer found.
   */
  renderPane(pane: Pane): ReactNode | null {
    for (const plugin of this.plugins) {
      if (plugin.renderPane) {
        const customPane = plugin.renderPane(pane, this.context);
        if (customPane) {
          return customPane;
        }
      }
    }
    return null;
  }

  /**
   * Retrieves all registered plugins.
   */
  getPlugins(): SplitPlugin[] {
    return this.plugins;
  }

  /**
   * Retrieves a specific plugin by its unique name.
   */
  getPlugin(name: string): SplitPlugin | undefined {
    return this.plugins.find((plugin) => plugin.name === name);
  }

  /**
   * Checks if a plugin with the given name is currently registered.
   */
  hasPlugin(name: string): boolean {
    return this.plugins.some((plugin) => plugin.name === name);
  }
}
