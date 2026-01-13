/**
 * useSplitController Hook (Phase 4)
 *
 * Provides a hook-based API for complete control over split pane state.
 * This is the most flexible API for advanced use cases where you need
 * full control over pane state outside of the Split component.
 *
 * @example
 * ```tsx
 * function App() {
 *   const {
 *     panes,
 *     addPane,
 *     removePane,
 *     togglePane,
 *     setPaneSize,
 *   } = useSplitController({
 *     mode: 'horizontal',
 *     initialPanes: [
 *       { id: '1', size: '50%', content: <div>Pane 1</div> },
 *       { id: '2', size: '50%', content: <div>Pane 2</div> },
 *     ],
 *   });
 *
 *   return (
 *     <>
 *       <Toolbar onAddPane={() => addPane({ size: '200px', content: <div>New</div> })} />
 *       <Split panes={panes} mode="horizontal">
 *         {panes.map(pane => (
 *           <PaneComponent key={pane.id} {...pane} />
 *         ))}
 *       </Split>
 *     </>
 *   );
 * }
 * ```
 */

import { useState, useCallback, useMemo, useRef } from 'react';
import {
  Pane,
  AddPaneConfig,
  AnimationOptions,
  SplitSnapshot,
  SplitControllerState,
  SplitControllerActions,
  UseSplitControllerOptions,
} from '../types';

/**
 * Hook for controlling split pane state
 */
export function useSplitController(
  options: UseSplitControllerOptions = {}
): SplitControllerState & SplitControllerActions {
  const {
    mode = 'horizontal',
    initialPanes = [],
    initialSizes = [],
    minSizes = [],
    maxSizes = [],
    onPaneChange,
  } = options;

  // Initialize panes from options
  const [panes, setPanesInternal] = useState<Pane[]>(() => {
    if (initialPanes.length > 0) {
      return initialPanes;
    }

    // Create default panes from initialSizes
    return initialSizes.map((size, idx) => ({
      id: `pane-${idx}`,
      size,
      collapsed: false,
      minSize: minSizes[idx] || 0,
      maxSize: maxSizes[idx] || 100,
      content: null,
    }));
  });

  // Track drag state
  const [isDragging] = useState(false);

  // Internal ref to track if we're in a batch update
  const isBatchUpdateRef = useRef(false);

  // Wrapper for setPanes that calls onPaneChange
  const setPanes = useCallback(
    (newPanes: Pane[] | ((prev: Pane[]) => Pane[])) => {
      setPanesInternal((prev) => {
        const updated = typeof newPanes === 'function' ? newPanes(prev) : newPanes;

        // Call onPaneChange callback if not in batch update
        if (!isBatchUpdateRef.current && onPaneChange) {
          onPaneChange(updated);
        }

        return updated;
      });
    },
    [onPaneChange]
  );

  /**
   * Add a new pane
   */
  const addPane = useCallback(
    (config: AddPaneConfig) => {
      setPanes((prevPanes) => {
        const position = config.position ?? prevPanes.length;
        const newPane: Pane = {
          id: `pane-${Date.now()}`,
          size: config.size,
          collapsed: config.collapsed || false,
          minSize: config.minSize || 0,
          maxSize: config.maxSize || 100,
          content: config.content,
        };

        const newPanes = [...prevPanes];
        newPanes.splice(position, 0, newPane);

        return newPanes;
      });
    },
    [setPanes]
  );

  /**
   * Remove a pane by index
   */
  const removePane = useCallback(
    (index: number) => {
      setPanes((prevPanes) => {
        if (index < 0 || index >= prevPanes.length) return prevPanes;

        const newPanes = [...prevPanes];
        const removedPane = newPanes.splice(index, 1)[0];

        // Redistribute removed pane's size
        if (removedPane && newPanes.length > 0) {
          const removedSize = parseFloat(removedPane.size) || 0;
          const redistributeAmount = removedSize / newPanes.length;

          return newPanes.map((pane) => ({
            ...pane,
            size: `${(parseFloat(pane.size) || 0) + redistributeAmount}%`,
          }));
        }

        return newPanes;
      });
    },
    [setPanes]
  );

  /**
   * Remove multiple panes
   */
  const removePanes = useCallback(
    (indices: number[]) => {
      setPanes((prevPanes) => {
        const sortedIndices = [...indices].sort((a, b) => b - a);
        let newPanes = [...prevPanes];
        let totalRemovedSize = 0;

        sortedIndices.forEach((index) => {
          if (index >= 0 && index < newPanes.length) {
            const removed = newPanes.splice(index, 1)[0];
            if (removed) {
              totalRemovedSize += parseFloat(removed.size) || 0;
            }
          }
        });

        if (newPanes.length > 0 && totalRemovedSize > 0) {
          const redistributeAmount = totalRemovedSize / newPanes.length;
          newPanes = newPanes.map((pane) => ({
            ...pane,
            size: `${(parseFloat(pane.size) || 0) + redistributeAmount}%`,
          }));
        }

        return newPanes;
      });
    },
    [setPanes]
  );

  /**
   * Toggle pane collapse state
   */
  const togglePane = useCallback(
    (index: number) => {
      setPanes((prevPanes) => {
        if (index < 0 || index >= prevPanes.length) return prevPanes;

        const pane = prevPanes[index];
        if (!pane) return prevPanes;

        const newPanes = [...prevPanes];
        newPanes[index] = {
          ...pane,
          collapsed: !pane.collapsed,
        };

        return newPanes;
      });
    },
    [setPanes]
  );

  /**
   * Collapse a pane
   */
  const collapsePane = useCallback(
    (index: number) => {
      setPanes((prevPanes) => {
        if (index < 0 || index >= prevPanes.length) return prevPanes;

        const pane = prevPanes[index];
        if (!pane || pane.collapsed) return prevPanes;

        const newPanes = [...prevPanes];
        newPanes[index] = { ...pane, collapsed: true };

        return newPanes;
      });
    },
    [setPanes]
  );

  /**
   * Expand a pane
   */
  const expandPane = useCallback(
    (index: number) => {
      setPanes((prevPanes) => {
        if (index < 0 || index >= prevPanes.length) return prevPanes;

        const pane = prevPanes[index];
        if (!pane || !pane.collapsed) return prevPanes;

        const newPanes = [...prevPanes];
        newPanes[index] = { ...pane, collapsed: false };

        return newPanes;
      });
    },
    [setPanes]
  );

  /**
   * Set pane size programmatically
   */
  const setPaneSize = useCallback(
    (index: number, size: string, _options?: AnimationOptions) => {
      setPanes((prevPanes) => {
        if (index < 0 || index >= prevPanes.length) return prevPanes;

        const pane = prevPanes[index];
        if (!pane) return prevPanes;

        const newPanes = [...prevPanes];
        newPanes[index] = { ...pane, size };

        return newPanes;
      });
    },
    [setPanes]
  );

  /**
   * Swap two panes
   */
  const swapPanes = useCallback(
    (indexA: number, indexB: number) => {
      setPanes((prevPanes) => {
        if (
          indexA < 0 ||
          indexA >= prevPanes.length ||
          indexB < 0 ||
          indexB >= prevPanes.length ||
          indexA === indexB
        ) {
          return prevPanes;
        }

        const newPanes = [...prevPanes];
        const temp = newPanes[indexA];
        newPanes[indexA] = newPanes[indexB]!;
        newPanes[indexB] = temp!;

        return newPanes;
      });
    },
    [setPanes]
  );

  /**
   * Get a snapshot of the current state
   */
  const getSnapshot = useCallback((): SplitSnapshot => {
    return {
      panes: panes.map((p) => ({ ...p })),
      totalSize: 0, // Will be calculated by the component
      mode,
      timestamp: Date.now(),
    };
  }, [panes, mode]);

  /**
   * Restore from a snapshot
   */
  const restore = useCallback(
    (snapshot: SplitSnapshot) => {
      if (snapshot.mode !== mode) {
        console.warn(
          `Cannot restore snapshot with different mode. Current: ${mode}, Snapshot: ${snapshot.mode}`
        );
        return;
      }

      // Batch update to avoid multiple onPaneChange calls
      isBatchUpdateRef.current = true;
      setPanes(snapshot.panes.map((p) => ({ ...p })));
      isBatchUpdateRef.current = false;

      // Call onPaneChange once after batch update
      if (onPaneChange) {
        onPaneChange(snapshot.panes);
      }
    },
    [mode, setPanes, onPaneChange]
  );

  // Memoize the return value to avoid unnecessary re-renders
  return useMemo(
    () => ({
      // State
      panes,
      mode,
      isDragging,
      // Actions
      addPane,
      removePane,
      removePanes,
      togglePane,
      collapsePane,
      expandPane,
      setPaneSize,
      swapPanes,
      setPanes,
      getSnapshot,
      restore,
    }),
    [
      panes,
      mode,
      isDragging,
      addPane,
      removePane,
      removePanes,
      togglePane,
      collapsePane,
      expandPane,
      setPaneSize,
      swapPanes,
      setPanes,
      getSnapshot,
      restore,
    ]
  );
}
