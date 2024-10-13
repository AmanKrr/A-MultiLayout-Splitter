import { useEffect, useState } from "react";
import "../style/DragHandle.css";
import SplitUtils from "../utils/SplitUtils";

function DragHandle({
  mode,
  onMouseDown,
  onTouchStart,
  props,
  position,
}: {
  mode: string;
  onMouseDown: any;
  onTouchStart: any;
  props: any;
  position: number;
}) {
  function handleTopAndLeftArrowClick(event: any, mode: "horizontal" | "vertical", position: number, direction: "left" | "right" | "top" | "bottom") {
    const wrapper = event.target.parentElement.parentElement;
    if (SplitUtils.isSectionOpen(wrapper, position + 1, mode) && SplitUtils.isSectionOpen(wrapper, position, mode)) {
      SplitUtils.closeSplitter(wrapper, position, mode, "close", direction);
    } else if (!SplitUtils.isSectionOpen(wrapper, position + 1, mode) && SplitUtils.isSectionOpen(wrapper, position, mode)) {
      SplitUtils.openSplitter(wrapper, position + 1, mode, "open", direction);
    } else {
      SplitUtils.openSplitter(wrapper, position, mode, "open", direction);
    }
  }

  function handleBottomAndRightArrowClick(
    event: any,
    mode: "horizontal" | "vertical",
    position: number,
    direction: "left" | "right" | "top" | "bottom"
  ) {
    const wrapper = event.target.parentElement.parentElement;
    if (SplitUtils.isSectionOpen(wrapper, position + 1, mode) && SplitUtils.isSectionOpen(wrapper, position, mode)) {
      SplitUtils.closeSplitter(wrapper, position + 1, mode, "close", direction);
    } else if (SplitUtils.isSectionOpen(wrapper, position + 1, mode) && !SplitUtils.isSectionOpen(wrapper, position, mode)) {
      SplitUtils.openSplitter(wrapper, position, mode, "open", direction);
    } else {
      SplitUtils.openSplitter(wrapper, position, mode, "open", direction);
    }
  }

  function handleMouseOverParent(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    ((e.target as HTMLDivElement).firstChild as HTMLElement)?.classList.remove("a-icon-hide");
    ((e.target as HTMLDivElement).lastChild as HTMLElement)?.classList.remove("a-icon-hide");
  }

  function handleMouseOverChild(e: React.MouseEvent<HTMLDivElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    (((e.target as HTMLDivElement).parentElement as HTMLDivElement).firstChild as HTMLElement)?.classList.remove("a-icon-hide");
    (((e.target as HTMLDivElement).parentElement as HTMLDivElement).lastChild as HTMLElement)?.classList.remove("a-icon-hide");
  }

  function handleMouseOutParent(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    ((e.target as HTMLDivElement).firstChild as HTMLElement)?.classList.add("a-icon-hide");
    ((e.target as HTMLDivElement).lastChild as HTMLElement)?.classList.add("a-icon-hide");
  }

  function handleMouseOutChild(e: React.MouseEvent<HTMLDivElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    (((e.target as HTMLDivElement).parentElement as HTMLDivElement).firstChild as HTMLElement)?.classList.add("a-icon-hide");
    (((e.target as HTMLDivElement).parentElement as HTMLDivElement).lastChild as HTMLElement)?.classList.add("a-icon-hide");
  }

  return (
    <div
      {...props}
      onMouseDown={props.className.includes("a-split-handle-disable") ? () => {} : onMouseDown}
      onTouchStart={props.className.includes("a-split-handle-disable") ? () => {} : onTouchStart}
      onMouseOver={props.className.includes("a-split-handle-disable") ? () => {} : handleMouseOverParent}
      onMouseOut={props.className.includes("a-split-handle-disable") ? () => {} : handleMouseOutParent}
    >
      {props.className.includes("a-split-handle-disable") || props.className.includes("a-split-line-bar") ? (
        <></>
      ) : (
        <>
          <button
            className={`a-splitter-collapse-icon splitter-${mode}-${mode === "horizontal" ? "left" : "top"}-icon a-icon-hide`}
            onClick={(e) => {
              if (mode === "horizontal") {
                handleTopAndLeftArrowClick(e, "horizontal", position, "left");
              } else {
                handleTopAndLeftArrowClick(e, "vertical", position, "top");
              }
            }}
            onMouseOver={handleMouseOverChild}
            onMouseOut={handleMouseOutChild}
          ></button>
          <div className="a-splitter-handlebar-icon" onMouseOver={handleMouseOverChild} onMouseOut={handleMouseOutChild}></div>
          <button
            className={`a-splitter-collapse-icon splitter-${mode}-${mode === "horizontal" ? "right" : "bottom"}-icon a-icon-hide`}
            onClick={(e) => {
              // here position + 1 is the section which we want to close or open using right arrow
              if (mode === "horizontal") {
                handleBottomAndRightArrowClick(e, "horizontal", position, "right");
              } else {
                handleBottomAndRightArrowClick(e, "vertical", position, "bottom");
              }
            }}
            onMouseOver={handleMouseOverChild}
            onMouseOut={handleMouseOutChild}
          ></button>
        </>
      )}
    </div>
  );
}

export default DragHandle;
