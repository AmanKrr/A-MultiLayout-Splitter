/**
 * A-MultiLayout-Splitter v6.0.0
 *
 * High-performance split pane component for React with 60fps drag performance.
 *
 * Breaking Changes from v5:
 * - Functional components with hooks (no class-based API)
 * - Reactive props (no SplitStateProvider workaround needed)
 * - Clean TypeScript types
 * - ESM + CJS dual format
 * - Removed lodash dependency
 *
 * Migration Guide:
 * - Replace class-based Split with functional Split
 * - Use ref for imperative API instead of static methods
 * - Remove SplitStateProvider (no longer needed)
 * - Update imports to use named exports
 */

// ==================== v6 API (Primary) ====================

// Main component
export { Split } from './components/Split';

// Sub-components (for advanced usage)
export { DragHandle } from './components/DragHandle';
export { Pane as PaneComponent } from './components/Pane';

// Types
export type {
  SplitProps,
  SplitRef,
  SplitMode,
  Direction,
  PaneStatus,
  Pane,
  DragState,
  DragCallbacks,
  DragStartEvent,
  DragMoveEvent,
  DragEndEvent,
  AddPaneConfig,
  AnimationOptions,
  SplitPlugin,
  PluginContext,
  DragHandleProps,
  PaneProps,
  SplitAction,
  Dimensions,
  HandleRenderProps,
  PaneAddEvent,
  PaneRemoveEvent,
  ResizeEvent,
  PluginConfig,
} from './types';

// Hooks (for custom implementations)
export { useDragHandler } from './hooks/useDragHandler';
export { usePaneManager } from './hooks/usePaneManager';
export { usePersistence } from './hooks/usePersistence';
export { usePluginContext } from './hooks/usePluginContext';

// Plugin System (Phase 3)
export {
  PluginManager,
  createPlugin,
  persistencePlugin,
  clearPersistedState,
  keyboardPlugin,
  customHandlePlugin,
  customHandleRenderPlugin,
} from './plugins';

export type {
  PersistencePluginOptions,
  StorageType,
  KeyboardPluginOptions,
  CustomHandleComponentProps,
} from './plugins';

// Context Provider (optional)
export {
  SplitProvider,
  useSplitConfig,
  useSplitState,
  useSplitActions,
  useSplit,
  usePane,
  usePaneCount,
  useIsDragging,
  useIsCollapsed,
  useVisiblePanes,
} from './contexts/SplitProvider';

export type {
  SplitConfig,
  SplitState,
  SplitActions,
  SplitProviderProps,
} from './contexts/SplitProvider';

// Utilities (for advanced usage)
export {
  percentageToPixel,
  pixelToPercentage,
  normalizeSize,
  parseSize,
  haveSameUnit,
  clampSize,
} from './utils/sizeConversion';

export {
  calculateTotalSize,
  validatePaneSizes,
  calculateFlexBasis,
  calculateFlexValues,
  calculateHandlebarPosition,
  getContainerDimensions,
  normalizePaneSizes,
  canResize,
  getAxisProperty,
  getCoordinateProperty,
} from './utils/layoutCalculations';

export {
  applyCollapseState,
  animatePaneSize,
  togglePaneCollapse,
  findPaneIndex,
  isPaneVisible,
  getVisiblePanes,
  getPaneElement,
  constrainSize,
  createPane,
  updatePaneSize,
  batchUpdatePanes,
  restorePaneState,
  serializePaneState,
  shouldShowHandlebar,
  isHandlebarDisabled,
  isHandlebarVisible,
  isLineBarStyle,
} from './utils/paneOperations';

export { throttle, debounce } from './utils/native/throttle';

// ==================== v5 Legacy API (Removed) ====================
// v5 legacy code has been archived and is no longer available.
// All users must migrate to the v6 API.
// See archive/v5-legacy/README.md for migration guidance.

// Default export
export { Split as default } from './components/Split';
