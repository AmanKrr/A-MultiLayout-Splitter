import React, { TouchEvent } from "react";
import "./style/index.css";
export interface SplitProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onDragEnd"> {
    style?: React.CSSProperties;
    className?: string;
    /**
     * Helps in identifying unique Splitter instance
     */
    id: string;
    /**
     * Fix layout issues for deep nested layout
     */
    prefixCls?: string;
    childPrefixCls?: string;
    fixClass?: boolean;
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
    lineBar?: boolean | number[];
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
    initialSizes?: string[];
    /**
     * minimum sizes for each pane, range 0 to 100
     */
    minSizes?: number[];
    /**
     * maximum sizes for each pane, range 0 to 100
     */
    maxSizes?: number[];
    /**
     * session storage for storing splitter size
     */
    enableSessionStorage?: boolean;
    /**
     * collasped sections, "true" or "false"
     */
    collapsed?: boolean[];
    /**
     * Height for splitter parent
     */
    height?: null | string;
    /**
     * Width for splitter parent
     */
    width?: null | string;
}
interface DefaultProps {
    prefixCls: string;
    childPrefixCls: string;
    visiable: boolean;
    mode: string;
    initialSizes: string[] | [];
    minSizes: number[] | [];
    maxSizes: number[] | [];
    enableSessionStorage: boolean;
    collapsed: boolean[] | [];
    height: string | null;
    width: string | null;
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
    private TOP;
    private BOTTOM;
    private LEFT;
    private RIGHT;
    private HORIZONTAL;
    private VERTICAL;
    static defaultProps: DefaultProps;
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
    private nextToNext;
    private prevToPrev;
    private breaker;
    private handleBarLayoutInfo;
    private onDraggingThrottled;
    private onDragEndThrottled;
    private saveHorizontalSizesToLocalStorageDebounced;
    private saveVerticalSizesToLocalStorageDebounced;
    constructor(props: SplitProps);
    /**
     * Cleanup: Remove event listeners to prevent memory leaks.
     */
    componentWillUnmount(): void;
    /**
     * Initialization: Set up initial sizes and wrapper based on the provided mode.
     */
    componentDidMount(): void;
    /**
     * Checks if the current device supports touch input.
     * @returns {boolean} Returns true if the device supports touch input, otherwise false.
     */
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
    private setInitialSizes;
    /**
     * This function adjusts the layout of two adjacent elements while resizing,
     * ensuring that the flex basis of the elements is updated correctly based on the resizing mode.
     * @param nextTarget - The next target HTMLElement.
     * @param prevTarget - The previous target HTMLElement.
     * @param mode - The layout mode, either "horizontal" or "vertical".
     */
    private setResizingLayout;
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
    onDragging(env: Event | TouchEvent): void;
    /**
     * Handle mouse up event to end dragging.
     */
    onDragEnd(): void;
    render(): JSX.Element;
}
export {};
