/**
 * @a-multilayout-splitter/core
 * 
 * High-performance split pane component for React.
 * Uses direct DOM manipulation to achieve 60fps drag performance.
 */

// --- Main Components ---
export { Split } from './components/Split';
export { DragHandle } from './components/DragHandle';
export { Pane as PaneComponent } from './components/Pane';

// --- Type Definitions ---
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
  PaneCollapseEvent,
  PaneExpandEvent,
  ResizeEvent,
  PluginConfig,
  SplitSnapshot,
  SplitControllerState,
  SplitControllerActions,
  UseSplitControllerOptions,
} from './types';

// --- Lifecycle Hooks ---
export { useDragHandler } from './hooks/useDragHandler';
export { usePaneManager } from './hooks/usePaneManager';
export { usePersistence } from './hooks/usePersistence';
export { usePluginContext } from './hooks/usePluginContext';
export { useSplitController } from './hooks/useSplitController';

// --- Plugin System ---
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

// --- Reactive Context Providers ---
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

// --- Nesting Support ---
export {
  NestingProvider,
  useNestingLevel,
  withNesting,
} from './contexts/NestingContext';

export type {
  NestingProviderProps,
} from './contexts/NestingContext';

// --- Low-level Utilities ---
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

// --- Default Export ---
export { Split as default } from './components/Split';
