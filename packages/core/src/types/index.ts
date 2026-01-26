import { ReactNode, CSSProperties } from 'react';

/**
 * Split orientation mode
 */
export type SplitMode = 'horizontal' | 'vertical';

/**
 * Direction for pane operations
 */
export type Direction = 'left' | 'right' | 'top' | 'bottom';

/**
 * Pane status for callbacks
 */
export type PaneStatus = 'open' | 'close' | 'added' | 'removed' | 'unknown';

/**
 * Individual pane configuration
 */
export interface Pane {
  id: string;
  size: string;
  collapsed: boolean;
  minSize: number;
  maxSize: number;
  content: ReactNode;
  /** Override flex-grow value (used when adjacent pane is collapsed) */
  flexGrow?: number;
}

/**
 * Drag state for tracking drag operations
 */
export interface DragState {
  active: boolean;
  paneIndex: number;
  startX: number;
  startY: number;
  prevElement: HTMLElement;
  nextElement: HTMLElement;
  prevInitialWidth: number;
  nextInitialWidth: number;
  prevInitialHeight: number;
  nextInitialHeight: number;
  containerWidth: number;
  containerHeight: number;
  minPrevSize: number;
  maxPrevSize: number;
  minNextSize: number;
  maxNextSize: number;
}

/**
 * Drag event callbacks
 */
export interface DragCallbacks {
  onDragStart?: (event: DragStartEvent) => void;
  onDragMove?: (event: DragMoveEvent) => void;
  onDragEnd?: (event: DragEndEvent) => void;
}

export interface DragStartEvent {
  paneIndex: number;
}

export interface DragMoveEvent {
  paneIndex: number;
  prevSize: number;
  nextSize: number;
}

export interface DragEndEvent {
  paneIndex: number;
  prevSize: number;
  nextSize: number;
}

/**
 * Split component props (v6)
 */
export interface SplitProps {
  /** Unique identifier for this split instance (auto-generated if not provided) */
  id?: string;

  /** Split orientation */
  mode?: SplitMode;

  /** Initial sizes for each pane */
  initialSizes?: string[];

  /** Minimum sizes for each pane (percentage: 0-100) */
  minSizes?: number[];

  /** Maximum sizes for each pane (percentage: 0-100) */
  maxSizes?: number[];

  /** Collapsed state for each pane */
  collapsed?: boolean[];

  /** Enable/disable resize for specific handlebars (boolean, array of booleans, or array of indices) */
  disable?: boolean | boolean[] | number[];

  /** Show/hide specific handlebars (boolean, array of booleans, or array of indices) */
  visible?: boolean | boolean[] | number[];

  /** Line bar style for handlebars (boolean, array of booleans, or array of indices) */
  lineBar?: boolean | boolean[] | number[];

  /** Custom handlebar renderer with full props support (Phase 5) */
  renderBar?: (props: HandleRenderProps, position: number) => JSX.Element;

  /** Plugins to extend functionality */
  plugins?: SplitPlugin[];

  /** Enable localStorage persistence */
  enableSessionStorage?: boolean;

  /** Container width */
  width?: string | null;

  /** Container height */
  height?: string | null;

  /** Custom CSS class */
  className?: string;

  /** Custom inline styles */
  style?: CSSProperties;

  /** Fix class for nested layouts */
  fixClass?: boolean;

  /** Child elements */
  children?: ReactNode;

  /** Drag callbacks */
  onDragging?: (preSize: number, nextSize: number, paneNumber: number) => void;
  onDragEnd?: (preSize: number, nextSize: number, paneNumber: number) => void;

  /** Layout change callback */
  onLayoutChange?: (
    sectionNumber: number,
    paneId: string,
    reason: string | PaneStatus,
    direction: Direction | null
  ) => void;
}

/**
 * Imperative API exposed via ref (Phase 4 Enhanced)
 */
export interface SplitRef {
  // Basic operations
  addPane: (config: AddPaneConfig) => void;
  removePane: (index: number) => void;
  togglePane: (index: number) => void;
  setPaneSize: (index: number, size: string, options?: AnimationOptions) => void;
  getPaneState: () => Pane[];

  // Phase 4: Advanced operations
  removePanes: (indices: number[]) => void;
  swapPanes: (indexA: number, indexB: number) => void;
  getSnapshot: () => SplitSnapshot;
  restore: (snapshot: SplitSnapshot) => void;
  collapsePane: (index: number) => void;
  expandPane: (index: number) => void;
  resizePane: (index: number, delta: number) => void;
}

/**
 * Configuration for adding a new pane
 */
export interface AddPaneConfig {
  position?: number;
  size: string;
  minSize?: number;
  maxSize?: number;
  collapsed?: boolean;
  content: ReactNode;
}

/**
 * Animation options
 */
export interface AnimationOptions {
  animate?: boolean;
  duration?: number;
}

/**
 * Split snapshot for save/restore operations (Phase 4)
 */
export interface SplitSnapshot {
  panes: Pane[];
  totalSize: number;
  mode: SplitMode;
  timestamp: number;
}

/**
 * Controller state for useSplitController hook (Phase 4)
 */
export interface SplitControllerState {
  panes: Pane[];
  mode: SplitMode;
  isDragging: boolean;
}

/**
 * Controller actions for useSplitController hook (Phase 4)
 */
export interface SplitControllerActions {
  addPane: (config: AddPaneConfig) => void;
  removePane: (index: number) => void;
  removePanes: (indices: number[]) => void;
  togglePane: (index: number) => void;
  collapsePane: (index: number) => void;
  expandPane: (index: number) => void;
  setPaneSize: (index: number, size: string, options?: AnimationOptions) => void;
  swapPanes: (indexA: number, indexB: number) => void;
  setPanes: (panes: Pane[]) => void;
  getSnapshot: () => SplitSnapshot;
  restore: (snapshot: SplitSnapshot) => void;
}

/**
 * Options for useSplitController hook (Phase 4)
 */
export interface UseSplitControllerOptions {
  mode?: SplitMode;
  initialPanes?: Pane[];
  initialSizes?: string[];
  minSizes?: number[];
  maxSizes?: number[];
  onPaneChange?: (panes: Pane[]) => void;
}

/**
 * Plugin system types (Phase 3)
 */

/**
 * Dimensions for resize events
 */
export interface Dimensions {
  width: number;
  height: number;
}

/**
 * Handle render props passed to custom handle renderers
 */
export interface HandleRenderProps {
  index: number;
  mode: SplitMode;
  disabled: boolean;
  lineBar: boolean;
  onMouseDown: (e: React.MouseEvent | React.TouchEvent) => void;
  onCollapse?: (direction: 'left' | 'right') => void;
  onExpand?: (direction: 'left' | 'right') => void;
}

/**
 * Split state for plugins
 */
export interface SplitState {
  panes: Pane[];
  mode: SplitMode;
  dragState: DragState | null;
}

/**
 * Split actions for plugins
 */
export type SplitAction =
  | { type: 'ADD_PANE'; payload: AddPaneConfig }
  | { type: 'REMOVE_PANE'; payload: number }
  | { type: 'TOGGLE_PANE'; payload: number }
  | { type: 'SET_PANE_SIZE'; payload: { index: number; size: string } }
  | { type: 'RESTORE_STATE'; payload: SplitState }
  | { type: 'ADJUST_PANE_SIZE'; payload: { direction: string; amount: number } };

/**
 * Context provided to plugins for interacting with Split component
 */
export interface PluginContext {
  /** Unique identifier of the split instance */
  splitId: string;

  /** Get current split state */
  getState: () => SplitState;

  /** Dispatch actions to modify split state */
  dispatch: (action: SplitAction) => void;

  /** Get the DOM element of the split container */
  getElement: () => HTMLElement | null;

  /** Get all panes */
  getPanes: () => Pane[];
}

/**
 * Pane addition event
 */
export interface PaneAddEvent {
  pane: Pane;
  index: number;
}

/**
 * Pane removal event
 */
export interface PaneRemoveEvent {
  pane: Pane;
  index: number;
}

/**
 * Resize event
 */
export interface ResizeEvent {
  dimensions: Dimensions;
  mode: SplitMode;
}

/**
 * Main plugin interface
 */
export interface SplitPlugin {
  /** Unique plugin name */
  name: string;

  /** Plugin version (optional) */
  version?: string;

  // Lifecycle hooks
  /** Called when plugin is initialized */
  onInit?: (context: PluginContext) => void;

  /** Called when pane is added */
  onPaneAdd?: (event: PaneAddEvent, context: PluginContext) => void;

  /** Called when pane is removed */
  onPaneRemove?: (event: PaneRemoveEvent, context: PluginContext) => void;

  /** Called when drag starts */
  onDragStart?: (event: DragStartEvent, context: PluginContext) => void;

  /** Called during drag move - return false to prevent default behavior */
  onDragMove?: (event: DragMoveEvent, context: PluginContext) => boolean | void;

  /** Called when drag ends */
  onDragEnd?: (event: DragEndEvent, context: PluginContext) => void;

  /** Called when container resizes */
  onResize?: (event: ResizeEvent, context: PluginContext) => void;

  // Component enhancement hooks
  /** Custom handle renderer */
  renderHandle?: (props: HandleRenderProps, context: PluginContext) => ReactNode;

  /** Custom pane wrapper renderer */
  renderPane?: (pane: Pane, context: PluginContext) => ReactNode;

  /** Cleanup hook called when plugin is destroyed */
  onDestroy?: (context: PluginContext) => void;
}

/**
 * Plugin configuration options
 */
export interface PluginConfig {
  /** Enable/disable the plugin */
  enabled?: boolean;

  /** Plugin-specific options */
  options?: Record<string, any>;
}

/**
 * DragHandle component props
 */
export interface DragHandleProps {
  index: number;
  mode: SplitMode;
  disabled: boolean;
  lineBar: boolean;
  onMouseDown: (e: React.MouseEvent | React.TouchEvent) => void;
  onTouchStart?: (e: React.TouchEvent) => void;
  onCollapse?: (direction: 'left' | 'right') => void;
  onExpand?: (direction: 'left' | 'right') => void;
  renderCustom?: (props: HandleRenderProps, position: number) => JSX.Element;
}

/**
 * Pane component props
 */
export interface PaneProps {
  id: string;
  size: string;
  collapsed: boolean;
  minSize: number;
  maxSize: number;
  mode: SplitMode;
  content: ReactNode;
  /** Override flex-grow value (used when adjacent pane is collapsed) */
  flexGrow?: number;
}
