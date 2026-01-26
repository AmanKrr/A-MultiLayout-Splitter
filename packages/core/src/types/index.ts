import { CSSProperties, ReactNode } from 'react';

/**
 * SplitMode
 * Choice of layout orientation.
 */
export type SplitMode = 'horizontal' | 'vertical';

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
 * Lifecycle hooks that allow external logic to intercept and extend the component.
 */
export interface SplitPlugin {
  name: string;
  onInit?: (context: PluginContext) => void;
  onPaneAdd?: (pane: Pane, context: PluginContext) => void;
  onPaneRemove?: (pane: Pane, context: PluginContext) => void;
  onDragStart?: (event: { paneIndex: number }, context: PluginContext) => void;
  onDragMove?: (event: { paneIndex: number; prevSize: number; nextSize: number }, context: PluginContext) => boolean | void;
  onDragEnd?: (event: { paneIndex: number; prevSize: number; nextSize: number }, context: PluginContext) => void;
  onResize?: (context: PluginContext) => void;
  renderHandle?: (props: any, context: PluginContext) => ReactNode;
  renderPane?: (pane: Pane, content: ReactNode, context: PluginContext) => ReactNode;
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
  /** Enable automatic session-based persistence */
  enableSessionStorage?: boolean;
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
