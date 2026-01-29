/**
 * Plugin system for a-multilayout-splitter
 *
 * @example
 * ```typescript
 * import { Split, createPlugin, persistencePlugin } from 'a-multilayout-splitter';
 *
 * const myPlugin = createPlugin({
 *   name: 'my-plugin',
 *   onDragEnd(event, context) {
 *     console.log('Drag ended:', event);
 *   }
 * });
 *
 * <Split plugins={[persistencePlugin(), myPlugin]}>
 *   ...
 * </Split>
 * ```
 */

export { PluginManager } from './PluginManager';
export { createPlugin } from './createPlugin';

// Re-export built-in plugins
export * from './builtins';
