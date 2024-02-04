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
  function handleTopAndLeftArrowClick(
    mode: "horizontal" | "vertical",
    position: number,
    direction: "left" | "right" | "top" | "bottom"
  ) {
    if (
      SplitUtils.isSectionOpen(position + 1, mode) &&
      SplitUtils.isSectionOpen(position, mode)
    ) {
      SplitUtils.closeSplitter(position, mode, direction);
    } else if (
      !SplitUtils.isSectionOpen(position + 1, mode) &&
      SplitUtils.isSectionOpen(position, mode)
    ) {
      SplitUtils.openSplitter(position + 1, mode, direction);
    } else {
      SplitUtils.openSplitter(position, mode, direction);
    }
  }

  function handleBottomAndRightArrowClick(
    mode: "horizontal" | "vertical",
    position: number,
    direction: "left" | "right" | "top" | "bottom"
  ) {
    if (
      SplitUtils.isSectionOpen(position + 1, mode) &&
      SplitUtils.isSectionOpen(position, mode)
    ) {
      SplitUtils.closeSplitter(position + 1, mode, direction);
    } else if (
      SplitUtils.isSectionOpen(position + 1, mode) &&
      !SplitUtils.isSectionOpen(position, mode)
    ) {
      SplitUtils.openSplitter(position, mode, direction);
    } else {
      SplitUtils.openSplitter(position, mode, direction);
    }
  }

  function handleMouseOverParent(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) {
    ((e.target as HTMLDivElement).firstChild as HTMLElement)?.classList.remove(
      "a-icon-hide"
    );
    ((e.target as HTMLDivElement).lastChild as HTMLElement)?.classList.remove(
      "a-icon-hide"
    );
  }

  function handleMouseOverChild(
    e:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    (
      ((e.target as HTMLDivElement).parentElement as HTMLDivElement)
        .firstChild as HTMLElement
    )?.classList.remove("a-icon-hide");
    (
      ((e.target as HTMLDivElement).parentElement as HTMLDivElement)
        .lastChild as HTMLElement
    )?.classList.remove("a-icon-hide");
  }

  function handleMouseOutParent(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) {
    ((e.target as HTMLDivElement).firstChild as HTMLElement)?.classList.add(
      "a-icon-hide"
    );
    ((e.target as HTMLDivElement).lastChild as HTMLElement)?.classList.add(
      "a-icon-hide"
    );
  }

  function handleMouseOutChild(
    e:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    (
      ((e.target as HTMLDivElement).parentElement as HTMLDivElement)
        .firstChild as HTMLElement
    )?.classList.add("a-icon-hide");
    (
      ((e.target as HTMLDivElement).parentElement as HTMLDivElement)
        .lastChild as HTMLElement
    )?.classList.add("a-icon-hide");
  }

  return (
    <div
      {...props}
      className={
        `splitterHandleBarContainer-` +
        mode +
        ` splitterHandleBarContainer-` +
        mode +
        "-" +
        position
      }
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onMouseOver={handleMouseOverParent}
      onMouseOut={handleMouseOutParent}
    >
      <button
        className={`a-splitter-collapse-icon splitter-${mode}-${
          mode === "horizontal" ? "left" : "top"
        }-icon a-icon-hide`}
        onClick={() => {
          if (mode === "horizontal") {
            handleTopAndLeftArrowClick("horizontal", position, "left");
          } else {
            handleTopAndLeftArrowClick("vertical", position, "top");
          }
        }}
        onMouseOver={handleMouseOverChild}
        onMouseOut={handleMouseOutChild}
      ></button>
      <div
        className="a-splitter-handlebar-icon"
        onMouseOver={handleMouseOverChild}
        onMouseOut={handleMouseOutChild}
      ></div>
      <button
        className={`a-splitter-collapse-icon splitter-${mode}-${
          mode === "horizontal" ? "right" : "bottom"
        }-icon a-icon-hide`}
        onClick={() => {
          // here position + 1 is the section which we want to close or open using right arrow
          if (mode === "horizontal") {
            handleBottomAndRightArrowClick("horizontal", position, "right");
          } else {
            handleBottomAndRightArrowClick("vertical", position, "bottom");
          }
        }}
        onMouseOver={handleMouseOverChild}
        onMouseOut={handleMouseOutChild}
      ></button>
    </div>
  );
}

export default DragHandle;
