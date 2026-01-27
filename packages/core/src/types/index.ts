import React, { CSSProperties, ReactNode } from 'react';

/**
 * SplitMode
 * Choice of layout orientation.
 */
export type SplitMode = 'horizontal' | 'vertical';

/**
 * Dimensions
 */
export interface Dimensions {
  width: number;
  height: number;
}

/**
 * ResizeEvent
 */
export interface ResizeEvent {
  dimensions: Dimensions;
  mode: SplitMode;
}

/**
 * PluginConfig
 */
export interface PluginConfig {
  /** Whether the plugin should be active */
  enabled?: boolean;
  /** Configuration variables for the specific plugin */
  options?: Record<string, any>;
}

/**
 * DragStartEvent
 */
export interface DragStartEvent {
  /** Index of the pane being resized */
  paneIndex: number;
}

/**
 * DragMoveEvent
 */
export interface DragMoveEvent {
  /** Index of the pane being resized */
  paneIndex: number;
  /** Calculated percentage size for the previous pane */
  prevSize: number;
  /** Calculated percentage size for the next pane */
  nextSize: number;
}

/**
 * DragEndEvent
 */
export interface DragEndEvent {
  /** Index of the pane that was resized */
  paneIndex: number;
  /** Final percentage size for the previous pane */
  prevSize: number;
  /** Final percentage size for the next pane */
  nextSize: number;
}

/**
 * PaneStatus
 * Categorizes the nature of a layout change event.
 */
export type PaneStatus = 'open' | 'close' | 'dragging' | 'dragged' | 'added' | 'removed';

/**
 * Direction
 * Used for directional collapse/expand operations.
 */
export type Direction = 'left' | 'right' | 'top' | 'bottom';

/**
 * Pane
 * Internal state representation of a single split section.
 */
export interface Pane {
  id: string;
  size: string;
  content: ReactNode;
  collapsed: boolean;
  minSize: number;
  maxSize: number;
  /** Internal flex distribution override */
  flexGrow?: number;
}

/**
 * PaneAddEvent
 */
export interface PaneAddEvent {
  pane: Pane;
  index: number;
}

/**
 * PaneRemoveEvent
 */
export interface PaneRemoveEvent {
  pane: Pane;
  index: number;
}

/**
 * PaneCollapseEvent
 */
export interface PaneCollapseEvent {
  pane: Pane;
  index: number;
  direction?: 'left' | 'right';
}

/**
 * PaneExpandEvent
 */
export interface PaneExpandEvent {
  pane: Pane;
  index: number;
  direction?: 'left' | 'right';
}

/**
 * AddPaneConfig
 * Parameters for dynamically injecting a new pane.
 */
export interface AddPaneConfig {
  size: string;
  content: ReactNode;
  position?: number;
  collapsed?: boolean;
  minSize?: number;
  maxSize?: number;
}

/**
 * AnimationOptions
 * Configuration for CSS-based layout transitions.
 */
export interface AnimationOptions {
  animate?: boolean;
  duration?: number;
}

/**
 * DragState
 * Cached dimensions used to anchor direct DOM updates during interaction.
 */
export interface DragState {
  active: boolean;
  paneIndex: number;
  startX: number;
  startY: number;
  prevElement: HTMLElement | null;
  nextElement: HTMLElement | null;
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
 * DragCallbacks
 * Event emitters for the low-level drag sequence.
 */
export interface DragCallbacks {
  onDragStart?: (event: { paneIndex: number }) => void;
  onDragMove?: (event: { paneIndex: number; prevSize: number; nextSize: number }) => void;
  onDragEnd?: (event: { paneIndex: number; prevSize: number; nextSize: number }) => void;
}

/**
 * HandleRenderProps
 */
export interface HandleRenderProps {
  /** Unique handlebar index */
  index: number;
  /** Parent orientation */
  mode: SplitMode;
  /** Whether interaction is currently disabled */
  disabled: boolean;
  /** Whether line styling should be applied */
  lineBar: boolean;
  /** Event handler to trigger dragging */
  onMouseDown: (e: React.MouseEvent | React.TouchEvent) => void;
  /** Event handler for programmatic collapse */
  onCollapse?: (direction: 'left' | 'right') => void;
  /** Event handler for programmatic expansion */
  onExpand?: (direction: 'left' | 'right') => void;
}

/**
 * DragHandleProps
 */
export interface DragHandleProps {
  /** Index of the handlebar */
  index: number;
  /** Current mode of splitting */
  mode: SplitMode;
  /** Whether interaction with the handle is disabled */
  disabled: boolean;
  /** Whether to use a minimal line style */
  lineBar: boolean;
  /** Internal tracking for user-level disabling */
  explicitlyDisabled?: boolean;
  /** Mouse/Touch trigger to begin resizing */
  onMouseDown: (e: React.MouseEvent | React.TouchEvent) => void;
  /** Touch trigger for mobile resizing */
  onTouchStart?: (e: React.TouchEvent) => void;
  /** Event to collapse the adjacent pane */
  onCollapse?: (direction: 'left' | 'right') => void;
  /** Event to expand the adjacent pane */
  onExpand?: (direction: 'left' | 'right') => void;
  /** Reference for external custom render functions */
  renderCustom?: (props: HandleRenderProps, position: number) => ReactNode;
  /** State of the pane on the left (or top) of the handlebar */
  leftPaneCollapsed?: boolean;
  /** State of the pane on the right (or bottom) of the handlebar */
  rightPaneCollapsed?: boolean;
}

/**
 * PaneProps
 */
export interface PaneProps {
  /** Unique pane ID */
  id: string;
  /** Current size string */
  size: string;
  /** Current collapse status */
  collapsed: boolean;
  /** Lower bound percentage */
  minSize: number;
  /** Upper bound percentage */
  maxSize: number;
  /** Split layout direction */
  mode: SplitMode;
  /** React children for the pane */
  content: ReactNode;
  /** Internal flex-grow value */
  flexGrow?: number;
}

/**
 * PluginContext
 * The API surface exposed to plugins to interact with the Split component.
 */
export interface PluginContext {
  splitId: string;
  getState: () => SplitState;
  dispatch: (action: SplitAction) => void;
  getElement: () => HTMLElement | null;
  getPanes: () => Pane[];
}

/**
 * SplitPlugin
 * 
 * Defines the structure for custom plugins to tap into Split life-cycles.
 */
export interface SplitPlugin {
  /** Unique name for identifying the plugin */
  name: string;
  /** Semantic versioning support */
  version?: string;

  /** Called when the plugin is registered */
  onInit?: (context: PluginContext) => void;
  /** Called when a new pane is added to the layout */
  onPaneAdd?: (event: PaneAddEvent, context: PluginContext) => void;
  /** Called when a pane is removed from the layout */
  onPaneRemove?: (event: PaneRemoveEvent, context: PluginContext) => void;
  /** Called when a pane is collapsed */
  onPaneCollapse?: (event: PaneCollapseEvent, context: PluginContext) => void;
  /** Called when a pane is expanded */
  onPaneExpand?: (event: PaneExpandEvent, context: PluginContext) => void;
  /** Called when a resize operation begins */
  onDragStart?: (event: DragStartEvent, context: PluginContext) => void;
  /** Called during pointer move. Return false to prevent movement. */
  onDragMove?: (event: DragMoveEvent, context: PluginContext) => boolean | void;
  /** Called when dragging finishes */
  onDragEnd?: (event: DragEndEvent, context: PluginContext) => void;
  /** Called when the container HTMLElement changes dimensions */
  onResize?: (event: ResizeEvent, context: PluginContext) => void;

  /** Implement this to provide a custom handlebar React component */
  renderHandle?: (props: HandleRenderProps, context: PluginContext) => ReactNode;
  /** Implement this to wrap the default pane content */
  renderPane?: (pane: Pane, context: PluginContext) => ReactNode;
  /** Called when the split component unmounts */
  onDestroy?: (context: PluginContext) => void;
}

/**
 * SplitState
 * Reactive state snapshot.
 */
export interface SplitState {
  panes: Pane[];
  mode: SplitMode;
  dragState: any;
}

/**
 * SplitAction
 * Internal command pattern for state modifications.
 */
export type SplitAction =
  | { type: 'ADD_PANE'; payload: AddPaneConfig }
  | { type: 'REMOVE_PANE'; payload: number }
  | { type: 'TOGGLE_PANE'; payload: number }
  | { type: 'SET_PANE_SIZE'; payload: { index: number; size: string } }
  | { type: 'RESTORE_STATE'; payload: { panes: { size: string; collapsed: boolean; id: string }[] } }
  | { type: 'ADJUST_PANE_SIZE'; payload: { direction: 'grow' | 'shrink'; amount: number } };

/**
 * SplitSnapshot
 * Serializable representation of the layout for persistence.
 */
export interface SplitSnapshot {
  panes: { size: string; collapsed: boolean; id: string }[];
  totalSize: number;
  mode: SplitMode;
  timestamp: number;
}

/**
 * SplitRef
 * Imperative API exposed via forwardRef.
 */
export interface SplitRef {
  addPane: (config: AddPaneConfig) => void;
  removePane: (index: number) => void;
  togglePane: (index: number) => void;
  setPaneSize: (index: number, size: string, options?: AnimationOptions) => void;
  getPaneState: () => Pane[];
  removePanes: (indices: number[]) => void;
  swapPanes: (indexA: number, indexB: number) => void;
  collapsePane: (index: number, options?: AnimationOptions & { direction?: 'left' | 'right' }) => void;
  expandPane: (index: number, options?: AnimationOptions & { direction?: 'left' | 'right' }) => void;
  resizePane: (index: number, delta: number) => void;
  getSnapshot: () => SplitSnapshot;
  restore: (snapshot: SplitSnapshot) => void;
}

/**
 * SplitProps
 * Reactive configuration surface.
 */
export interface SplitProps {
  /** Unique ID for persistence and DOM targeting */
  id?: string;
  /** Layout orientation */
  mode?: SplitMode;
  /** Percentages or pixel values for initial layout */
  initialSizes?: string[];
  /** Minimum percentage size for each pane */
  minSizes?: number[];
  /** Maximum percentage size for each pane */
  maxSizes?: number[];
  /** Initial visibility toggle for each pane */
  collapsed?: boolean[];
  /** Disable resizing for specific handles */
  disable?: boolean | boolean[] | number[];
  /** Hide specific resize handles */
  visible?: boolean | boolean[] | number[];
  /** Use the simplified thin-line style for handles */
  lineBar?: boolean | boolean[] | number[];
  /** Custom renderer for the resize handlebars */
  renderBar?: (props: any) => ReactNode;
  /** Active plugins for feature extension */
  plugins?: SplitPlugin[];
  /** Enable automatic localStorage persistence of pane sizes and collapsed state */
  enablePersistence?: boolean;
  /** Container CSS override */
  className?: string;
  /** Container inline styles */
  style?: CSSProperties;
  /** Forces layout fixes for deep nesting scenarios */
  fixClass?: boolean;
  /** Children elements to be split into panes */
  children?: ReactNode;
  /** Callback triggered during active resizing */
  onDragging?: (preSize: number, nextSize: number, paneNumber: number) => void;
  /** Callback triggered after resizing completes */
  onDragEnd?: (preSize: number, nextSize: number, paneNumber: number) => void;
  /** Generic callback for any layout state change */
  onLayoutChange?: (
    sectionNumber: number,
    paneId: string,
    status: PaneStatus,
    direction: Direction | null
  ) => void;
  /** Legacy dimension overrides */
  width?: number | string | null;
  height?: number | string | null;
}

/**
 * UseSplitControllerOptions
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
 * SplitControllerState
 */
export interface SplitControllerState {
  panes: Pane[];
  mode: SplitMode;
  isDragging: boolean;
}

/**
 * SplitControllerActions
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
  setPanes: (update: Pane[] | ((prev: Pane[]) => Pane[])) => void;
  getSnapshot: () => SplitSnapshot;
  restore: (snapshot: SplitSnapshot) => void;
}
