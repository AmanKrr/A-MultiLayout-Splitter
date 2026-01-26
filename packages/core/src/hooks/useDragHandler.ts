import { useCallback, useRef, useEffect, RefObject } from "react";
import { throttle } from "../utils/native/throttle";
import { DragState, DragCallbacks, SplitMode } from "../types";

/**
 * useDragHandler
 * Manages resizing logic via direct DOM manipulation for optimal performance.
 */
export function useDragHandler(
  containerRef: RefObject<HTMLDivElement>,
  mode: SplitMode,
  callbacks: DragCallbacks = {},
) {
  const { onDragStart, onDragMove, onDragEnd } = callbacks;

  const dragState = useRef<DragState | null>(null);
  const finalSizes = useRef<{ prevSize: number; nextSize: number } | null>(null);

  /**
   * Starts the drag operation.
   * Caches dimensions and element references to minimize reflows during move.
   */
  const handleMouseDown = useCallback(
    (paneIndex: number, e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // Only drag if clicking the handlebar, not the collapse buttons
      const target = e.target as HTMLElement;
      if (target.closest("button") || target.tagName === "BUTTON") {
        return;
      }

      const container = containerRef.current;
      if (!container) return;

      const children = Array.from(container.children);

      // Map pane index to DOM elements (panes are separated by handlebars)
      const prevElementIndex = (paneIndex - 1) * 2;
      const nextElementIndex = paneIndex * 2;

      const prevElement = children[prevElementIndex] as HTMLElement;
      const nextElement = children[nextElementIndex] as HTMLElement;

      if (!prevElement || !nextElement) return;

      if (
        prevElement.classList.contains("a-split-hidden") ||
        nextElement.classList.contains("a-split-hidden")
      ) {
        return;
      }

      const clientX = "touches" in e ? (e.touches[0]?.clientX ?? 0) : e.clientX;
      const clientY = "touches" in e ? (e.touches[0]?.clientY ?? 0) : e.clientY;

      // Measure handlebar space to accurately calculate available pane area
      const handlebars = container.querySelectorAll(".a-split-handlebar");
      let totalHandlebarSpace = 0;
      handlebars.forEach((handlebar) => {
        const h = handlebar as HTMLElement;
        const style = window.getComputedStyle(h);

        if (mode === "horizontal") {
          const marginLeft = parseFloat(style.marginLeft) || 0;
          const marginRight = parseFloat(style.marginRight) || 0;
          totalHandlebarSpace += h.offsetWidth + marginLeft + marginRight;
        } else {
          const marginTop = parseFloat(style.marginTop) || 0;
          const marginBottom = parseFloat(style.marginBottom) || 0;
          totalHandlebarSpace += h.offsetHeight + marginTop + marginBottom;
        }
      });

      dragState.current = {
        active: true,
        paneIndex,
        startX: clientX,
        startY: clientY,
        prevElement,
        nextElement,
        prevInitialWidth: prevElement.offsetWidth,
        nextInitialWidth: nextElement.offsetWidth,
        prevInitialHeight: prevElement.offsetHeight,
        nextInitialHeight: nextElement.offsetHeight,
        containerWidth: container.offsetWidth - (mode === "horizontal" ? totalHandlebarSpace : 0),
        containerHeight: container.offsetHeight - (mode === "vertical" ? totalHandlebarSpace : 0),
        minPrevSize: parseFloat(prevElement.getAttribute("data-min-size") || "0"),
        maxPrevSize: parseFloat(prevElement.getAttribute("data-max-size") || "100"),
        minNextSize: parseFloat(nextElement.getAttribute("data-min-size") || "0"),
        maxNextSize: parseFloat(nextElement.getAttribute("data-max-size") || "100"),
      };

      finalSizes.current = null;
      onDragStart?.({ paneIndex });
    },
    [containerRef, onDragStart, mode],
  );

  /**
   * Logic shared between mousemove and mouseup to determine new dimensions.
   */
  const calculateDragState = useCallback(
    (e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent) => {
      const state = dragState.current;
      if (!state?.active) return null;

      const isHorizontal = mode === "horizontal";
      const clientX = "touches" in e ? (e.touches[0]?.clientX ?? 0) : (e as MouseEvent).clientX;
      const clientY = "touches" in e ? (e.touches[0]?.clientY ?? 0) : (e as MouseEvent).clientY;

      const delta = isHorizontal ? clientX - state.startX : clientY - state.startY;
      const containerSize = isHorizontal ? state.containerWidth : state.containerHeight;

      const prevInitialSize = isHorizontal ? state.prevInitialWidth : state.prevInitialHeight;
      const nextInitialSize = isHorizontal ? state.nextInitialWidth : state.nextInitialHeight;

      let prevSizePx = prevInitialSize + delta;
      let nextSizePx = nextInitialSize - delta;

      if (prevSizePx < 0) prevSizePx = 0;
      if (nextSizePx < 0) nextSizePx = 0;

      const prevSize = (prevSizePx / containerSize) * 100;
      const nextSize = (nextSizePx / containerSize) * 100;

      // Stop resizing if hitting min/max boundaries
      if (
        prevSize <= state.minPrevSize ||
        prevSize >= state.maxPrevSize ||
        nextSize <= state.minNextSize ||
        nextSize >= state.maxNextSize
      ) {
        return null;
      }

      return { prevSize, nextSize, prevSizePx, nextSizePx, state };
    },
    [mode],
  );

  const handleMouseMove = useCallback(
    throttle((e: MouseEvent | TouchEvent) => {
      const result = calculateDragState(e);
      if (!result) return;

      const { prevSize, nextSize, prevSizePx, nextSizePx, state } = result;
      const prevInitialSize =
        mode === "horizontal" ? state.prevInitialWidth : state.prevInitialHeight;

      // Ignore noise/micro-moves
      if (Math.abs(result.prevSizePx - prevInitialSize) <= 1) {
        return;
      }

      finalSizes.current = { prevSize, nextSize };

      // Update DOM directly for performance, bypassing React lifecycle
      requestAnimationFrame(() => {
        if (!state.prevElement || !state.nextElement) return;

        // Maintain unit consistency (percent vs pixels) from initial styles
        const prevHasPercent = state.prevElement.style.flexBasis.includes("%");
        const nextHasPercent = state.nextElement.style.flexBasis.includes("%");

        state.prevElement.style.flexBasis = prevHasPercent ? `${prevSize}%` : `${prevSizePx}px`;
        state.nextElement.style.flexBasis = nextHasPercent ? `${nextSize}%` : `${nextSizePx}px`;
      });

      onDragMove?.({ paneIndex: state.paneIndex, prevSize, nextSize });
    }, 16),
    [calculateDragState, mode, onDragMove],
  );

  const handleMouseUp = useCallback(
    (e: MouseEvent | TouchEvent) => {
      const state = dragState.current;
      if (!state?.active) return;

      // Final capture ensures exact position even if move was throttled
      const result = calculateDragState(e);
      if (result) {
        finalSizes.current = { prevSize: result.prevSize, nextSize: result.nextSize };
      }

      const sizes = finalSizes.current;
      if (sizes) {
        onDragEnd?.({
          paneIndex: state.paneIndex,
          prevSize: sizes.prevSize,
          nextSize: sizes.nextSize,
        });
      }

      dragState.current = null;
      finalSizes.current = null;
    },
    [calculateDragState, onDragEnd],
  );

  useEffect(() => {
    const moveHandler = handleMouseMove as any;
    const upHandler = handleMouseUp;

    window.addEventListener("mousemove", moveHandler);
    window.addEventListener("mouseup", upHandler);
    window.addEventListener("touchmove", moveHandler, { passive: false });
    window.addEventListener("touchend", upHandler);

    return () => {
      window.removeEventListener("mousemove", moveHandler);
      window.removeEventListener("mouseup", upHandler);
      window.removeEventListener("touchmove", moveHandler);
      window.removeEventListener("touchend", upHandler);
    };
  }, [handleMouseMove, handleMouseUp]);

  return { handleMouseDown };
}
