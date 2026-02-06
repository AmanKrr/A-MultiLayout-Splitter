import React, { useState, useCallback, useRef, useLayoutEffect, ReactNode } from 'react';
import { PaneMetadata, Pane, AddPaneConfig, AnimationOptions, PaneRenderFunction, SplitMode } from '../types';
import { animatePaneSize } from '../utils/paneOperations';
import {
  redistributeSizesOnAdd,
  redistributeSizesOnRemove,
  removePanesWithRedistribution,
} from '../utils/paneRedistribution';

/**
 * Internal pane state that includes optional dynamic content.
 * Dynamic content is used for imperatively added panes (via addPane).
 * Declarative children always take precedence for their positions.
 */
interface InternalPaneState extends PaneMetadata {
  /** Static content for dynamically added panes (via addPane with content) */
  dynamicContent?: ReactNode;
  /** Render function for reactive dynamic panes (via addPane with render) */
  renderFn?: PaneRenderFunction;
  /** Whether this pane was added dynamically */
  isDynamic?: boolean;
}

/**
 * usePaneManager
 *
 * Internal hook responsible for managing the state and dynamic lifecycle of split panes.
 * It handles adding, removing, toggling, and resizing panes while maintaining
 * proportional size redistribution.
 *
 * IMPORTANT: This hook supports two patterns:
 * 1. Declarative (children-based) - Content derived from children prop, props always propagate
 * 2. Imperative (addPane with content) - Content stored in state for dynamic additions
 *
 * @param children - React children elements to be managed as panes
 * @param initialSizes - Array of starting size strings (e.g. "50%", "100px")
 * @param collapsed - Array indicating initial collapse state for each pane
 * @param minSizes - Array of minimum percentage constraints
 * @param maxSizes - Array of maximum percentage constraints
 * @param splitId - Unique identifier used for DOM attribution
 * @param mode - Layout orientation ('horizontal' or 'vertical')
 */
export function usePaneManager(
  children: ReactNode,
  initialSizes: string[] = [],
  collapsed: boolean[] = [],
  minSizes: number[] = [],
  maxSizes: number[] = [],
  splitId: string = 'split',
  mode: SplitMode = 'horizontal'
) {
  // Get children as stable array
  const childArray = React.Children.toArray(children);

  // Track previous children count to detect changes
  const prevChildCountRef = useRef(childArray.length);

  // Store pane state (metadata + optional dynamic content)
  const [paneStates, setPaneStates] = useState<InternalPaneState[]>(() => {
    return childArray.map((_, index) => ({
      id: `${splitId}-pane-${index}`,
      size: initialSizes[index] || '100%',
      collapsed: collapsed[index] || false,
      minSize: minSizes[index] || 0,
      maxSize: maxSizes[index] || 100,
      isDynamic: false,
    }));
  });

  // Sync pane count when declarative children count changes
  // Using useLayoutEffect to avoid flicker
  useLayoutEffect(() => {
    const prevCount = prevChildCountRef.current;
    const newCount = childArray.length;

    if (newCount !== prevCount) {
      setPaneStates((prevStates) => {
        // Count how many declarative (non-dynamic) panes we have
        const declarativePanes = prevStates.filter((p) => !p.isDynamic);
        const dynamicPanes = prevStates.filter((p) => p.isDynamic);

        if (newCount > declarativePanes.length) {
          // Children were added - create new declarative pane entries
          const newDeclarativePanes = [...declarativePanes];
          for (let i = declarativePanes.length; i < newCount; i++) {
            newDeclarativePanes.push({
              id: `${splitId}-pane-${Date.now()}-${i}`,
              size: initialSizes[i] || '100%',
              collapsed: collapsed[i] || false,
              minSize: minSizes[i] || 0,
              maxSize: maxSizes[i] || 100,
              isDynamic: false,
            });
          }
          // Merge: declarative panes first, then dynamic panes at their positions
          return mergePaneArrays(newDeclarativePanes, dynamicPanes, prevStates);
        } else if (newCount < declarativePanes.length) {
          // Children were removed - remove declarative pane entries from the end
          const newDeclarativePanes = declarativePanes.slice(0, newCount);
          return mergePaneArrays(newDeclarativePanes, dynamicPanes, prevStates);
        }

        return prevStates;
      });

      prevChildCountRef.current = newCount;
    }
  }, [childArray.length, splitId, initialSizes, collapsed, minSizes, maxSizes]);

  // Build final panes array by merging state with children content
  const panes: Pane[] = paneStates.map((state, index) => {
    // For dynamic panes, use render function (if available) or stored content
    // For declarative panes, derive content from children
    let content: ReactNode;

    if (state.isDynamic) {
      // Render function takes precedence - called on every render for reactive content
      if (state.renderFn) {
        content = state.renderFn();
      } else {
        content = state.dynamicContent;
      }
    } else {
      // Find the declarative child index for this pane
      const declarativeIndex = paneStates.slice(0, index).filter((p) => !p.isDynamic).length;
      content = childArray[declarativeIndex];
    }

    return {
      id: state.id,
      size: state.size,
      collapsed: state.collapsed,
      minSize: state.minSize,
      maxSize: state.maxSize,
      flexGrow: state.flexGrow,
      content,
    };
  });

  /**
   * Adds a new pane at the specified position.
   * The pane is marked as dynamic.
   *
   * Content can be provided in two ways:
   * - `content`: Static ReactNode, captured at call time (won't update with state changes)
   * - `render`: Function that returns ReactNode, called on every render (reactive to state)
   *
   * If both are provided, `render` takes precedence.
   */
  const addPane = useCallback(
    (config: AddPaneConfig) => {
      // Get container size for accurate pixel -> percentage conversion
      const container = document.getElementById(splitId);
      const containerSize = container
        ? mode === 'horizontal'
          ? container.offsetWidth
          : container.offsetHeight
        : undefined;

      setPaneStates((prevStates) => {
        const position = config.position ?? prevStates.length;
        const newPaneState: InternalPaneState = {
          id: `${splitId}-pane-${Date.now()}`,
          size: config.size,
          collapsed: config.collapsed || false,
          minSize: config.minSize || 0,
          maxSize: config.maxSize || 100,
          // Store render function if provided, otherwise store static content
          renderFn: config.render,
          dynamicContent: config.content,
          isDynamic: true,
        };

        const newStates = [...prevStates];
        newStates.splice(position, 0, newPaneState);

        return redistributeSizesOnAdd(newStates, position, config.size, containerSize) as InternalPaneState[];
      });
    },
    [splitId, mode]
  );

  /**
   * Removes a pane by its index and redistributes the freed space.
   */
  const removePane = useCallback((index: number) => {
    setPaneStates((prevStates) => {
      if (index < 0 || index >= prevStates.length) return prevStates;

      const newStates = [...prevStates];
      const removedPane = newStates.splice(index, 1)[0];

      if (removedPane) {
        return redistributeSizesOnRemove(newStates, removedPane.size) as InternalPaneState[];
      }
      return newStates;
    });
  }, []);

  /**
   * Toggles the visibility (collapse/expand) of a specific pane.
   */
  const togglePane = useCallback((index: number) => {
    setPaneStates((prevStates) => {
      if (index < 0 || index >= prevStates.length) return prevStates;

      const currentPane = prevStates[index];
      if (!currentPane) return prevStates;

      const newStates = [...prevStates];
      newStates[index] = {
        ...currentPane,
        collapsed: !currentPane.collapsed,
      };

      const element = document.querySelector(`[data-pane-id="${currentPane.id}"]`) as HTMLElement;

      if (element) {
        const updatedPane = newStates[index];
        const isCollapsed = updatedPane?.collapsed ?? false;

        if (isCollapsed) {
          element.classList.add('a-split-hidden');
          element.style.flexGrow = '0';
        } else {
          element.classList.remove('a-split-hidden');
          element.style.flexGrow = '';
        }
      }

      return newStates;
    });
  }, []);

  /**
   * Sets a pane's size and optionally triggers a CSS transition.
   */
  const setPaneSize = useCallback((index: number, size: string, options?: AnimationOptions) => {
    setPaneStates((prevStates) => {
      if (index < 0 || index >= prevStates.length) return prevStates;

      const currentPane = prevStates[index];
      if (!currentPane) return prevStates;

      const newStates = [...prevStates];
      newStates[index] = { ...currentPane, size, flexGrow: undefined };

      const element = document.querySelector(`[data-pane-id="${currentPane.id}"]`) as HTMLElement;

      if (element) {
        animatePaneSize(element, size, options || { animate: false });
      }

      return newStates;
    });
  }, []);

  /**
   * Helper to retrieve the current internal pane array (with content).
   */
  const getPaneState = useCallback(() => panes, [panes]);

  /**
   * Removes multiple panes by their indices simultaneously.
   */
  const removePanes = useCallback((indices: number[]) => {
    setPaneStates((prevStates) => {
      return removePanesWithRedistribution(prevStates, indices) as InternalPaneState[];
    });
  }, []);

  /**
   * Swaps the positions of two panes in the DOM order.
   */
  const swapPanes = useCallback((indexA: number, indexB: number) => {
    setPaneStates((prevStates) => {
      if (indexA < 0 || indexA >= prevStates.length || indexB < 0 || indexB >= prevStates.length || indexA === indexB) {
        return prevStates;
      }

      const newStates = [...prevStates];
      const temp = newStates[indexA];
      newStates[indexA] = newStates[indexB]!;
      newStates[indexB] = temp!;

      return newStates;
    });
  }, []);

  /**
   * Direct collapse method that optionally handles neighboring growth.
   */
  const collapsePane = useCallback((index: number, options?: AnimationOptions & { direction?: 'left' | 'right' }) => {
    setPaneStates((prevStates) => {
      if (index < 0 || index >= prevStates.length) return prevStates;

      const currentPane = prevStates[index];
      if (!currentPane || currentPane.collapsed) return prevStates;

      const direction = options?.direction;
      let adjacentIndex: number;

      if (direction === 'left') {
        adjacentIndex = index + 1;
      } else if (direction === 'right') {
        adjacentIndex = index - 1;
      } else {
        adjacentIndex = index < prevStates.length - 1 ? index + 1 : index - 1;
      }

      const newStates = prevStates.map((pane, i) => {
        if (i === index) {
          return { ...pane, collapsed: true, flexGrow: 0 };
        } else if (i === adjacentIndex && !pane.collapsed) {
          return { ...pane, flexGrow: 1 };
        } else if (!pane.collapsed) {
          return { ...pane, flexGrow: 0 };
        }
        return pane;
      });

      if (options?.animate) {
        const element = document.querySelector(`[data-pane-id="${currentPane.id}"]`) as HTMLElement;
        if (element) {
          element.style.transition = `flex-basis ${options.duration || 300}ms ease`;
          setTimeout(() => {
            element.style.transition = '';
          }, options.duration || 300);
        }
      }

      return newStates;
    });
  }, []);

  /**
   * Expands a previously collapsed pane back to its original size.
   */
  const expandPane = useCallback((index: number, options?: AnimationOptions & { direction?: 'left' | 'right' }) => {
    setPaneStates((prevStates) => {
      if (index < 0 || index >= prevStates.length) return prevStates;

      const currentPane = prevStates[index];
      if (!currentPane || !currentPane.collapsed) return prevStates;

      const openPaneCountAfter = prevStates.filter((p) => !p.collapsed).length + 1;
      const totalPanes = prevStates.length;

      let newStates = [...prevStates];
      newStates[index] = { ...currentPane, collapsed: false, flexGrow: undefined };

      if (openPaneCountAfter === totalPanes) {
        newStates = newStates.map((pane) => ({
          ...pane,
          flexGrow: undefined,
        }));
      } else {
        const direction = options?.direction;
        let adjacentIndex: number;

        if (direction === 'left') {
          adjacentIndex = index + 1;
        } else if (direction === 'right') {
          adjacentIndex = index - 1;
        } else {
          adjacentIndex = index < prevStates.length - 1 ? index + 1 : index - 1;
        }

        if (adjacentIndex >= 0 && adjacentIndex < newStates.length) {
          const adjacentPane = newStates[adjacentIndex];
          if (adjacentPane && adjacentPane.flexGrow === 1) {
            newStates[adjacentIndex] = { ...adjacentPane, flexGrow: undefined };
          }
        }
      }

      if (options?.animate) {
        const element = document.querySelector(`[data-pane-id="${currentPane.id}"]`) as HTMLElement;
        if (element) {
          element.style.transition = `flex-basis ${options.duration || 300}ms ease`;
          setTimeout(() => {
            element.style.transition = '';
          }, options.duration || 300);
        }
      }

      return newStates;
    });
  }, []);

  /**
   * Resizes a pane by a relative delta.
   */
  const resizePane = useCallback((index: number, delta: number) => {
    setPaneStates((prevStates) => {
      if (index < 0 || index >= prevStates.length) return prevStates;

      const currentPane = prevStates[index];
      if (!currentPane) return prevStates;

      const currentSize = parseFloat(currentPane.size) || 0;
      const newSize = Math.max(currentPane.minSize || 0, Math.min(currentPane.maxSize || 100, currentSize + delta));

      const newStates = [...prevStates];
      newStates[index] = { ...currentPane, size: `${newSize}%` };

      const element = document.querySelector(`[data-pane-id="${currentPane.id}"]`) as HTMLElement;
      if (element) {
        element.style.flexBasis = `${newSize}%`;
      }

      return newStates;
    });
  }, []);

  return {
    panes,
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
  };
}

/**
 * Merges declarative and dynamic pane arrays while preserving positions.
 */
function mergePaneArrays(
  declarativePanes: InternalPaneState[],
  dynamicPanes: InternalPaneState[],
  originalOrder: InternalPaneState[]
): InternalPaneState[] {
  // If no dynamic panes, just return declarative panes
  if (dynamicPanes.length === 0) {
    return declarativePanes;
  }

  // Rebuild the array preserving original positions where possible
  const result: InternalPaneState[] = [];
  let declIdx = 0;
  let dynIdx = 0;

  for (const original of originalOrder) {
    if (original.isDynamic) {
      const dynPane = dynamicPanes[dynIdx];
      if (dynPane) {
        result.push(dynPane);
        dynIdx++;
      }
    } else {
      const declPane = declarativePanes[declIdx];
      if (declPane) {
        result.push(declPane);
        declIdx++;
      }
    }
  }

  // Add any remaining panes
  for (let i = declIdx; i < declarativePanes.length; i++) {
    const pane = declarativePanes[i];
    if (pane) result.push(pane);
  }
  for (let i = dynIdx; i < dynamicPanes.length; i++) {
    const pane = dynamicPanes[i];
    if (pane) result.push(pane);
  }

  return result;
}

// Re-export for backwards compatibility
export { redistributeSizesProportional } from '../utils/paneRedistribution';
