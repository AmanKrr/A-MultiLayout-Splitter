import React, { TouchEvent } from "react";
import "./style/index.css";
export interface SplitProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onDragEnd"> {
    style?: React.CSSProperties;
    className?: string;
    prefixCls?: string;
    childPrefixCls?: string;
    onDragging?: (preSize: number, nextSize: number, paneNumber: number) => void;
    onDragEnd?: (preSize: number, nextSize: number, paneNumber: number) => void;
    renderBar?: (props: React.HTMLAttributes<HTMLDivElement>, position: number) => JSX.Element;
    lineBar?: boolean | number[];
    visible?: boolean | number[];
    visiable?: boolean | number[];
    disable?: boolean | number[];
    mode?: "horizontal" | "vertical";
    initialSizes?: string[];
    minSizes?: number[];
    maxSizes?: number[];
    enableSessionStorage?: boolean;
    collapsed?: boolean[];
    height?: string;
    width?: string;
}
export interface SplitState {
    dragging: boolean;
}
export default class Split extends React.Component<SplitProps, SplitState> {
    private TOP;
    private BOTTOM;
    private LEFT;
    private RIGHT;
    private HORIZONTAL;
    private VERTICAL;
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
    private nextToNext;
    private prevToPrev;
    private breaker;
    private handleBarLayoutInfo;
    private onDraggingThrottled;
    private onDragEndThrottled;
    private saveHorizontalSizesToLocalStorageDebounced;
    private saveVerticalSizesToLocalStorageDebounced;
    constructor(props: SplitProps);
    componentWillUnmount(): void;
    componentDidMount(): void;
    private checkTouchDevice;
    private addTouchEvent;
    private removeTouchEvent;
    private removeEvent;
    setInitialSizes(): void;
    private setResizingLayout;
    onMouseDown(paneNumber: number, env: React.MouseEvent<HTMLDivElement, MouseEvent> | React.TouchEvent<HTMLDivElement>): void;
    onDragging(env: Event | TouchEvent): void;
    onDragEnd(): void;
    render(): JSX.Element;
}
