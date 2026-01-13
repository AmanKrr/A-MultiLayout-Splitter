import { useCallback, useRef, useEffect, RefObject } from 'react';
import { throttle } from '../utils/native/throttle';
import {
  DragState,
  DragCallbacks,
  SplitMode,
} from '../types';

/**
 * useDragHandler - Handles drag operations with 60fps performance
 *
 * PERFORMANCE CRITICAL: This hook uses direct DOM manipulation to achieve
 * 60fps even with heavy content (10k+ elements). It preserves the core
 * strategy from v5:
 * - Cached element references (avoid reflows)
 * - Direct style manipulation (bypass React reconciliation)
 * - requestAnimationFrame synchronization
 * - Throttled updates at 16ms (60fps cap)
 *
 * @param containerRef - Reference to the split container
 * @param mode - Split orientation (horizontal/vertical)
 * @param callbacks - Drag event callbacks
 */
export function useDragHandler(
  containerRef: RefObject<HTMLDivElement>,
  mode: SplitMode,
  callbacks: DragCallbacks = {}
) {
  const { onDragStart, onDragMove, onDragEnd } = callbacks;

  // Use ref to avoid re-renders during drag
  const dragState = useRef<DragState | null>(null);

  /**
   * Initialize drag operation
   * PERFORMANCE: Cache all dimensions and refs on mousedown (one-time reflow)
   */
  const handleMouseDown = useCallback(
    (paneIndex: number, e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();

      const container = containerRef.current;
      if (!container) return;

      const children = Array.from(container.children);

      // Calculate actual indices accounting for handlebars
      // Children: [pane, handlebar, pane, handlebar, pane]
      // paneIndex=1 → indices: prev=0, handle=1, next=2
      const prevElementIndex = (paneIndex - 1) * 2;
      const nextElementIndex = paneIndex * 2;

      const prevElement = children[prevElementIndex] as HTMLElement;
      const nextElement = children[nextElementIndex] as HTMLElement;

      if (!prevElement || !nextElement) return;

      // PERFORMANCE: Cache everything needed during drag (avoid reflows)
      const clientX = 'touches' in e ? e.touches[0]?.clientX ?? 0 : e.clientX;
      const clientY = 'touches' in e ? e.touches[0]?.clientY ?? 0 : e.clientY;

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
        containerWidth: container.offsetWidth,
        containerHeight: container.offsetHeight,
        minPrevSize: parseFloat(prevElement.getAttribute('data-min-size') || '0'),
        maxPrevSize: parseFloat(prevElement.getAttribute('data-max-size') || '100'),
        minNextSize: parseFloat(nextElement.getAttribute('data-min-size') || '0'),
        maxNextSize: parseFloat(nextElement.getAttribute('data-max-size') || '100'),
      };

      onDragStart?.({ paneIndex });
    },
    [containerRef, onDragStart]
  );

  /**
   * Handle drag movement
   * PERFORMANCE: Throttled to 16ms (60fps) with direct DOM writes
   */
  const handleMouseMove = useCallback(
    throttle((e: MouseEvent | TouchEvent) => {
      const state = dragState.current;
      if (!state?.active) return;

      const isHorizontal = mode === 'horizontal';

      // Extract client position
      const clientX = 'touches' in e ? e.touches[0]?.clientX ?? 0 : e.clientX;
      const clientY = 'touches' in e ? e.touches[0]?.clientY ?? 0 : e.clientY;

      // Calculate delta from start position
      const delta = isHorizontal
        ? clientX - state.startX
        : clientY - state.startY;

      // Calculate container size
      const containerSize = isHorizontal
        ? state.containerWidth
        : state.containerHeight;

      const prevInitialSize = isHorizontal
        ? state.prevInitialWidth
        : state.prevInitialHeight;

      const nextInitialSize = isHorizontal
        ? state.nextInitialWidth
        : state.nextInitialHeight;

      // Calculate new sizes as percentages
      let prevSize = ((prevInitialSize + delta) / containerSize) * 100;
      let nextSize = ((nextInitialSize - delta) / containerSize) * 100;

      // Apply min/max constraints
      prevSize = Math.max(state.minPrevSize, Math.min(state.maxPrevSize, prevSize));
      nextSize = Math.max(state.minNextSize, Math.min(state.maxNextSize, nextSize));

      // PERFORMANCE CRITICAL: Direct DOM manipulation via RAF
      // This bypasses React reconciliation for 60fps performance
      requestAnimationFrame(() => {
        if (!state.prevElement || !state.nextElement) return;

        // Update flexBasis directly (preserves unit from initial setup)
        const prevHasPercent = state.prevElement.style.flexBasis.includes('%');
        const nextHasPercent = state.nextElement.style.flexBasis.includes('%');

        if (prevHasPercent) {
          state.prevElement.style.flexBasis = `${prevSize}%`;
        } else {
          const prevPx = (prevSize / 100) * containerSize;
          state.prevElement.style.flexBasis = `${prevPx}px`;
        }

        if (nextHasPercent) {
          state.nextElement.style.flexBasis = `${nextSize}%`;
        } else {
          const nextPx = (nextSize / 100) * containerSize;
          state.nextElement.style.flexBasis = `${nextPx}px`;
        }
      });

      onDragMove?.({ paneIndex: state.paneIndex, prevSize, nextSize });
    }, 16), // 60fps cap
    [mode, onDragMove]
  );

  /**
   * End drag operation
   */
  const handleMouseUp = useCallback(() => {
    const state = dragState.current;
    if (!state) return;

    dragState.current = null;

    const prevSize = parseFloat(state.prevElement.style.flexBasis);
    const nextSize = parseFloat(state.nextElement.style.flexBasis);

    onDragEnd?.({ paneIndex: state.paneIndex, prevSize, nextSize });
  }, [onDragEnd]);

  /**
   * Set up global event listeners
   * Note: Must be global to capture mouse outside the component
   */
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
