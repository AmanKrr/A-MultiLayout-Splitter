import React from "react";
import "../style/index.css";
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
    /**
     * Callback function for layout change. Triggered only on closing and opening of pane.
     */
    onLayoutChange?: (size: number, sectionNumber: number, paneId: string, reason: string | "default") => void | null;
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
declare const _default: React.ForwardRefExoticComponent<React.RefAttributes<unknown>>;
export default _default;
