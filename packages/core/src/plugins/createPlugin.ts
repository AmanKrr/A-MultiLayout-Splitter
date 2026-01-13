import { SplitPlugin } from '../types';

/**
 * Helper function to create a plugin with type safety
 *
 * @example
 * ```typescript
 * const myPlugin = createPlugin({
 *   name: 'my-plugin',
 *   version: '1.0.0',
 *   onInit(context) {
 *     console.log('Plugin initialized for split:', context.splitId);
 *   },
 *   onDragEnd(event, context) {
 *     console.log('Drag ended:', event);
 *   }
 * });
 * ```
 */
export function createPlugin(plugin: SplitPlugin): SplitPlugin {
  return plugin;
}
