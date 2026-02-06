import { useState, useCallback, useMemo, useRef } from 'react';
import {
  Pane,
  AddPaneConfig,
  AnimationOptions,
  SplitSnapshot,
  SplitControllerState,
  SplitControllerActions,
  UseSplitControllerOptions,
  PaneRenderFunction,
} from '../types';
import {
  redistributeSizesOnAdd,
  redistributeSizesOnRemove,
  removePanesWithRedistribution,
} from '../utils/paneRedistribution';

/**
 * Internal pane state that includes optional render function for reactive content.
 */
interface InternalControllerPane extends Pane {
  /** Render function for reactive dynamic panes (via addPane with render) */
  renderFn?: PaneRenderFunction;
}

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

  const [panes, setPanesInternal] = useState<InternalControllerPane[]>(() => {
    if (initialPanes.length > 0) {
      return initialPanes.map((pane) => ({ ...pane }));
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
  const containerRefId = useRef<string | null>(null);

  /**
   * Sets the container ID for accurate pixel-to-percentage conversion.
   * Call this with the Split component's ID if you need accurate pixel sizing.
   */
  const setContainerId = useCallback((id: string) => {
    containerRefId.current = id;
  }, []);

  const setPanes = useCallback(
    (newPanes: Pane[] | ((prev: Pane[]) => Pane[])) => {
      setPanesInternal((prev) => {
        const updated = typeof newPanes === 'function' ? newPanes(prev) : newPanes;

        if (!isBatchUpdateRef.current && onPaneChange) {
          onPaneChange(updated);
        }

        return updated as InternalControllerPane[];
      });
    },
    [onPaneChange]
  );

  /**
   * Adds a new pane configuration to the controller state.
   *
   * Content can be provided in two ways:
   * - `content`: Static ReactNode, captured at call time (won't update with state changes)
   * - `render`: Function that returns ReactNode, called on every render (reactive to state)
   *
   * If both are provided, `render` takes precedence.
   *
   * **Note:** Pixel-based sizes (e.g., '200px') will be converted to percentages
   * to ensure proper space redistribution among existing panes.
   */
  const addPane = useCallback(
    (config: AddPaneConfig) => {
      // Get container size for accurate pixel -> percentage conversion
      let containerSize: number | undefined;
      if (containerRefId.current) {
        const container = document.getElementById(containerRefId.current);
        if (container) {
          containerSize = mode === 'horizontal' ? container.offsetWidth : container.offsetHeight;
        }
      }

      setPanesInternal((prevPanes) => {
        const position = config.position ?? prevPanes.length;

        // Determine content: render function takes precedence over static content
        const renderFn = config.render;
        const content = renderFn ? renderFn() : config.content;

        const newPane: InternalControllerPane = {
          id: `pane-${Date.now()}`,
          size: config.size,
          collapsed: config.collapsed || false,
          minSize: config.minSize || 0,
          maxSize: config.maxSize || 100,
          content,
          renderFn,
        };

        const newPanes = [...prevPanes];
        newPanes.splice(position, 0, newPane);

        // Redistribute sizes (handles pixel-to-percentage conversion)
        return redistributeSizesOnAdd(newPanes, position, config.size, containerSize) as InternalControllerPane[];
      });
    },
    [mode]
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

        if (removedPane) {
          return redistributeSizesOnRemove(newPanes, removedPane.size) as InternalControllerPane[];
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
        return removePanesWithRedistribution(prevPanes, indices) as InternalControllerPane[];
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
      panes: panes.map((p) => ({
        id: p.id,
        size: p.size,
        collapsed: p.collapsed,
        minSize: p.minSize,
        maxSize: p.maxSize,
        content: p.content,
      })),
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

  // Compute final panes with reactive content from render functions
  const computedPanes = useMemo(() => {
    return panes.map((pane) => {
      // If pane has a render function, call it to get current content
      if (pane.renderFn) {
        return {
          ...pane,
          content: pane.renderFn(),
        };
      }
      return pane;
    });
  }, [panes]);

  return useMemo(
    () => ({
      panes: computedPanes,
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
      // Additional utility for pixel-to-percentage conversion
      setContainerId,
    }),
    [computedPanes, mode, isDragging, addPane, removePane, removePanes, togglePane, collapsePane, expandPane, setPaneSize, swapPanes, setPanes, getSnapshot, restore, setContainerId]
  );
}
