import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import type { SplitProps, SplitRef, SplitState, SplitAction } from "../types";
import { usePaneManager } from "../hooks/usePaneManager";
import { useDragHandler } from "../hooks/useDragHandler";
import { usePersistence } from "../hooks/usePersistence";
import { usePluginContext } from "../hooks/usePluginContext";
import {
  isHandlebarDisabled,
  isHandlebarVisible,
  isLineBarStyle,
  shouldShowHandlebar,
} from "../utils/paneOperations";
import { useNestingLevel, NestingProvider } from "../contexts/NestingContext";
import { DragHandle } from "./DragHandle";
import { Pane } from "./Pane";
import { PluginManager } from "../plugins/PluginManager";
import "../styles/split.css";

/**
 * Split Component
 * High-performance split pane with drag-to-resize functionality.
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
    if (process.env.NODE_ENV === "production") return;
    const childCount = React.Children.toArray(children).length;

    if (initialSizes.length > 0) {
      if (initialSizes.length !== childCount) console.warn(`[Split] initialSizes length mismatch: expected ${childCount}`);
      let totalPct = 0;
      initialSizes.forEach((s, i) => {
        const v = parseFloat(s);
        if (isNaN(v)) console.warn(`[Split] Invalid size at index ${i}: "${s}"`);
        if (s.includes("%")) {
          if (v < 0 || v > 100) console.warn(`[Split] Percentage at index ${i} out of range (0-100)`);
          totalPct += v;
        }
      });
      if (totalPct > 100.1) console.warn(`[Split] Total percentage (${totalPct}%) exceeds 100%`);
    }

    if (collapsed.length > 0 && collapsed.length !== childCount) {
      console.warn(`[Split] collapsed length mismatch: expected ${childCount}`);
    }

    minSizes.forEach((min, i) => {
      const max = maxSizes[i];
      if (max !== undefined && min > max) console.warn(`[Split] index ${i}: minSize (${min}) > maxSize (${max})`);
      if (min < 0 || min > 100) console.warn(`[Split] minSize at index ${i} out of range`);
    });
    maxSizes.forEach((max, i) => {
      if (max < 0 || max > 100) console.warn(`[Split] maxSize at index ${i} out of range`);
    });
  }, [initialSizes, minSizes, maxSizes, collapsed, children]);

  const {
    panes,
    addPane,
    removePane,
    togglePane,
    setPaneSize,
    removePanes,
    swapPanes,
    collapsePane,
    expandPane,
    resizePane,
  } = usePaneManager(children, initialSizes, collapsed, minSizes, maxSizes, id);

  const [dragState, setDragState] = useState<{ active: boolean; paneIndex: number } | null>(null);

  useEffect(() => {
    if (dragState?.active) {
      document.body.classList.add("a-split-body-dragging");
      document.body.classList.add(
        mode === "horizontal" ? "a-split-body-dragging-horizontal" : "a-split-body-dragging-vertical",
      );
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

  const getState = useCallback(
    (): SplitState => ({
      panes,
      mode,
      dragState: dragState as any,
    }),
    [panes, mode, dragState],
  );

  const dispatch = useCallback(
    (action: SplitAction) => {
      switch (action.type) {
        case "ADD_PANE": addPane(action.payload); break;
        case "REMOVE_PANE": removePane(action.payload); break;
        case "TOGGLE_PANE": togglePane(action.payload); break;
        case "SET_PANE_SIZE": setPaneSize(action.payload.index, action.payload.size); break;
        case "RESTORE_STATE":
          action.payload.panes.forEach((p, i) => {
            setPaneSize(i, p.size);
            if (p.collapsed) togglePane(i);
          });
          break;
        case "ADJUST_PANE_SIZE":
          if (dragState?.paneIndex != null) {
            const p = panes[dragState.paneIndex];
            if (p) {
              const cur = parseFloat(p.size);
              const delta = action.payload.direction === "grow" ? action.payload.amount : -action.payload.amount;
              const next = Math.max(p.minSize || 0, Math.min(p.maxSize || 100, cur + delta));
              setPaneSize(dragState.paneIndex, `${next}%`);
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
    const saved = persistence.load();
    if (saved && saved.length === panes.length) {
      saved.forEach((s, i) => {
        if (panes[i] && s.id === panes[i].id) {
          setPaneSize(i, s.size);
          if (s.collapsed !== panes[i].collapsed) togglePane(i);
        }
      });
    }
  }, []);

  useEffect(() => {
    persistence.save(panes);
  }, [panes, persistence]);

  useEffect(() => {
    if (initialSizes.length > 0) {
      initialSizes.forEach((size, idx) => setPaneSize(idx, size));
    }
  }, [initialSizes]);

  const collapsedRef = useRef(collapsed);
  useEffect(() => {
    const changed = collapsed.some((val, idx) => val !== collapsedRef.current[idx]);
    if (!changed && collapsedRef.current.length === collapsed.length) return;

    collapsedRef.current = collapsed;
    collapsed.forEach((isCollapsed, idx) => {
      const pane = panes[idx];
      if (pane && pane.collapsed !== isCollapsed) {
        isCollapsed ? collapsePane(idx) : expandPane(idx);
      }
    });
  }, [collapsed, panes, collapsePane, expandPane]);

  useEffect(() => {
    panes.forEach((pane, idx) => {
      const el = containerRef.current?.querySelector(`[data-pane-id="${pane.id}"]`) as HTMLElement | null;
      if (el) {
        if (minSizes[idx] !== undefined) el.setAttribute("data-min-size", String(minSizes[idx]));
        if (maxSizes[idx] !== undefined) el.setAttribute("data-max-size", String(maxSizes[idx]));
      }
    });
  }, [minSizes, maxSizes, panes]);

  useEffect(() => {
    if (!containerRef.current) return;
    const bars = containerRef.current.querySelectorAll(".a-split-handlebar");
    bars.forEach((bar, idx) => {
      const el = bar as HTMLElement;
      const hIdx = idx + 1;
      const isDisabled = isHandlebarDisabled(hIdx, disable);
      el.classList.toggle("a-split-handlebar-disabled", isDisabled);
      el.style.cursor = isDisabled ? "default" : mode === "horizontal" ? "col-resize" : "row-resize";
      el.style.display = isHandlebarVisible(hIdx, visible) ? "" : "none";
      el.classList.toggle("a-split-handlebar-line", isLineBarStyle(hIdx, lineBar));
    });
  }, [disable, visible, lineBar, mode]);

  const { handleMouseDown } = useDragHandler(containerRef, mode, {
    onDragStart: (e) => {
      setDragState({ active: true, paneIndex: e.paneIndex });
      pluginManagerRef.current?.onDragStart(e);
      onLayoutChange?.(e.paneIndex, panes[e.paneIndex]?.id || "", "dragging", null);
    },
    onDragMove: (e) => {
      if (pluginManagerRef.current?.onDragMove(e) ?? true) {
        onDragging?.(e.prevSize, e.nextSize, e.paneIndex);
      }
    },
    onDragEnd: (e) => {
      setPaneSize(e.paneIndex - 1, `${e.prevSize}%`);
      setPaneSize(e.paneIndex, `${e.nextSize}%`);
      setDragState(null);
      pluginManagerRef.current?.onDragEnd(e);
      onDragEnd?.(e.prevSize, e.nextSize, e.paneIndex);
      onLayoutChange?.(e.paneIndex, panes[e.paneIndex]?.id || "", "dragged", null);
    },
  });

  const handleCollapse = useCallback(
    (hIdx: number, dir: "left" | "right") => {
      const idx = dir === "left" ? hIdx - 1 : hIdx;
      if (idx >= 0 && idx < panes.length) {
        collapsePane(idx, { direction: dir });
        onLayoutChange?.(idx, panes[idx]!.id, "close", dir);
      }
    },
    [panes, collapsePane, onLayoutChange],
  );

  const handleExpand = useCallback(
    (hIdx: number, dir: "left" | "right") => {
      const idx = dir === "left" ? hIdx - 1 : hIdx;
      if (idx >= 0 && idx < panes.length) {
        expandPane(idx, { direction: dir });
        onLayoutChange?.(idx, panes[idx]!.id, "open", dir);
      }
    },
    [panes, expandPane, onLayoutChange],
  );

  useImperativeHandle(ref, () => ({
    addPane,
    removePane,
    togglePane,
    setPaneSize,
    getPaneState: () => panes,
    removePanes,
    swapPanes,
    collapsePane,
    expandPane,
    resizePane,
    getSnapshot: () => {
      const totalSize = containerRef.current
        ? mode === "horizontal" ? containerRef.current.offsetWidth : containerRef.current.offsetHeight
        : 0;
      return { panes: panes.map((p) => ({ ...p })), totalSize, mode, timestamp: Date.now() };
    },
    restore: (snap) => {
      if (snap.mode === mode) {
        snap.panes.forEach((p, i) => {
          if (panes[i]) {
            setPaneSize(i, p.size);
            if (p.collapsed !== panes[i].collapsed) togglePane(i);
          }
        });
      }
    },
  }), [addPane, removePane, togglePane, setPaneSize, removePanes, swapPanes, collapsePane, expandPane, resizePane, panes, mode]);

  const containerStyles = useMemo(
    (): React.CSSProperties => ({
      display: "flex",
      flexDirection: mode === "horizontal" ? "row" : "column",
      width: width || "100%",
      height: height || "100%",
      overflow: "hidden",
      ...style,
    }),
    [mode, width, height, style],
  );

  const containerClass = useMemo(() => {
    return [
      "a-split-container",
      mode === "vertical" ? "a-split-vertical" : "",
      (fixClass || autoFixClass) ? "a-split-fix" : "",
      dragState?.active ? "a-split-dragging" : "",
      className,
    ].filter(Boolean).join(" ");
  }, [mode, fixClass, autoFixClass, className, dragState?.active]);

  const renderContent = () => {
    const els: JSX.Element[] = [];
    panes.forEach((p, i) => {
      els.push(
        <Pane
          key={p.id}
          id={p.id}
          size={p.size}
          collapsed={p.collapsed}
          minSize={p.minSize}
          maxSize={p.maxSize}
          mode={mode}
          content={<NestingProvider level={nestingLevel + 1}>{p.content}</NestingProvider>}
          flexGrow={p.flexGrow}
        />,
      );

      if (i < panes.length - 1) {
        const hIdx = i + 1;
        const next = panes[i + 1]!;
        const show = shouldShowHandlebar(p, next);
        const visibleBar = isHandlebarVisible(hIdx, visible);
        const barLine = isLineBarStyle(hIdx, lineBar);
        const expDisabled = isHandlebarDisabled(hIdx, disable);
        const compositeDisabled = expDisabled || p.collapsed || next.collapsed;

        if (visibleBar && show) {
          const custom = pluginManagerRef.current?.renderHandle({
            index: hIdx,
            mode,
            disabled: compositeDisabled,
            lineBar: barLine,
            onMouseDown: (e) => handleMouseDown(hIdx, e),
          });

          els.push(
            custom ? (
              <React.Fragment key={`handlebar-${hIdx}`}>{custom}</React.Fragment>
            ) : (
              <DragHandle
                key={`handlebar-${hIdx}`}
                index={hIdx}
                mode={mode}
                disabled={compositeDisabled}
                lineBar={barLine}
                explicitlyDisabled={expDisabled}
                onMouseDown={(e) => handleMouseDown(hIdx, e)}
                onCollapse={(dir) => handleCollapse(hIdx, dir)}
                onExpand={(dir) => handleExpand(hIdx, dir)}
                renderCustom={renderBar}
                leftPaneCollapsed={p.collapsed || false}
                rightPaneCollapsed={next.collapsed || false}
              />
            ),
          );
        }
      }
    });
    return els;
  };

  return (
    <div ref={containerRef} id={id} className={containerClass} style={containerStyles}>
      {renderContent()}
    </div>
  );
});

Split.displayName = "Split";
