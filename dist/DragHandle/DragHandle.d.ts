/// <reference types="react" />
import "../style/DragHandle.css";
declare function DragHandle({ mode, onMouseDown, onTouchStart, props, position, }: {
    mode: string;
    onMouseDown: any;
    onTouchStart: any;
    props: any;
    position: number;
}): JSX.Element;
export default DragHandle;
