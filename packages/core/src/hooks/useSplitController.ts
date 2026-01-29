import { useState, useCallback, useMemo, useRef } from 'react';
import { Pane, AddPaneConfig, AnimationOptions, SplitSnapshot, SplitControllerState, SplitControllerActions, UseSplitControllerOptions } from '../types';

/**
 * useSplitController
 *
 * Provides a React-friendly hook to manage the state of a Split layout externally.
 * Ideal for building custom UIs where panes need to be synchronized or manipulated
 * from outside the actual Split component boundary.
 *
 * @param options - Configuration for initializing the controller
 */
export function useSplitController(options: UseSplitControllerOptions = {}): SplitControllerState & SplitControllerActions {
  const { mode = 'horizontal', initialPanes = [], initialSizes = [], minSizes = [], maxSizes = [], onPaneChange } = options;

  const [panes, setPanesInternal] = useState<Pane[]>(() => {
    if (initialPanes.length > 0) {
      return initialPanes;
    }

    return initialSizes.map((size, idx) => ({
      id: `pane-${idx}`,
      size,
      collapsed: false,
      minSize: minSizes[idx] || 0,
      maxSize: maxSizes[idx] || 100,
      content: null,
    }));
  });

  const [isDragging] = useState(false);
  const isBatchUpdateRef = useRef(false);

  const setPanes = useCallback(
    (newPanes: Pane[] | ((prev: Pane[]) => Pane[])) => {
      setPanesInternal((prev) => {
        const updated = typeof newPanes === 'function' ? newPanes(prev) : newPanes;

        if (!isBatchUpdateRef.current && onPaneChange) {
          onPaneChange(updated);
        }

        return updated;
      });
    },
    [onPaneChange]
  );

  /**
   * Adds a new pane configuration to the controller state.
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
   * Removes a single pane by its index and redistributes sizes.
   */
  const removePane = useCallback(
    (index: number) => {
      setPanes((prevPanes) => {
        if (index < 0 || index >= prevPanes.length) return prevPanes;

        const newPanes = [...prevPanes];
        const removedPane = newPanes.splice(index, 1)[0];

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
   * Removes a batch of panes by their indices.
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
   * Toggles the collapse state for a specific pane.
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
   * Forces a pane into a collapsed state.
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
   * Forces a pane into an expanded state.
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
   * Explicitly sets the size string for a pane.
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
   * Swaps the ordering of two panes.
   */
  const swapPanes = useCallback(
    (indexA: number, indexB: number) => {
      setPanes((prevPanes) => {
        if (indexA < 0 || indexA >= prevPanes.length || indexB < 0 || indexB >= prevPanes.length || indexA === indexB) {
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
   * Returns a serializable snapshot of the current state.
   */
  const getSnapshot = useCallback((): SplitSnapshot => {
    return {
      panes: panes.map((p) => ({ ...p })),
      totalSize: 0,
      mode,
      timestamp: Date.now(),
    };
  }, [panes, mode]);

  /**
   * Restores the controller state from a snapshot.
   */
  const restore = useCallback(
    (snapshot: SplitSnapshot) => {
      if (snapshot.mode !== mode) {
        console.warn(`Cannot restore snapshot with different mode. Current: ${mode}, Snapshot: ${snapshot.mode}`);
        return;
      }

      isBatchUpdateRef.current = true;
      setPanes((prevPanes) =>
        snapshot.panes.map((snapshotPane, index) => {
          // Try to find matching pane by id, or use index as fallback
          const existingPane = prevPanes.find((p) => p.id === snapshotPane.id) || prevPanes[index];

          return {
            id: snapshotPane.id,
            size: snapshotPane.size,
            collapsed: snapshotPane.collapsed,
            // Preserve existing values, or use defaults if no matching pane found
            minSize: existingPane?.minSize ?? 0,
            maxSize: existingPane?.maxSize ?? 100,
            content: existingPane?.content ?? null,
          };
        })
      );
      isBatchUpdateRef.current = false;

      if (onPaneChange) {
        setPanesInternal((currentPanes) => {
          onPaneChange(currentPanes);
          return currentPanes;
        });
      }
    },
    [mode, setPanes, onPaneChange]
  );

  return useMemo(
    () => ({
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
    }),
    [panes, mode, isDragging, addPane, removePane, removePanes, togglePane, collapsePane, expandPane, setPaneSize, swapPanes, setPanes, getSnapshot, restore]
  );
}
