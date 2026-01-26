import { ReactNode, CSSProperties } from 'react';

/**
 * SplitMode
 * 
 * Defines the layout orientation of the split container.
 */
export type SplitMode = 'horizontal' | 'vertical';

/**
 * Direction
 * 
 * Used for programmatic collapse/expand operations to specify the target direction.
 */
export type Direction = 'left' | 'right' | 'top' | 'bottom';

/**
 * PaneStatus
 * 
 * Descriptive status used in lifecycle callbacks.
 */
export type PaneStatus = 'open' | 'close' | 'added' | 'removed' | 'unknown' | 'dragging' | 'dragged';

/**
 * Pane
 * 
 * Represents the configuration and state of an individual pane.
 */
export interface Pane {
  /** Unique identifier for the pane instance */
  id: string;
  /** Size string compatible with CSS flex-basis (e.g. "50%", "200px") */
  size: string;
  /** Whether the pane is currently hidden/collapsed */
  collapsed: boolean;
  /** Minimum percentage width/height allowed during resizing */
  minSize: number;
  /** Maximum percentage width/height allowed during resizing */
  maxSize: number;
  /** Content to be rendered within the pane */
  content: ReactNode;
  /** @internal Internal flex-grow override for collapse math */
  flexGrow?: number;
}

/**
 * DragState
 * 
 * Captures the transient state during an active user resize operation.
 */
export interface DragState {
  /** Indicates if dragging is currently ongoing */
  active: boolean;
  /** Index of the pane preceding the handlebar being dragged */
  paneIndex: number;
  /** Starting X coordinate of the pointer */
  startX: number;
  /** Starting Y coordinate of the pointer */
  startY: number;
  /** DOM element of the pane before the handle */
  prevElement: HTMLElement;
  /** DOM element of the pane after the handle */
  nextElement: HTMLElement;
  /** Initial width (px) of the previous pane */
  prevInitialWidth: number;
  /** Initial width (px) of the next pane */
  nextInitialWidth: number;
  /** Initial height (px) of the previous pane */
  prevInitialHeight: number;
  /** Initial height (px) of the next pane */
  nextInitialHeight: number;
  /** Current width of the parent container */
  containerWidth: number;
  /** Current height of the parent container */
  containerHeight: number;
  /** Minimum size constraint for the previous pane */
  minPrevSize: number;
  /** Maximum size constraint for the previous pane */
  maxPrevSize: number;
  /** Minimum size constraint for the next pane */
  minNextSize: number;
  /** Maximum size constraint for the next pane */
  maxNextSize: number;
}

/**
 * DragCallbacks
 */
export interface DragCallbacks {
  /** Triggered when the user begins dragging a handlebar */
  onDragStart?: (event: DragStartEvent) => void;
  /** Triggered continuously while the pointer is moving */
  onDragMove?: (event: DragMoveEvent) => void;
  /** Triggered when the user releases the handlebar */
  onDragEnd?: (event: DragEndEvent) => void;
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
 * SplitProps
 */
export interface SplitProps {
  /** Unique ID for the split instance */
  id?: string;
  /** Layout orientation */
  mode?: SplitMode;
  /** Starting sizes for all panes (e.g. ["30%", "70%"]) */
  initialSizes?: string[];
  /** Minimum percentage bounds for each pane */
  minSizes?: number[];
  /** Maximum percentage bounds for each pane */
  maxSizes?: number[];
  /** Initial visibility states for each pane */
  collapsed?: boolean[];
  /** Disable resizing for specific handlebars (index or boolean) */
  disable?: boolean | boolean[] | number[];
  /** Manual visibility control for specific handlebars */
  visible?: boolean | boolean[] | number[];
  /** Enables simplified line-only styling for specific handlebars */
  lineBar?: boolean | boolean[] | number[];
  /** Custom renderer for the handlebar element */
  renderBar?: (props: HandleRenderProps, position: number) => JSX.Element;
  /** List of plugins to enhance split functionality */
  plugins?: SplitPlugin[];
  /** Enables automatic localStorage persistence */
  enableSessionStorage?: boolean;
  /** Forced width for the container */
  width?: string | null;
  /** Forced height for the container */
  height?: string | null;
  /** Custom CSS class for the split container */
  className?: string;
  /** Inline styles for the split container */
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
    reason: string | PaneStatus,
    direction: Direction | null
  ) => void;
}

/**
 * SplitRef
 * 
 * Imperative API exposed via React.forwardRef.
 */
export interface SplitRef {
  /** Adds a new pane at runtime */
  addPane: (config: AddPaneConfig) => void;
  /** Removes a pane at runtime */
  removePane: (index: number) => void;
  /** Toggles the collapse state of a pane */
  togglePane: (index: number) => void;
  /** Explicitly sets the size of a pane */
  setPaneSize: (index: number, size: string, options?: AnimationOptions) => void;
  /** Gets the current configuration of all panes */
  getPaneState: () => Pane[];
  /** Removes multiple panes by index */
  removePanes: (indices: number[]) => void;
  /** Swaps the position of two panes */
  swapPanes: (indexA: number, indexB: number) => void;
  /** Captures a serializable snapshot of the current state */
  getSnapshot: () => SplitSnapshot;
  /** Restores state from a previously captured snapshot */
  restore: (snapshot: SplitSnapshot) => void;
  /** Programmatically collapses a pane */
  collapsePane: (index: number) => void;
  /** Programmatically expands a pane */
  expandPane: (index: number) => void;
  /** Resizes a pane by a relative delta */
  resizePane: (index: number, delta: number) => void;
}

/**
 * AddPaneConfig
 */
export interface AddPaneConfig {
  /** Target position for the new pane */
  position?: number;
  /** Initial size string */
  size: string;
  /** Minimum percentage bound */
  minSize?: number;
  /** Maximum percentage bound */
  maxSize?: number;
  /** Initial visibility state */
  collapsed?: boolean;
  /** Pane content */
  content: ReactNode;
}

/**
 * AnimationOptions
 */
export interface AnimationOptions {
  /** Whether to animate the size transition */
  animate?: boolean;
  /** Duration of the transition in ms */
  duration?: number;
}

/**
 * SplitSnapshot
 */
export interface SplitSnapshot {
  /** Snapshot of all pane configurations */
  panes: Pane[];
  /** Actual pixel size of the container at snapshot time */
  totalSize: number;
  /** Orientation mode */
  mode: SplitMode;
  /** Epoch timestamp of snapshot creation */
  timestamp: number;
}

/**
 * SplitControllerState
 */
export interface SplitControllerState {
  /** Managed pane array */
  panes: Pane[];
  /** Active orientation */
  mode: SplitMode;
  /** Global dragging state */
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
  setPanes: (panes: Pane[]) => void;
  getSnapshot: () => SplitSnapshot;
  restore: (snapshot: SplitSnapshot) => void;
}

/**
 * UseSplitControllerOptions
 */
export interface UseSplitControllerOptions {
  /** Orientation mode */
  mode?: SplitMode;
  /** Pre-defined pane configuration */
  initialPanes?: Pane[];
  /** Starting size for generating default panes */
  initialSizes?: string[];
  /** Default floor percentage bounds */
  minSizes?: number[];
  /** Default ceiling percentage bounds */
  maxSizes?: number[];
  /** Triggered whenever the managed panes change */
  onPaneChange?: (panes: Pane[]) => void;
}

/**
 * Dimensions
 */
export interface Dimensions {
  width: number;
  height: number;
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
 * SplitState
 */
export interface SplitState {
  /** Current reactive pane configuration */
  panes: Pane[];
  /** Orientation mode */
  mode: SplitMode;
  /** Pointer to current drag operation details */
  dragState: DragState | null;
}

/**
 * SplitAction
 * 
 * Union of actions that can be dispatched to maintain internal state.
 */
export type SplitAction =
  | { type: 'ADD_PANE'; payload: AddPaneConfig }
  | { type: 'REMOVE_PANE'; payload: number }
  | { type: 'TOGGLE_PANE'; payload: number }
  | { type: 'SET_PANE_SIZE'; payload: { index: number; size: string } }
  | { type: 'RESTORE_STATE'; payload: SplitState }
  | { type: 'ADJUST_PANE_SIZE'; payload: { direction: string; amount: number } };

/**
 * PluginContext
 * 
 * Stable object provided to plugins to interact with the Split component.
 */
export interface PluginContext {
  /** Unique ID of the Split instance */
  splitId: string;
  /** Accesses current state without triggering renders */
  getState: () => SplitState;
  /** Safely triggers state changes */
  dispatch: (action: SplitAction) => void;
  /** Accesses the container HTMLElement directly */
  getElement: () => HTMLElement | null;
  /** Convenience accessor for panes */
  getPanes: () => Pane[];
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
 * ResizeEvent
 */
export interface ResizeEvent {
  dimensions: Dimensions;
  mode: SplitMode;
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
 * PluginConfig
 */
export interface PluginConfig {
  /** Whether the plugin should be active */
  enabled?: boolean;
  /** Configuration variables for the specific plugin */
  options?: Record<string, any>;
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
  renderCustom?: (props: HandleRenderProps, position: number) => JSX.Element;
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
