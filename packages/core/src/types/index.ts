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
  /** Unique identifier for this split instance */
  id: string;

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

  /** Enable/disable resize for specific handlebars */
  disable?: boolean | number[];

  /** Show/hide specific handlebars */
  visible?: boolean | number[];

  /** Line bar style for handlebars */
  lineBar?: boolean | number[];

  /** Custom handlebar renderer */
  renderBar?: (props: any, position: number) => JSX.Element;

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
 * Imperative API exposed via ref
 */
export interface SplitRef {
  addPane: (config: AddPaneConfig) => void;
  removePane: (index: number) => void;
  togglePane: (index: number) => void;
  setPaneSize: (index: number, size: string, options?: AnimationOptions) => void;
  getPaneState: () => Pane[];
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
 * Plugin system types (for Phase 3)
 */
export interface SplitPlugin {
  name: string;
  version?: string;
  onInit?: (context: PluginContext) => void;
  onDestroy?: (context: PluginContext) => void;
  onDragStart?: (event: DragStartEvent, context: PluginContext) => void;
  onDragMove?: (event: DragMoveEvent, context: PluginContext) => boolean | void;
  onDragEnd?: (event: DragEndEvent, context: PluginContext) => void;
}

export interface PluginContext {
  splitId: string;
  getState: () => any;
  dispatch: (action: any) => void;
  getElement: () => HTMLElement | null;
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
  renderCustom?: (props: { index: number; disabled: boolean }, position: number) => JSX.Element;
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
}
