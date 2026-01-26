import { ReactNode, CSSProperties } from "react";

export type SplitMode = "horizontal" | "vertical";
export type Direction = "left" | "right" | "top" | "bottom";
export type PaneStatus = "open" | "close" | "added" | "removed" | "unknown";

export interface Pane {
  id: string;
  size: string;
  collapsed: boolean;
  minSize: number;
  maxSize: number;
  content: ReactNode;
  flexGrow?: number;
}

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

export interface SplitProps {
  /** Unique identifier (auto-generated if omitted) */
  id?: string;
  mode?: SplitMode;
  initialSizes?: string[];
  /** Minimum sizes as percentages (0-100) */
  minSizes?: number[];
  /** Maximum sizes as percentages (0-100) */
  maxSizes?: number[];
  collapsed?: boolean[];
  /** Enable/disable resize for specific bars (bool, bool array, or index array) */
  disable?: boolean | boolean[] | number[];
  /** Visibility for specific bars (bool, bool array, or index array) */
  visible?: boolean | boolean[] | number[];
  /** Line styling for bars (bool, bool array, or index array) */
  lineBar?: boolean | boolean[] | number[];
  /** Custom bar renderer */
  renderBar?: (props: HandleRenderProps, position: number) => JSX.Element;
  plugins?: SplitPlugin[];
  enableSessionStorage?: boolean;
  width?: string | null;
  height?: string | null;
  className?: string;
  style?: CSSProperties;
  /** Fix for deeply nested layouts */
  fixClass?: boolean;
  children?: ReactNode;
  onDragging?: (preSize: number, nextSize: number, paneIndex: number) => void;
  onDragEnd?: (preSize: number, nextSize: number, paneIndex: number) => void;
  onLayoutChange?: (
    paneIndex: number,
    paneId: string,
    status: string | PaneStatus,
    direction: Direction | null,
  ) => void;
}

/**
 * Public API exposed via ref
 */
export interface SplitRef {
  addPane: (config: AddPaneConfig) => void;
  removePane: (index: number) => void;
  togglePane: (index: number) => void;
  setPaneSize: (index: number, size: string, options?: AnimationOptions) => void;
  getPaneState: () => Pane[];
  removePanes: (indices: number[]) => void;
  swapPanes: (indexA: number, indexB: number) => void;
  getSnapshot: () => SplitSnapshot;
  restore: (snapshot: SplitSnapshot) => void;
  collapsePane: (index: number) => void;
  expandPane: (index: number) => void;
  resizePane: (index: number, delta: number) => void;
}

export interface AddPaneConfig {
  position?: number;
  size: string;
  minSize?: number;
  maxSize?: number;
  collapsed?: boolean;
  content: ReactNode;
}

export interface AnimationOptions {
  animate?: boolean;
  duration?: number;
}

export interface SplitSnapshot {
  panes: Pane[];
  totalSize: number;
  mode: SplitMode;
  timestamp: number;
}

export interface SplitControllerState {
  panes: Pane[];
  mode: SplitMode;
  isDragging: boolean;
}

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

export interface UseSplitControllerOptions {
  mode?: SplitMode;
  initialPanes?: Pane[];
  initialSizes?: string[];
  minSizes?: number[];
  maxSizes?: number[];
  onPaneChange?: (panes: Pane[]) => void;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface HandleRenderProps {
  index: number;
  mode: SplitMode;
  disabled: boolean;
  lineBar: boolean;
  onMouseDown: (e: React.MouseEvent | React.TouchEvent) => void;
  onCollapse?: (direction: "left" | "right") => void;
  onExpand?: (direction: "left" | "right") => void;
}

export interface SplitState {
  panes: Pane[];
  mode: SplitMode;
  dragState: DragState | null;
}

export type SplitAction =
  | { type: "ADD_PANE"; payload: AddPaneConfig }
  | { type: "REMOVE_PANE"; payload: number }
  | { type: "TOGGLE_PANE"; payload: number }
  | { type: "SET_PANE_SIZE"; payload: { index: number; size: string } }
  | { type: "RESTORE_STATE"; payload: SplitState }
  | { type: "ADJUST_PANE_SIZE"; payload: { direction: string; amount: number } };

export interface PluginContext {
  splitId: string;
  getState: () => SplitState;
  dispatch: (action: SplitAction) => void;
  getElement: () => HTMLElement | null;
  getPanes: () => Pane[];
}

export interface PaneAddEvent {
  pane: Pane;
  index: number;
}

export interface PaneRemoveEvent {
  pane: Pane;
  index: number;
}

export interface ResizeEvent {
  dimensions: Dimensions;
  mode: SplitMode;
}

export interface SplitPlugin {
  name: string;
  version?: string;
  onInit?: (context: PluginContext) => void;
  onPaneAdd?: (event: PaneAddEvent, context: PluginContext) => void;
  onPaneRemove?: (event: PaneRemoveEvent, context: PluginContext) => void;
  onDragStart?: (event: DragStartEvent, context: PluginContext) => void;
  onDragMove?: (event: DragMoveEvent, context: PluginContext) => boolean | void;
  onDragEnd?: (event: DragEndEvent, context: PluginContext) => void;
  onResize?: (event: ResizeEvent, context: PluginContext) => void;
  renderHandle?: (props: HandleRenderProps, context: PluginContext) => ReactNode;
  renderPane?: (pane: Pane, context: PluginContext) => ReactNode;
  onDestroy?: (context: PluginContext) => void;
}

export interface PluginConfig {
  enabled?: boolean;
  options?: Record<string, any>;
}

export interface DragHandleProps {
  index: number;
  mode: SplitMode;
  disabled: boolean;
  lineBar: boolean;
  onMouseDown: (e: React.MouseEvent | React.TouchEvent) => void;
  onTouchStart?: (e: React.TouchEvent) => void;
  onCollapse?: (direction: "left" | "right") => void;
  onExpand?: (direction: "left" | "right") => void;
  renderCustom?: (props: HandleRenderProps, position: number) => JSX.Element;
}

export interface PaneProps {
  id: string;
  size: string;
  collapsed: boolean;
  minSize: number;
  maxSize: number;
  mode: SplitMode;
  content: ReactNode;
  flexGrow?: number;
}
