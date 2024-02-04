import React from "react";
import "./style/index.css";
export interface SplitProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onDragEnd"> {
    style?: React.CSSProperties;
    className?: string;
    prefixCls?: string;
    /**
     * Drag width/height change callback function,
     * the width or height is determined according to the mode parameter
     */
    onDragging?: (preSize: number, nextSize: number, paneNumber: number) => void;
    /** Callback function for dragging end */
    onDragEnd?: (preSize: number, nextSize: number, paneNumber: number) => void;
    /** Support custom drag and drop toolbar */
    renderBar?: (props: React.HTMLAttributes<HTMLDivElement>, position: number) => JSX.Element;
    /** Set the drag and drop toolbar as a line style. */
    lineBar?: boolean;
    /** Set the dragged toolbar, whether it is visible or not */
    visible?: boolean | number[];
    /**
     * @deprecated Use `visible` instead
     */
    visiable?: boolean | number[];
    /**
     * Set the drag and drop toolbar, disable
     */
    disable?: boolean | number[];
    /**
     * type, optional `horizontal` or `vertical`
     */
    mode?: "horizontal" | "vertical";
    /**
     * initial sizes for each pane
     */
    initialSizes?: number[];
    /**
     * minimum sizes for each pane
     */
    minSizes?: number[];
    /**
     * session storage for storing splitter size
     */
    enableSessionStorage?: boolean;
    collapsed?: boolean[];
}
/**
 * State for the Split component.
 */
export interface SplitState {
    dragging: boolean;
}
/**
 * Split component for creating resizable split panes.
 */
export default class Split extends React.Component<SplitProps, SplitState> {
    static defaultProps: SplitProps;
    state: SplitState;
    warpper: HTMLDivElement | null;
    paneNumber: number;
    startX: number;
    startY: number;
    move: boolean;
    target: HTMLDivElement;
    boxWidth: number;
    boxHeight: number;
    preWidth: number;
    nextWidth: number;
    preHeight: number;
    nextHeight: number;
    preSize: number;
    nextSize: number;
    private userSession;
    private initDragging;
    private onDraggingThrottled;
    private onDragEndThrottled;
    private saveSizesToLocalStorageDebounced;
    constructor(props: SplitProps);
    /**
     * Cleanup: Remove event listeners to prevent memory leaks.
     */
    componentWillUnmount(): void;
    /**
     * Initialization: Set up initial sizes and wrapper based on the provided mode.
     */
    componentDidMount(): void;
    private checkTouchDevice;
    /**
     * add touch event listeners.
     */
    private addTouchEvent;
    /**
     * Remove mouse move and mouse up event listeners.
     */
    private removeTouchEvent;
    /**
     * Remove mouse move and mouse up event listeners.
     */
    private removeEvent;
    /**
     * Set initial sizes for the panes.
     */
    setInitialSizes(): void;
    /**
     * Handle mouse down event to start dragging.
     * @param paneNumber - The number of the pane being dragged.
     * @param env - MouseEvent.
     */
    onMouseDown(paneNumber: number, env: React.MouseEvent<HTMLDivElement, MouseEvent> | React.TouchEvent<HTMLDivElement>): void;
    /**
     * Handle mouse dragging to resize panes.
     * @param env - MouseEvent.
     */
    onDragging(env: Event): void;
    /**
     * Handle mouse up event to end dragging.
     */
    onDragEnd(): void;
    render(): JSX.Element;
}
