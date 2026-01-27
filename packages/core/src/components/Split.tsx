/**
 * Split
 *
 * A high-performance, functional split pane component for React.
 * Uses direct DOM manipulation for 60fps drag performance.
 */

import React, { forwardRef, useImperativeHandle, useRef, useEffect, useMemo, useState, useCallback } from "react";
// @ts-ignore - SplitSnapshot is used in function signature
import type { SplitProps, SplitRef, SplitState, SplitAction, SplitSnapshot } from "../types";
import { usePaneManager } from "../hooks/usePaneManager";
import { useDragHandler } from "../hooks/useDragHandler";
import { usePersistence } from "../hooks/usePersistence";
import { usePluginContext } from "../hooks/usePluginContext";
import { isHandlebarDisabled, isHandlebarVisible, isLineBarStyle, shouldShowHandlebar } from "../utils/paneOperations";
import { useNestingLevel, NestingProvider } from "../contexts/NestingContext";
import { DragHandle } from "./DragHandle";
import { Pane } from "./Pane";
import { PluginManager } from "../plugins/PluginManager";
import "../styles/split.css";

/**
 * Split Component
 *
 * Provides a resizable layout container with support for multiple panes,
 * custom handlebars, and a plugin system.
 *
 * @example
 * ```tsx
 * <Split
 *   id="main-layout"
 *   mode="horizontal"
 *   initialSizes={['30%', '70%']}
 * >
 *   <div id="sidebar">Sidebar Content</div>
 *   <div id="content">Main Content</div>
 * </Split>
 * ```
 *
 * @param props - Component properties
 * @param ref - Imperative API reference
 */
export const Split = forwardRef<SplitRef, SplitProps>((props, ref) => {
  const {
    id: providedId,
    mode = "horizontal",
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
    className = "",
    style = {},
    fixClass = false,
    children,
    onDragging,
    onDragEnd,
    onLayoutChange,
  } = props;

  const generatedIdRef = useRef(`split-${Math.random().toString(36).slice(2, 11)}`);
  const id = providedId || generatedIdRef.current;

  const containerRef = useRef<HTMLDivElement>(null);
  const pluginManagerRef = useRef<PluginManager | null>(null);

  const nestingLevel = useNestingLevel();
  const autoFixClass = !fixClass && nestingLevel > 2;

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      if (initialSizes.length > 0) {
        const childArray = React.Children.toArray(children);
        if (initialSizes.length !== childArray.length) {
          console.warn(`[Split] initialSizes length (${initialSizes.length}) doesn't match children count (${childArray.length})`);
        }

        initialSizes.forEach((size, idx) => {
          if (typeof size === "string") {
            const parsed = parseFloat(size);
            if (isNaN(parsed)) {
              console.warn(`[Split] Invalid size at index ${idx}: "${size}". Expected format: "50%", "100px", etc.`);
            }
            if (size.includes("%")) {
              const percent = parseFloat(size);
              if (percent < 0 || percent > 100) {
                console.warn(`[Split] Size at index ${idx} is out of range: "${size}". Percentage should be 0-100.`);
              }
            }
          }
        });

        const totalPercent = initialSizes.reduce((sum, size) => {
          if (typeof size === "string" && size.includes("%")) {
            return sum + parseFloat(size);
          }
          return sum;
        }, 0);
        if (totalPercent > 100) {
          console.warn(`[Split] Total percentage (${totalPercent}%) exceeds 100%. Sizes will be normalized.`);
        }
      }

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

      if (collapsed.length > 0) {
        const childArray = React.Children.toArray(children);
        if (collapsed.length !== childArray.length) {
          console.warn(`[Split] collapsed length (${collapsed.length}) doesn't match children count (${childArray.length})`);
        }
      }
    }
  }, [initialSizes, minSizes, maxSizes, collapsed, children]);

  const { panes, addPane, removePane, togglePane, setPaneSize, getPaneState, removePanes, swapPanes, collapsePane, expandPane, resizePane } = usePaneManager(
    children,
    initialSizes,
    collapsed,
    minSizes,
    maxSizes,
    id,
  );

  const [dragState, setDragState] = useState<any>(null);

  useEffect(() => {
    if (dragState && dragState.active) {
      document.body.classList.add("a-split-body-dragging");
      document.body.classList.add(mode === "horizontal" ? "a-split-body-dragging-horizontal" : "a-split-body-dragging-vertical");
    } else {
      document.body.classList.remove("a-split-body-dragging");
      document.body.classList.remove("a-split-body-dragging-horizontal");
      document.body.classList.remove("a-split-body-dragging-vertical");
    }

    return () => {
      document.body.classList.remove("a-split-body-dragging");
      document.body.classList.remove("a-split-body-dragging-horizontal");
      document.body.classList.remove("a-split-body-dragging-vertical");
    };
  }, [dragState, mode]);

  const getState = useCallback((): SplitState => {
    return {
      panes,
      mode,
      dragState,
    };
  }, [panes, mode, dragState]);

  const dispatch = useCallback(
    (action: SplitAction) => {
      switch (action.type) {
        case "ADD_PANE":
          addPane(action.payload);
          break;
        case "REMOVE_PANE":
          removePane(action.payload);
          break;
        case "TOGGLE_PANE":
          togglePane(action.payload);
          break;
        case "SET_PANE_SIZE":
          setPaneSize(action.payload.index, action.payload.size);
          break;
        case "RESTORE_STATE":
          action.payload.panes.forEach((pane, idx) => {
            setPaneSize(idx, pane.size);
            if (pane.collapsed) {
              togglePane(idx);
            }
          });
          break;
        case "ADJUST_PANE_SIZE":
          if (action.payload && dragState?.paneIndex != null) {
            const paneIndex = dragState.paneIndex;
            const currentPane = panes[paneIndex];
            if (currentPane) {
              const currentSize = parseFloat(currentPane.size);
              const delta = action.payload.direction === "grow" ? action.payload.amount : -action.payload.amount;
              const newSize = Math.max(currentPane.minSize || 0, Math.min(currentPane.maxSize || 100, currentSize + delta));
              setPaneSize(paneIndex, `${newSize}%`);
            }
          }
          break;
      }
    },
    [addPane, removePane, togglePane, setPaneSize, panes, dragState],
  );

  const pluginContext = usePluginContext(id, getState, dispatch, containerRef);

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

  const persistence = usePersistence(enableSessionStorage, `split-state-${id}`, mode);

  useEffect(() => {
    const savedState = persistence.load();
    if (savedState && savedState.length === panes.length) {
      savedState.forEach((saved, index) => {
        if (panes[index] && saved.id === panes[index].id) {
          setPaneSize(index, saved.size);
          if (saved.collapsed !== panes[index].collapsed) {
            togglePane(index);
          }
        }
      });
    }
  }, []);

  useEffect(() => {
    persistence.save(panes);
  }, [panes, persistence]);

  // Track whether this is the initial mount, previous children count, and previous initialSizes
  const isInitialMountRef = useRef(true);
  const prevChildCountRef = useRef(React.Children.count(children));
  const prevInitialSizesRef = useRef<string[]>(initialSizes);

  useEffect(() => {
    if (!containerRef.current) return;
    if (initialSizes.length === 0) return;

    const currentChildCount = React.Children.count(children);
    const childCountChanged = currentChildCount !== prevChildCountRef.current;

    // Check if initialSizes values actually changed (not just reference)
    const initialSizesChanged = initialSizes.length !== prevInitialSizesRef.current.length || initialSizes.some((size, idx) => size !== prevInitialSizesRef.current[idx]);

    // Apply initialSizes on:
    // 1. First mount
    // 2. When children count changes (panes added/removed)
    // 3. When initialSizes values actually change
    // This preserves user's drag-resized values when other props change
    if (isInitialMountRef.current || childCountChanged || initialSizesChanged) {
      initialSizes.forEach((size, idx) => {
        setPaneSize(idx, size);
      });
      isInitialMountRef.current = false;
      prevChildCountRef.current = currentChildCount;
      prevInitialSizesRef.current = initialSizes;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children, initialSizes]);

  const collapsedRef = useRef(collapsed);
  useEffect(() => {
    if (!containerRef.current) return;

    const collapsedChanged = collapsed.some((val, idx) => val !== collapsedRef.current[idx]);
    if (!collapsedChanged && collapsedRef.current.length === collapsed.length) {
      return;
    }

    collapsedRef.current = collapsed;

    collapsed.forEach((isCollapsed, idx) => {
      const pane = panes[idx];
      if (pane && pane.collapsed !== isCollapsed) {
        if (isCollapsed) {
          collapsePane(idx);
        } else {
          expandPane(idx);
        }
      }
    });
  }, [collapsed, panes, collapsePane, expandPane]);

  useEffect(() => {
    if (!containerRef.current) return;

    panes.forEach((pane, idx) => {
      const element = containerRef.current?.querySelector(`[data-pane-id="${pane.id}"]`) as HTMLElement | null;
      if (element) {
        const minSize = minSizes[idx];
        const maxSize = maxSizes[idx];
        if (minSize !== undefined) {
          element.setAttribute("data-min-size", String(minSizes[idx]));
        }
        if (maxSize !== undefined) {
          element.setAttribute("data-max-size", String(maxSizes[idx]));
        }
      }
    });
  }, [minSizes, maxSizes, panes]);

  useEffect(() => {
    if (!containerRef.current) return;

    const handlebars = containerRef.current.querySelectorAll(".a-split-handlebar");
    handlebars.forEach((handlebar, idx) => {
      const element = handlebar as HTMLElement;
      const handlebarIndex = idx + 1;

      const isDisabled = isHandlebarDisabled(handlebarIndex, disable);
      if (isDisabled) {
        element.classList.add("a-split-handlebar-disabled");
        element.style.cursor = "default";
      } else {
        element.classList.remove("a-split-handlebar-disabled");
        element.style.cursor = mode === "horizontal" ? "col-resize" : "row-resize";
      }

      const isVisible = isHandlebarVisible(handlebarIndex, visible);
      element.style.display = isVisible ? "" : "none";

      const isLinebar = isLineBarStyle(handlebarIndex, lineBar);
      if (isLinebar) {
        element.classList.add("a-split-handlebar-line");
      } else {
        element.classList.remove("a-split-handlebar-line");
      }
    });
  }, [disable, visible, lineBar, mode]);

  const { handleMouseDown } = useDragHandler(containerRef, mode, {
    onDragStart: (event) => {
      setDragState({ active: true, paneIndex: event.paneIndex });
      pluginManagerRef.current?.onDragStart(event);
      const pane = panes[event.paneIndex];
      if (pane) {
        onLayoutChange?.(event.paneIndex, pane.id, "dragging", null);
      }
    },
    onDragMove: (event) => {
      const shouldContinue = pluginManagerRef.current?.onDragMove(event) ?? true;
      if (shouldContinue) {
        onDragging?.(event.prevSize, event.nextSize, event.paneIndex);
      }
    },
    onDragEnd: (event) => {
      setPaneSize(event.paneIndex - 1, `${event.prevSize}%`);
      setPaneSize(event.paneIndex, `${event.nextSize}%`);
      setDragState(null);
      pluginManagerRef.current?.onDragEnd(event);
      onDragEnd?.(event.prevSize, event.nextSize, event.paneIndex);
      const pane = panes[event.paneIndex];
      if (pane) {
        onLayoutChange?.(event.paneIndex, pane.id, "dragged", null);
      }
    },
  });

  const handleCollapse = useCallback(
    (handlebarIndex: number, direction: "left" | "right") => {
      const paneIndexToCollapse = direction === "left" ? handlebarIndex - 1 : handlebarIndex;

      if (paneIndexToCollapse >= 0 && paneIndexToCollapse < panes.length) {
        collapsePane(paneIndexToCollapse, { direction });
        const pane = panes[paneIndexToCollapse];
        if (pane) {
          onLayoutChange?.(paneIndexToCollapse, pane.id, "close", direction);
        }
      }
    },
    [panes, collapsePane, onLayoutChange],
  );

  const handleExpand = useCallback(
    (handlebarIndex: number, direction: "left" | "right") => {
      const paneIndexToExpand = direction === "left" ? handlebarIndex - 1 : handlebarIndex;

      if (paneIndexToExpand >= 0 && paneIndexToExpand < panes.length) {
        expandPane(paneIndexToExpand, { direction });
        const pane = panes[paneIndexToExpand];
        if (pane) {
          onLayoutChange?.(paneIndexToExpand, pane.id, "open", direction);
        }
      }
    },
    [panes, expandPane, onLayoutChange],
  );

  useImperativeHandle(
    ref,
    () => ({
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
      getSnapshot: () => {
        const container = containerRef.current;
        const totalSize = container ? (mode === "horizontal" ? container.offsetWidth : container.offsetHeight) : 0;

        return {
          panes: panes.map((p) => ({ ...p })),
          totalSize,
          mode,
          timestamp: Date.now(),
        };
      },
      restore: (snapshot) => {
        if (snapshot.mode !== mode) {
          console.warn(`Cannot restore snapshot with different mode. Current: ${mode}, Snapshot: ${snapshot.mode}`);
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
    [addPane, removePane, togglePane, setPaneSize, getPaneState, removePanes, swapPanes, collapsePane, expandPane, resizePane, panes, mode],
  );

  const containerStyles = useMemo(() => {
    const baseStyles: React.CSSProperties = {
      display: "flex",
      flexDirection: mode === "horizontal" ? "row" : "column",
      width: width || "100%",
      height: height || "100%",
      overflow: "hidden",
      ...style,
    };
    return baseStyles;
  }, [mode, width, height, style]);

  const containerClass = useMemo(() => {
    const classes = ["a-split-container"];
    if (mode === "vertical") classes.push("a-split-vertical");
    if (fixClass || autoFixClass) classes.push("a-split-fix");

    if (dragState?.active) {
      classes.push("a-split-dragging");
    }

    if (className) classes.push(className);
    return classes.join(" ");
  }, [mode, fixClass, autoFixClass, className, dragState?.active]);

  const renderContent = () => {
    const elements: JSX.Element[] = [];

    panes.forEach((pane, index) => {
      const wrappedContent = <NestingProvider level={nestingLevel + 1}>{pane.content}</NestingProvider>;

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
          flexGrow={pane.flexGrow}
        />,
      );

      if (index < panes.length - 1) {
        const handlebarIndex = index + 1;
        const nextPane = panes[index + 1];
        if (!nextPane) return;

        const showHandlebar = shouldShowHandlebar(pane, nextPane);
        const isVisible = isHandlebarVisible(handlebarIndex, visible);
        const isLinebar = isLineBarStyle(handlebarIndex, lineBar);

        const leftPaneCollapsed = pane.collapsed || false;
        const rightPaneCollapsed = nextPane.collapsed || false;

        const explicitlyDisabled = isHandlebarDisabled(handlebarIndex, disable);
        const isDisabled = explicitlyDisabled || leftPaneCollapsed || rightPaneCollapsed;

        if (isVisible && showHandlebar) {
          const customHandle = pluginManagerRef.current?.renderHandle({
            index: handlebarIndex,
            mode,
            disabled: isDisabled,
            lineBar: isLinebar,
            onMouseDown: (e: React.MouseEvent | React.TouchEvent) => handleMouseDown(handlebarIndex, e),
          });

          if (customHandle) {
            elements.push(<React.Fragment key={`handlebar-${handlebarIndex}`}>{customHandle}</React.Fragment>);
          } else {
            elements.push(
              <DragHandle
                key={`handlebar-${handlebarIndex}`}
                index={handlebarIndex}
                mode={mode}
                disabled={isDisabled}
                lineBar={isLinebar}
                explicitlyDisabled={explicitlyDisabled}
                onMouseDown={(e: React.MouseEvent | React.TouchEvent) => handleMouseDown(handlebarIndex, e)}
                onCollapse={(direction: "left" | "right") => handleCollapse(handlebarIndex, direction)}
                onExpand={(direction: "left" | "right") => handleExpand(handlebarIndex, direction)}
                renderCustom={renderBar}
                leftPaneCollapsed={leftPaneCollapsed}
                rightPaneCollapsed={rightPaneCollapsed}
              />,
            );
          }
        }
      }
    });

    return elements;
  };

  return (
    <div ref={containerRef} id={id} className={containerClass} style={containerStyles}>
      {renderContent()}
    </div>
  );
});

Split.displayName = "Split";
