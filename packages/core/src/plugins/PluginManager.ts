import {
  SplitPlugin,
  PluginContext,
  DragStartEvent,
  DragMoveEvent,
  DragEndEvent,
  PaneAddEvent,
  PaneRemoveEvent,
  ResizeEvent,
  HandleRenderProps,
  Pane,
} from '../types';
import { ReactNode } from 'react';

/**
 * PluginManager handles plugin lifecycle and event dispatching
 */
export class PluginManager {
  private plugins: SplitPlugin[] = [];
  private context: PluginContext;

  constructor(context: PluginContext) {
    this.context = context;
  }

  /**
   * Register plugins and call their onInit hooks
   */
  registerPlugins(plugins: SplitPlugin[]): void {
    this.plugins = plugins;
    this.plugins.forEach(plugin => {
      if (plugin.onInit) {
        plugin.onInit(this.context);
      }
    });
  }

  /**
   * Unregister all plugins and call their onDestroy hooks
   */
  destroy(): void {
    this.plugins.forEach(plugin => {
      if (plugin.onDestroy) {
        plugin.onDestroy(this.context);
      }
    });
    this.plugins = [];
  }

  /**
   * Lifecycle: Pane added
   */
  onPaneAdd(event: PaneAddEvent): void {
    this.plugins.forEach(plugin => {
      if (plugin.onPaneAdd) {
        plugin.onPaneAdd(event, this.context);
      }
    });
  }

  /**
   * Lifecycle: Pane removed
   */
  onPaneRemove(event: PaneRemoveEvent): void {
    this.plugins.forEach(plugin => {
      if (plugin.onPaneRemove) {
        plugin.onPaneRemove(event, this.context);
      }
    });
  }

  /**
   * Lifecycle: Drag start
   */
  onDragStart(event: DragStartEvent): void {
    this.plugins.forEach(plugin => {
      if (plugin.onDragStart) {
        plugin.onDragStart(event, this.context);
      }
    });
  }

  /**
   * Lifecycle: Drag move
   * Returns false if any plugin prevents default behavior
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
   * Lifecycle: Drag end
   */
  onDragEnd(event: DragEndEvent): void {
    this.plugins.forEach(plugin => {
      if (plugin.onDragEnd) {
        plugin.onDragEnd(event, this.context);
      }
    });
  }

  /**
   * Lifecycle: Container resize
   */
  onResize(event: ResizeEvent): void {
    this.plugins.forEach(plugin => {
      if (plugin.onResize) {
        plugin.onResize(event, this.context);
      }
    });
  }

  /**
   * Component enhancement: Custom handle renderer
   * Returns the first custom renderer found
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
   * Component enhancement: Custom pane wrapper renderer
   * Returns the first custom renderer found
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
   * Get all registered plugins
   */
  getPlugins(): SplitPlugin[] {
    return this.plugins;
  }

  /**
   * Get plugin by name
   */
  getPlugin(name: string): SplitPlugin | undefined {
    return this.plugins.find(plugin => plugin.name === name);
  }

  /**
   * Check if plugin is registered
   */
  hasPlugin(name: string): boolean {
    return this.plugins.some(plugin => plugin.name === name);
  }
}
