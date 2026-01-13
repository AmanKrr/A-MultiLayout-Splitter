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
  useState,
  useCallback,
} from 'react';
// @ts-ignore - SplitSnapshot is used in function signature
import type { SplitProps, SplitRef, SplitState, SplitAction, SplitSnapshot } from '../types';
import { usePaneManager } from '../hooks/usePaneManager';
import { useDragHandler } from '../hooks/useDragHandler';
import { usePersistence } from '../hooks/usePersistence';
import { usePluginContext } from '../hooks/usePluginContext';
import {
  isHandlebarDisabled,
  isHandlebarVisible,
  isLineBarStyle,
  shouldShowHandlebar,
} from '../utils/paneOperations';
import { useSplitActions } from '../contexts/SplitProvider';
import { useNestingLevel, NestingProvider } from '../contexts/NestingContext';
import { DragHandle } from './DragHandle';
import { Pane } from './Pane';
import { PluginManager } from '../plugins/PluginManager';
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
    plugins = [],
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

  // Plugin manager ref
  const pluginManagerRef = useRef<PluginManager | null>(null);

  // Phase 5: Nesting level detection for automatic fixClass
  const nestingLevel = useNestingLevel();
  const autoFixClass = !fixClass && nestingLevel > 2; // Auto-apply fix for deep nesting

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

  // Pane management hook (Phase 4 Enhanced)
  const {
    panes,
    addPane,
    removePane,
    togglePane,
    setPaneSize,
    getPaneState,
    // Phase 4: Enhanced operations
    removePanes,
    swapPanes,
    collapsePane,
    expandPane,
    resizePane,
  } = usePaneManager(children, initialSizes, collapsed, minSizes, maxSizes);

  // Drag state for plugins
  const [dragState, setDragState] = useState<any>(null);

  // State getter for plugins
  const getState = useCallback((): SplitState => {
    return {
      panes,
      mode,
      dragState,
    };
  }, [panes, mode, dragState]);

  // Dispatcher for plugins
  const dispatch = useCallback((action: SplitAction) => {
    switch (action.type) {
      case 'ADD_PANE':
        addPane(action.payload);
        break;
      case 'REMOVE_PANE':
        removePane(action.payload);
        break;
      case 'TOGGLE_PANE':
        togglePane(action.payload);
        break;
      case 'SET_PANE_SIZE':
        setPaneSize(action.payload.index, action.payload.size);
        break;
      case 'RESTORE_STATE':
        // Handle state restoration
        action.payload.panes.forEach((pane, idx) => {
          setPaneSize(idx, pane.size);
          if (pane.collapsed) {
            togglePane(idx);
          }
        });
        break;
      case 'ADJUST_PANE_SIZE':
        // Handle keyboard adjustments
        // This would need more sophisticated logic
        console.log('ADJUST_PANE_SIZE not fully implemented yet');
        break;
    }
  }, [addPane, removePane, togglePane, setPaneSize]);

  // Create plugin context
  const pluginContext = usePluginContext(id, getState, dispatch, containerRef);

  // Initialize plugin manager
  useEffect(() => {
    if (plugins.length > 0) {
      pluginManagerRef.current = new PluginManager(pluginContext);
      pluginManagerRef.current.registerPlugins(plugins);

      return () => {
        pluginManagerRef.current?.destroy();
        pluginManagerRef.current = null;
      };
    }
  }, [plugins, pluginContext]);

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

  // Phase 5: Sync disable/visible/lineBar prop changes to handlebars
  useEffect(() => {
    if (!containerRef.current) return;

    const handlebars = containerRef.current.querySelectorAll('.a-split-handlebar');
    handlebars.forEach((handlebar, idx) => {
      const element = handlebar as HTMLElement;

      // Sync disable state
      const isDisabledArray = Array.isArray(disable);
      const isDisabled = isDisabledArray ? disable[idx] : disable;
      if (isDisabled) {
        element.classList.add('a-split-handlebar-disabled');
        element.style.cursor = 'default';
      } else {
        element.classList.remove('a-split-handlebar-disabled');
        element.style.cursor = mode === 'horizontal' ? 'col-resize' : 'row-resize';
      }

      // Sync visible state
      const isVisibleArray = Array.isArray(visible);
      const isVisible = isVisibleArray ? visible[idx] : visible;
      element.style.display = isVisible ? '' : 'none';

      // Sync lineBar style
      const isLineBarArray = Array.isArray(lineBar);
      const isLinebar = isLineBarArray ? lineBar[idx] : lineBar;
      if (isLinebar) {
        element.classList.add('a-split-handlebar-line');
      } else {
        element.classList.remove('a-split-handlebar-line');
      }
    });
  }, [disable, visible, lineBar, mode]);

  // Drag handler hook
  const { handleMouseDown } = useDragHandler(containerRef, mode, {
    onDragStart: (event) => {
      // Update drag state
      setDragState({ active: true, paneIndex: event.paneIndex });

      // Notify plugins
      pluginManagerRef.current?.onDragStart(event);

      // Notify parent
      const pane = panes[event.paneIndex];
      if (pane) {
        onLayoutChange?.(event.paneIndex, pane.id, 'dragging', null);
      }
    },
    onDragMove: (event) => {
      // Notify plugins (they can prevent default behavior)
      const shouldContinue = pluginManagerRef.current?.onDragMove(event) ?? true;

      if (shouldContinue) {
        // Call legacy callback
        onDragging?.(event.prevSize, event.nextSize, event.paneIndex);
      }
    },
    onDragEnd: (event) => {
      // Update React state to match DOM
      setPaneSize(event.paneIndex - 1, `${event.prevSize}%`);
      setPaneSize(event.paneIndex, `${event.nextSize}%`);

      // Clear drag state
      setDragState(null);

      // Notify plugins
      pluginManagerRef.current?.onDragEnd(event);

      // Call legacy callback
      onDragEnd?.(event.prevSize, event.nextSize, event.paneIndex);

      // Notify parent
      const pane = panes[event.paneIndex];
      if (pane) {
        onLayoutChange?.(event.paneIndex, pane.id, 'dragged', null);
      }
    },
  });

  // Phase 5: Collapse/Expand handlers for custom handlebars
  const handleCollapse = useCallback(
    (handlebarIndex: number, direction: 'left' | 'right') => {
      const paneIndexToCollapse =
        direction === 'left' ? handlebarIndex - 1 : handlebarIndex;

      if (paneIndexToCollapse >= 0 && paneIndexToCollapse < panes.length) {
        collapsePane(paneIndexToCollapse);

        // Notify parent
        const pane = panes[paneIndexToCollapse];
        if (pane) {
          onLayoutChange?.(paneIndexToCollapse, pane.id, 'close', null);
        }
      }
    },
    [panes, collapsePane, onLayoutChange]
  );

  const handleExpand = useCallback(
    (handlebarIndex: number, direction: 'left' | 'right') => {
      const paneIndexToExpand =
        direction === 'left' ? handlebarIndex - 1 : handlebarIndex;

      if (paneIndexToExpand >= 0 && paneIndexToExpand < panes.length) {
        expandPane(paneIndexToExpand);

        // Notify parent
        const pane = panes[paneIndexToExpand];
        if (pane) {
          onLayoutChange?.(paneIndexToExpand, pane.id, 'open', null);
        }
      }
    },
    [panes, expandPane, onLayoutChange]
  );

  // Expose imperative API (Phase 4 Enhanced)
  useImperativeHandle(
    ref,
    () => ({
      // Basic operations
      addPane,
      removePane,
      togglePane,
      setPaneSize,
      getPaneState,
      // Phase 4: Advanced operations
      removePanes,
      swapPanes,
      collapsePane,
      expandPane,
      resizePane,
      getSnapshot: () => {
        const container = containerRef.current;
        const totalSize = container
          ? mode === 'horizontal'
            ? container.offsetWidth
            : container.offsetHeight
          : 0;

        return {
          panes: panes.map((p) => ({ ...p })),
          totalSize,
          mode,
          timestamp: Date.now(),
        };
      },
      restore: (snapshot) => {
        if (snapshot.mode !== mode) {
          console.warn(
            `Cannot restore snapshot with different mode. Current: ${mode}, Snapshot: ${snapshot.mode}`
          );
          return;
        }

        snapshot.panes.forEach((pane, idx) => {
          if (panes[idx]) {
            setPaneSize(idx, pane.size);
            if (pane.collapsed !== panes[idx].collapsed) {
              togglePane(idx);
            }
          }
        });
      },
    }),
    [
      addPane,
      removePane,
      togglePane,
      setPaneSize,
      getPaneState,
      removePanes,
      swapPanes,
      collapsePane,
      expandPane,
      resizePane,
      panes,
      mode,
    ]
  );

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
    // Phase 5: Apply fixClass manually or automatically for deep nesting
    if (fixClass || autoFixClass) classes.push('a-split-fix');
    if (className) classes.push(className);
    return classes.join(' ');
  }, [mode, fixClass, autoFixClass, className]);

  // Render panes and handlebars
  const renderContent = () => {
    const elements: JSX.Element[] = [];

    panes.forEach((pane, index) => {
      // Phase 5: Wrap pane content with NestingProvider to increment level for nested Splits
      const wrappedContent = (
        <NestingProvider level={nestingLevel + 1}>
          {pane.content}
        </NestingProvider>
      );

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
          content={wrappedContent}
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
          // Check if plugin provides custom handle
          const customHandle = pluginManagerRef.current?.renderHandle({
            index: handlebarIndex,
            mode,
            disabled: isDisabled,
            lineBar: isLinebar,
            onMouseDown: (e: React.MouseEvent | React.TouchEvent) =>
              handleMouseDown(handlebarIndex, e),
          });

          if (customHandle) {
            // Use plugin's custom handle
            elements.push(
              <React.Fragment key={`handlebar-${handlebarIndex}`}>
                {customHandle}
              </React.Fragment>
            );
          } else {
            // Render default handlebar using DragHandle component
            elements.push(
              <DragHandle
                key={`handlebar-${handlebarIndex}`}
                index={handlebarIndex}
                mode={mode}
                disabled={isDisabled}
                lineBar={isLinebar}
                onMouseDown={(e) => handleMouseDown(handlebarIndex, e)}
                onCollapse={(direction) => handleCollapse(handlebarIndex, direction)}
                onExpand={(direction) => handleExpand(handlebarIndex, direction)}
                renderCustom={renderBar}
              />
            );
          }
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
