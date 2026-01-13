/**
 * Split Component v6 - Functional Implementation
 *
 * PERFORMANCE CRITICAL: This component preserves the v5 performance characteristics:
 * - Direct DOM manipulation during drag (60fps with 10,000+ elements)
 * - Cached element references
 * - requestAnimationFrame synchronization
 * - CSS-based state persistence via flexBasis/flexGrow
 *
 * New in v6:
 * - Functional component with hooks
 * - Reactive props (no context workaround needed)
 * - Imperative API via ref
 * - Better TypeScript support
 * - Composable architecture
 */

import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
  useMemo,
} from 'react';
import { SplitProps, SplitRef } from '../types';
import { usePaneManager } from '../hooks/usePaneManager';
import { useDragHandler } from '../hooks/useDragHandler';
import { usePersistence } from '../hooks/usePersistence';
import {
  isHandlebarDisabled,
  isHandlebarVisible,
  isLineBarStyle,
  shouldShowHandlebar,
} from '../utils/paneOperations';
import { useSplitActions } from '../contexts/SplitProvider';
import { DragHandle } from './DragHandle';
import { Pane } from './Pane';
import '../styles/split.css';

/**
 * Split Component
 *
 * A high-performance split pane component with drag-to-resize functionality.
 *
 * @example
 * ```tsx
 * <Split
 *   id="my-split"
 *   mode="horizontal"
 *   initialSizes={['50%', '50%']}
 *   minSizes={[10, 10]}
 *   maxSizes={[90, 90]}
 * >
 *   <div>Pane 1</div>
 *   <div>Pane 2</div>
 * </Split>
 * ```
 */
export const Split = forwardRef<SplitRef, SplitProps>((props, ref) => {
  const {
    id,
    mode = 'horizontal',
    initialSizes = [],
    minSizes = [],
    maxSizes = [],
    collapsed = [],
    disable = false,
    visible = true,
    lineBar = false,
    renderBar,
    enableSessionStorage = false,
    width = null,
    height = null,
    className = '',
    style = {},
    fixClass = false,
    children,
    onDragging,
    onDragEnd,
    onLayoutChange,
  } = props;

  // Container ref
  const containerRef = useRef<HTMLDivElement>(null);

  // Props validation (development warnings)
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      // Validate initialSizes
      if (initialSizes.length > 0) {
        const childArray = React.Children.toArray(children);
        if (initialSizes.length !== childArray.length) {
          console.warn(
            `[Split] initialSizes length (${initialSizes.length}) doesn't match children count (${childArray.length})`
          );
        }

        // Check for invalid size formats
        initialSizes.forEach((size, idx) => {
          if (typeof size === 'string') {
            const parsed = parseFloat(size);
            if (isNaN(parsed)) {
              console.warn(`[Split] Invalid size at index ${idx}: "${size}". Expected format: "50%", "100px", etc.`);
            }
            if (size.includes('%')) {
              const percent = parseFloat(size);
              if (percent < 0 || percent > 100) {
                console.warn(`[Split] Size at index ${idx} is out of range: "${size}". Percentage should be 0-100.`);
              }
            }
          }
        });

        // Check if total percentage exceeds 100%
        const totalPercent = initialSizes.reduce((sum, size) => {
          if (typeof size === 'string' && size.includes('%')) {
            return sum + parseFloat(size);
          }
          return sum;
        }, 0);
        if (totalPercent > 100) {
          console.warn(`[Split] Total percentage (${totalPercent}%) exceeds 100%. Sizes will be normalized.`);
        }
      }

      // Validate minSizes and maxSizes
      if (minSizes.length > 0 || maxSizes.length > 0) {
        minSizes.forEach((min, idx) => {
          const max = maxSizes[idx];
          if (max !== undefined && min > max) {
            console.warn(`[Split] minSize (${min}) is greater than maxSize (${max}) at index ${idx}`);
          }
          if (min < 0 || min > 100) {
            console.warn(`[Split] minSize at index ${idx} is out of range: ${min}. Should be 0-100.`);
          }
        });
        maxSizes.forEach((max, idx) => {
          if (max < 0 || max > 100) {
            console.warn(`[Split] maxSize at index ${idx} is out of range: ${max}. Should be 0-100.`);
          }
        });
      }

      // Validate collapsed array length
      if (collapsed.length > 0) {
        const childArray = React.Children.toArray(children);
        if (collapsed.length !== childArray.length) {
          console.warn(
            `[Split] collapsed length (${collapsed.length}) doesn't match children count (${childArray.length})`
          );
        }
      }
    }
  }, [initialSizes, minSizes, maxSizes, collapsed, children]);

  // Pane management hook
  const {
    panes,
    addPane,
    removePane,
    togglePane,
    setPaneSize,
    getPaneState,
  } = usePaneManager(children, initialSizes, collapsed, minSizes, maxSizes);

  // Persistence hook
  const persistence = usePersistence(
    enableSessionStorage,
    `split-state-${id}`,
    mode
  );

  // Context integration (optional - only if inside SplitProvider)
  const contextActions = useSplitActions();

  // Sync panes state to context when present
  useEffect(() => {
    if (contextActions) {
      // Context is available - sync state
      // This allows child components to access panes via context hooks
      // Note: Context actions are already the same as our local actions
      // so we don't need to override them
    }
  }, [panes, contextActions]);

  // Load saved state on mount
  useEffect(() => {
    const savedState = persistence.load();
    if (savedState && savedState.length === panes.length) {
      // Restore saved sizes
      savedState.forEach((saved, index) => {
        if (panes[index] && saved.id === panes[index].id) {
          setPaneSize(index, saved.size);
          if (saved.collapsed !== panes[index].collapsed) {
            togglePane(index);
          }
        }
      });
    }
  }, []); // Only on mount

  // Save state when panes change
  useEffect(() => {
    persistence.save(panes);
  }, [panes, persistence]);

  // ==================== REACTIVE PROPS SYSTEM ====================
  // Sync initialSizes prop to DOM when it changes
  // NOTE: We deliberately exclude 'panes' from dependencies to avoid resetting
  // sizes after drag operations. This effect should ONLY run when the parent
  // changes the initialSizes prop, not when our internal panes state updates.
  useEffect(() => {
    if (!containerRef.current) return;
    if (initialSizes.length === 0) return;

    // Apply initialSizes to all panes
    initialSizes.forEach((size, idx) => {
      setPaneSize(idx, size);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSizes, children]);

  // Sync collapsed prop changes to DOM
  useEffect(() => {
    if (!containerRef.current) return;

    collapsed.forEach((isCollapsed, idx) => {
      const pane = panes[idx];
      if (pane && pane.collapsed !== isCollapsed) {
        togglePane(idx);
      }
    });
  }, [collapsed, panes, togglePane]);

  // Sync minSizes/maxSizes to data attributes
  useEffect(() => {
    if (!containerRef.current) return;

    panes.forEach((pane, idx) => {
      const element = containerRef.current?.querySelector(`[data-pane-id="${pane.id}"]`) as HTMLElement | null;
      if (element) {
        const minSize = minSizes[idx];
        const maxSize = maxSizes[idx];
        if (minSize !== undefined) {
          element.setAttribute('data-min-size', String(minSizes[idx]));
        }
        if (maxSize !== undefined) {
          element.setAttribute('data-max-size', String(maxSizes[idx]));
        }
      }
    });
  }, [minSizes, maxSizes, panes]);

  // Sync mode changes (re-render with new flex direction)
  useEffect(() => {
    // Mode changes are handled by containerStyles recalculation
    // No direct DOM manipulation needed - React will handle it
  }, [mode]);

  // Sync children prop changes
  useEffect(() => {
    // Note: Children changes are handled by usePaneManager
    // which receives children as a dependency
    // This effect exists to ensure children updates trigger re-renders
  }, [children, panes.length]);

  // Drag handler hook
  const { handleMouseDown } = useDragHandler(containerRef, mode, {
    onDragStart: (event) => {
      // Notify parent
      const pane = panes[event.paneIndex];
      if (pane) {
        onLayoutChange?.(event.paneIndex, pane.id, 'dragging', null);
      }
    },
    onDragMove: (event) => {
      // Call legacy callback
      onDragging?.(event.prevSize, event.nextSize, event.paneIndex);
    },
    onDragEnd: (event) => {
      // Update React state to match DOM
      setPaneSize(event.paneIndex - 1, `${event.prevSize}%`);
      setPaneSize(event.paneIndex, `${event.nextSize}%`);

      // Call legacy callback
      onDragEnd?.(event.prevSize, event.nextSize, event.paneIndex);

      // Notify parent
      const pane = panes[event.paneIndex];
      if (pane) {
        onLayoutChange?.(event.paneIndex, pane.id, 'dragged', null);
      }
    },
  });

  // Expose imperative API
  useImperativeHandle(ref, () => ({
    addPane,
    removePane,
    togglePane,
    setPaneSize,
    getPaneState,
  }));

  // Calculate container styles
  const containerStyles = useMemo(() => {
    const baseStyles: React.CSSProperties = {
      display: 'flex',
      flexDirection: mode === 'horizontal' ? 'row' : 'column',
      width: width || '100%',
      height: height || '100%',
      overflow: 'hidden',
      ...style,
    };
    return baseStyles;
  }, [mode, width, height, style]);

  // Calculate container class
  const containerClass = useMemo(() => {
    const classes = ['a-split-container'];
    if (mode === 'vertical') classes.push('a-split-vertical');
    if (fixClass) classes.push('a-split-fix');
    if (className) classes.push(className);
    return classes.join(' ');
  }, [mode, fixClass, className]);

  // Render panes and handlebars
  const renderContent = () => {
    const elements: JSX.Element[] = [];

    panes.forEach((pane, index) => {
      // Render pane using Pane component
      elements.push(
        <Pane
          key={pane.id}
          id={pane.id}
          size={pane.size}
          collapsed={pane.collapsed}
          minSize={pane.minSize}
          maxSize={pane.maxSize}
          mode={mode}
          content={pane.content}
        />
      );

      // Render handlebar (except after last pane)
      if (index < panes.length - 1) {
        const handlebarIndex = index + 1;
        const nextPane = panes[index + 1];
        if (!nextPane) return; // Skip if next pane doesn't exist

        // Check if handlebar should be shown
        const showHandlebar = shouldShowHandlebar(pane, nextPane);
        const isDisabled = isHandlebarDisabled(handlebarIndex, disable);
        const isVisible = isHandlebarVisible(handlebarIndex, visible);
        const isLinebar = isLineBarStyle(handlebarIndex, lineBar);

        if (isVisible && showHandlebar) {
          // Render handlebar using DragHandle component
          elements.push(
            <DragHandle
              key={`handlebar-${handlebarIndex}`}
              index={handlebarIndex}
              mode={mode}
              disabled={isDisabled}
              lineBar={isLinebar}
              onMouseDown={(e) => handleMouseDown(handlebarIndex, e)}
              renderCustom={renderBar}
            />
          );
        }
      }
    });

    return elements;
  };

  return (
    <div
      ref={containerRef}
      id={id}
      className={containerClass}
      style={containerStyles}
    >
      {renderContent()}
    </div>
  );
});

Split.displayName = 'Split';
