import { useCallback, useRef, useEffect, RefObject } from 'react';
import { throttle } from '../utils/native/throttle';
import { DragState, DragCallbacks, SplitMode } from '../types';
import { parseSize } from '../utils/sizeConversion';

/** Extended drag state that tracks original units */
interface ExtendedDragState extends DragState {
  prevUnit: string;
  nextUnit: string;
}

/**
 * useDragHandler
 *
 * Orchestrates the low-level pointer events and DOM manipulation required for
 * high-performance pane resizing. Bypasses React's render loop during active
 * dragging to maintain a consistent 60fps experience even in nested layouts.
 *
 * @param containerRef - DOM reference to the master split container
 * @param mode - Active layout orientation
 * @param callbacks - Lifecycle callbacks for the drag sequence
 */
export function useDragHandler(containerRef: RefObject<HTMLDivElement>, mode: SplitMode, callbacks: DragCallbacks = {}) {
  const { onDragStart, onDragMove, onDragEnd } = callbacks;

  const dragState = useRef<ExtendedDragState | null>(null);
  const finalSizes = useRef<{ prevSize: number; nextSize: number; prevSizePx: number; nextSizePx: number } | null>(null);

  /**
   * handleMouseDown
   *
   * Captures initial state and attaches window-level listeners to begin the
   * drag sequence. Calculates and caches container dimensions to avoid
   * layout thrashing during movement.
   */
  const handleMouseDown = useCallback(
    (paneIndex: number, e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const target = e.target as HTMLElement;
      if (target.closest('button') || target.tagName === 'BUTTON') {
        return;
      }

      const container = containerRef.current;
      if (!container) return;

      const children = Array.from(container.children);

      const prevElementIndex = (paneIndex - 1) * 2;
      const nextElementIndex = paneIndex * 2;

      const prevElement = children[prevElementIndex] as HTMLElement;
      const nextElement = children[nextElementIndex] as HTMLElement;

      if (!prevElement || !nextElement) return;

      if (prevElement.classList.contains('a-split-hidden') || nextElement.classList.contains('a-split-hidden')) {
        return;
      }

      const clientX = 'touches' in e ? (e.touches[0]?.clientX ?? 0) : e.clientX;
      const clientY = 'touches' in e ? (e.touches[0]?.clientY ?? 0) : e.clientY;

      const handlebars = Array.from(container.querySelectorAll('.a-split-handlebar')).filter((h) => h.parentElement === container);

      let totalHandlebarSpace = 0;
      handlebars.forEach((handlebar) => {
        const h = handlebar as HTMLElement;
        const style = window.getComputedStyle(h);

        if (mode === 'horizontal') {
          const marginLeft = parseFloat(style.marginLeft) || 0;
          const marginRight = parseFloat(style.marginRight) || 0;
          totalHandlebarSpace += h.offsetWidth + marginLeft + marginRight;
        } else {
          const marginTop = parseFloat(style.marginTop) || 0;
          const marginBottom = parseFloat(style.marginBottom) || 0;
          totalHandlebarSpace += h.offsetHeight + marginTop + marginBottom;
        }
      });

      // Extract original units from data-size attribute (set by Pane component)
      const prevDataSize = prevElement.getAttribute('data-size') || '50%';
      const nextDataSize = nextElement.getAttribute('data-size') || '50%';
      const prevParsed = parseSize(prevDataSize);
      const nextParsed = parseSize(nextDataSize);

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
        containerWidth: container.offsetWidth - (mode === 'horizontal' ? totalHandlebarSpace : 0),
        containerHeight: container.offsetHeight - (mode === 'vertical' ? totalHandlebarSpace : 0),
        minPrevSize: parseFloat(prevElement.getAttribute('data-min-size') || '0'),
        maxPrevSize: parseFloat(prevElement.getAttribute('data-max-size') || '100'),
        minNextSize: parseFloat(nextElement.getAttribute('data-min-size') || '0'),
        maxNextSize: parseFloat(nextElement.getAttribute('data-max-size') || '100'),
        prevUnit: prevParsed.unit,
        nextUnit: nextParsed.unit,
      };

      finalSizes.current = null;

      onDragStart?.({ paneIndex });
    },
    [containerRef, onDragStart, mode]
  );

  /**
   * calculateDragState
   *
   * Pure logic to determine new percentage sizes based on current pointer offset.
   */
  const calculateDragState = useCallback(
    (e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent) => {
      const state = dragState.current;
      if (!state?.active) return null;

      const isHorizontal = mode === 'horizontal';

      const clientX = 'touches' in e ? (e.touches[0]?.clientX ?? 0) : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? (e.touches[0]?.clientY ?? 0) : (e as MouseEvent).clientY;

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

      const hitMinPrev = prevSize <= state.minPrevSize;
      const hitMaxPrev = prevSize >= state.maxPrevSize;
      const hitMinNext = nextSize <= state.minNextSize;
      const hitMaxNext = nextSize >= state.maxNextSize;

      if (hitMinPrev || hitMaxPrev || hitMinNext || hitMaxNext) return null;

      return {
        prevSize,
        nextSize,
        prevSizePx,
        nextSizePx,
        state,
      };
    },
    [mode]
  );

  /**
   * handleMouseMove
   *
   * Throttled handler that performs the raw DOM updates for flex-basis properties.
   */
  const handleMouseMove = useCallback(
    throttle((e: MouseEvent | TouchEvent) => {
      const result = calculateDragState(e);
      if (!result) return;

      const { prevSize, nextSize, prevSizePx, nextSizePx, state } = result;
      const { prevInitialWidth, prevInitialHeight } = state;
      const prevInitialSize = mode === 'horizontal' ? prevInitialWidth : prevInitialHeight;

      if (Math.abs(result.prevSizePx - prevInitialSize) <= 1) {
        return;
      }

      finalSizes.current = { prevSize, nextSize, prevSizePx, nextSizePx };

      requestAnimationFrame(() => {
        if (!state.prevElement || !state.nextElement) return;

        const extState = state as ExtendedDragState;

        // Use percentage for '%' units, pixels for everything else (px, fr, etc.)
        if (extState.prevUnit === '%') {
          state.prevElement.style.flexBasis = `${prevSize}%`;
        } else {
          state.prevElement.style.flexBasis = `${prevSizePx}px`;
        }

        if (extState.nextUnit === '%') {
          state.nextElement.style.flexBasis = `${nextSize}%`;
        } else {
          state.nextElement.style.flexBasis = `${nextSizePx}px`;
        }
      });

      onDragMove?.({ paneIndex: state.paneIndex, prevSize, nextSize });
    }, 16),
    [calculateDragState, mode, onDragMove]
  );

  /**
   * handleMouseUp
   *
   * Cleans up the drag sequence and triggers the final React-level update.
   */
  const handleMouseUp = useCallback(
    (e: MouseEvent | TouchEvent) => {
      const state = dragState.current as ExtendedDragState | null;
      if (!state?.active) return;

      const result = calculateDragState(e);
      if (result) {
        finalSizes.current = {
          prevSize: result.prevSize,
          nextSize: result.nextSize,
          prevSizePx: result.prevSizePx,
          nextSizePx: result.nextSizePx,
        };
      }

      const sizes = finalSizes.current;
      if (sizes) {
        onDragEnd?.({
          paneIndex: state.paneIndex,
          prevSize: sizes.prevSize,
          nextSize: sizes.nextSize,
          prevSizePx: sizes.prevSizePx,
          nextSizePx: sizes.nextSizePx,
          prevUnit: state.prevUnit,
          nextUnit: state.nextUnit,
        });
      }

      dragState.current = null;
      finalSizes.current = null;
    },
    [calculateDragState, onDragEnd]
  );

  useEffect(() => {
    const moveHandler = handleMouseMove as any;
    const upHandler = handleMouseUp;

    window.addEventListener('mousemove', moveHandler);
    window.addEventListener('mouseup', upHandler);
    window.addEventListener('touchmove', moveHandler, { passive: false });
    window.addEventListener('touchend', upHandler);

    return () => {
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('mouseup', upHandler);
      window.removeEventListener('touchmove', moveHandler);
      window.removeEventListener('touchend', upHandler);
    };
  }, [handleMouseMove, handleMouseUp]);

  return {
    handleMouseDown,
  };
}
