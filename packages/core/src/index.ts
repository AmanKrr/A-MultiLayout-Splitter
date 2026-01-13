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
} from './types';

// Hooks (for custom implementations)
export { useDragHandler } from './hooks/useDragHandler';
export { usePaneManager } from './hooks/usePaneManager';
export { usePersistence } from './hooks/usePersistence';

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

// ==================== v5 Legacy API (Deprecated) ====================
// These are kept for reference but will be removed in future versions
// Users should migrate to v6 API

// @ts-ignore - Legacy v5 code not updated for strict TypeScript
import Split from './base/Split';
// @ts-ignore - Legacy v5 code not updated for strict TypeScript
import SplitUtils from './utils/SplitUtils';
// @ts-ignore - Legacy v5 code not updated for strict TypeScript
import SplitSessionStorage from './utils/SplitSessionStorage';
// @ts-ignore - Legacy v5 code not updated for strict TypeScript
import { SplitStateProvider } from './base/SplitProvider';

// @ts-ignore - Legacy v5 code not updated for strict TypeScript
const openSplitter = SplitUtils.openSplitter.bind(SplitUtils);
// @ts-ignore - Legacy v5 code not updated for strict TypeScript
const closeSplitter = SplitUtils.closeSplitter.bind(SplitUtils);
// @ts-ignore - Legacy v5 code not updated for strict TypeScript
const getSplitPaneInstance = SplitUtils.getSplitPaneInstance.bind(SplitUtils);
// @ts-ignore - Legacy v5 code not updated for strict TypeScript
const isSectionOpen = SplitUtils.isSectionOpen.bind(SplitUtils);
// @ts-ignore - Legacy v5 code not updated for strict TypeScript
const setPaneSize = SplitUtils.setPaneSize.bind(SplitUtils);
// @ts-ignore - Legacy v5 code not updated for strict TypeScript
const fixClass = SplitUtils.fixClass();
// @ts-ignore - Legacy v5 code not updated for strict TypeScript
const saveHorizontalPanelSizes = SplitUtils.saveHorizontalSizesToLocalStorage.bind(SplitUtils);
// @ts-ignore - Legacy v5 code not updated for strict TypeScript
const saveVerticalPanelSizes = SplitUtils.saveVerticalSizesToLocalStorage.bind(SplitUtils);

/**
 * @deprecated Use the new Split component from './components/Split' instead
 */
export const SplitV5 = Split;

/**
 * @deprecated No longer needed in v6 - props are reactive by default
 */
export { SplitStateProvider };

/**
 * @deprecated Use imperative ref API instead
 */
export {
  openSplitter,
  closeSplitter,
  getSplitPaneInstance,
  isSectionOpen,
  fixClass,
  setPaneSize,
  SplitSessionStorage,
  saveHorizontalPanelSizes,
  saveVerticalPanelSizes,
};

// Default export for backward compatibility
/**
 * @deprecated Import { Split } from '@a-multilayout-splitter/core' instead
 */
export default Split;
