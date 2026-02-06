import React, { useState, useCallback, ReactNode } from 'react';
import { PaneMetadata, Pane, AddPaneConfig, AnimationOptions } from '../types';
import { animatePaneSize } from '../utils/paneOperations';

/**
 * usePaneManager
 *
 * Internal hook responsible for managing the state and dynamic lifecycle of split panes.
 * It handles adding, removing, toggling, and resizing panes while maintaining
 * proportional size redistribution.
 *
 * IMPORTANT: This hook stores only pane metadata (size, collapsed, etc.) in state.
 * Content is NOT stored in state - it's derived from children prop at render time.
 * This ensures prop updates always propagate correctly to child components.
 *
 * @param children - React children elements to be managed as panes
 * @param initialSizes - Array of starting size strings (e.g. "50%", "100px")
 * @param collapsed - Array indicating initial collapse state for each pane
 * @param minSizes - Array of minimum percentage constraints
 * @param maxSizes - Array of maximum percentage constraints
 * @param splitId - Unique identifier used for DOM attribution
 */
export function usePaneManager(
  children: ReactNode,
  initialSizes: string[] = [],
  collapsed: boolean[] = [],
  minSizes: number[] = [],
  maxSizes: number[] = [],
  splitId: string = 'split'
) {
  // Store only metadata, not content
  const [paneMetadata, setPaneMetadata] = useState<PaneMetadata[]>(() => {
    const childArray = React.Children.toArray(children);

    return childArray.map((_, index) => ({
      id: `${splitId}-pane-${index}`,
      size: initialSizes[index] || '100%',
      collapsed: collapsed[index] || false,
      minSize: minSizes[index] || 0,
      maxSize: maxSizes[index] || 100,
    }));
  });

  // Get children as array for merging with metadata
  const childArray = React.Children.toArray(children);

  // Sync pane count when children count changes
  // This handles dynamic addition/removal of children
  if (childArray.length !== paneMetadata.length) {
    // If children were added
    if (childArray.length > paneMetadata.length) {
      const newMetadata = [...paneMetadata];
      for (let i = paneMetadata.length; i < childArray.length; i++) {
        newMetadata.push({
          id: `${splitId}-pane-${Date.now()}-${i}`,
          size: initialSizes[i] || '100%',
          collapsed: collapsed[i] || false,
          minSize: minSizes[i] || 0,
          maxSize: maxSizes[i] || 100,
        });
      }
      // Use setTimeout to avoid state update during render
      setTimeout(() => setPaneMetadata(newMetadata), 0);
    }
    // If children were removed
    else if (childArray.length < paneMetadata.length) {
      const newMetadata = paneMetadata.slice(0, childArray.length);
      setTimeout(() => setPaneMetadata(newMetadata), 0);
    }
  }

  // Merge metadata with children to create full Pane objects
  // This is computed on every render, ensuring children always have latest props
  const panes: Pane[] = paneMetadata.map((metadata, index) => ({
    ...metadata,
    content: childArray[index],
  }));

  /**
   * Adds a new pane at the specified position.
   * Note: For dynamically added panes, content must be managed externally
   * by updating the children prop.
   */
  const addPane = useCallback(
    (config: AddPaneConfig) => {
      setPaneMetadata((prevMetadata) => {
        const position = config.position ?? prevMetadata.length;
        const newMetadata: PaneMetadata = {
          id: `${splitId}-pane-${Date.now()}`,
          size: config.size,
          collapsed: config.collapsed || false,
          minSize: config.minSize || 0,
          maxSize: config.maxSize || 100,
        };

        const newPanes = [...prevMetadata];
        newPanes.splice(position, 0, newMetadata);

        return redistributeSizesOnAdd(newPanes, position, config.size);
      });
    },
    [splitId]
  );

  /**
   * Removes a pane by its index and redistributes the freed space.
   */
  const removePane = useCallback((index: number) => {
    setPaneMetadata((prevMetadata) => {
      if (index < 0 || index >= prevMetadata.length) return prevMetadata;

      const newPanes = [...prevMetadata];
      const removedPane = newPanes.splice(index, 1)[0];

      if (removedPane) {
        return redistributeSizesOnRemove(newPanes, removedPane.size);
      }
      return newPanes;
    });
  }, []);

  /**
   * Toggles the visibility (collapse/expand) of a specific pane.
   */
  const togglePane = useCallback((index: number) => {
    setPaneMetadata((prevMetadata) => {
      if (index < 0 || index >= prevMetadata.length) return prevMetadata;

      const currentPane = prevMetadata[index];
      if (!currentPane) return prevMetadata;

      const newPanes = [...prevMetadata];
      newPanes[index] = {
        ...currentPane,
        collapsed: !currentPane.collapsed,
      };

      const element = document.querySelector(`[data-pane-id="${currentPane.id}"]`) as HTMLElement;

      if (element) {
        const updatedPane = newPanes[index];
        const isCollapsed = updatedPane?.collapsed ?? false;

        if (isCollapsed) {
          element.classList.add('a-split-hidden');
          element.style.flexGrow = '0';
        } else {
          element.classList.remove('a-split-hidden');
          element.style.flexGrow = '';
        }
      }

      return newPanes;
    });
  }, []);

  /**
   * Sets a pane's size and optionally triggers a CSS transition.
   */
  const setPaneSize = useCallback((index: number, size: string, options?: AnimationOptions) => {
    setPaneMetadata((prevMetadata) => {
      if (index < 0 || index >= prevMetadata.length) return prevMetadata;

      const currentPane = prevMetadata[index];
      if (!currentPane) return prevMetadata;

      const newPanes = [...prevMetadata];
      newPanes[index] = { ...currentPane, size, flexGrow: undefined };

      const element = document.querySelector(`[data-pane-id="${currentPane.id}"]`) as HTMLElement;

      if (element) {
        animatePaneSize(element, size, options || { animate: false });
      }

      return newPanes;
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
    setPaneMetadata((prevMetadata) => {
      const sortedIndices = [...indices].sort((a, b) => b - a);
      let newPanes = [...prevMetadata];
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
  }, []);

  /**
   * Swaps the positions of two panes in the DOM order.
   */
  const swapPanes = useCallback((indexA: number, indexB: number) => {
    setPaneMetadata((prevMetadata) => {
      if (indexA < 0 || indexA >= prevMetadata.length || indexB < 0 || indexB >= prevMetadata.length || indexA === indexB) {
        return prevMetadata;
      }

      const newPanes = [...prevMetadata];
      const temp = newPanes[indexA];
      newPanes[indexA] = newPanes[indexB]!;
      newPanes[indexB] = temp!;

      return newPanes;
    });
  }, []);

  /**
   * Direct collapse method that optionally handles neighboring growth.
   */
  const collapsePane = useCallback((index: number, options?: AnimationOptions & { direction?: 'left' | 'right' }) => {
    setPaneMetadata((prevMetadata) => {
      if (index < 0 || index >= prevMetadata.length) return prevMetadata;

      const currentPane = prevMetadata[index];
      if (!currentPane || currentPane.collapsed) return prevMetadata;

      const direction = options?.direction;
      let adjacentIndex: number;

      if (direction === 'left') {
        adjacentIndex = index + 1;
      } else if (direction === 'right') {
        adjacentIndex = index - 1;
      } else {
        adjacentIndex = index < prevMetadata.length - 1 ? index + 1 : index - 1;
      }

      const newPanes = prevMetadata.map((pane, i) => {
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

      return newPanes;
    });
  }, []);

  /**
   * Expands a previously collapsed pane back to its original size.
   */
  const expandPane = useCallback((index: number, options?: AnimationOptions & { direction?: 'left' | 'right' }) => {
    setPaneMetadata((prevMetadata) => {
      if (index < 0 || index >= prevMetadata.length) return prevMetadata;

      const currentPane = prevMetadata[index];
      if (!currentPane || !currentPane.collapsed) return prevMetadata;

      const openPaneCountAfter = prevMetadata.filter((p) => !p.collapsed).length + 1;
      const totalPanes = prevMetadata.length;

      let newPanes = [...prevMetadata];
      newPanes[index] = { ...currentPane, collapsed: false, flexGrow: undefined };

      if (openPaneCountAfter === totalPanes) {
        newPanes = newPanes.map((pane) => ({
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
          adjacentIndex = index < prevMetadata.length - 1 ? index + 1 : index - 1;
        }

        if (adjacentIndex >= 0 && adjacentIndex < newPanes.length) {
          const adjacentPane = newPanes[adjacentIndex];
          if (adjacentPane && adjacentPane.flexGrow === 1) {
            newPanes[adjacentIndex] = { ...adjacentPane, flexGrow: undefined };
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

      return newPanes;
    });
  }, []);

  /**
   * Resizes a pane by a relative delta.
   */
  const resizePane = useCallback((index: number, delta: number) => {
    setPaneMetadata((prevMetadata) => {
      if (index < 0 || index >= prevMetadata.length) return prevMetadata;

      const currentPane = prevMetadata[index];
      if (!currentPane) return prevMetadata;

      const currentSize = parseFloat(currentPane.size) || 0;
      const newSize = Math.max(currentPane.minSize || 0, Math.min(currentPane.maxSize || 100, currentSize + delta));

      const newPanes = [...prevMetadata];
      newPanes[index] = { ...currentPane, size: `${newSize}%` };

      const element = document.querySelector(`[data-pane-id="${currentPane.id}"]`) as HTMLElement;
      if (element) {
        element.style.flexBasis = `${newSize}%`;
      }

      return newPanes;
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
 * Redistributes sizes among panes when a new pane is added.
 * @param panes The current array of pane metadata.
 * @param addedIndex The index where the new pane was added.
 * @param addedSize The size of the newly added pane.
 * @returns A new array of pane metadata with redistributed sizes.
 */
function redistributeSizesOnAdd(panes: PaneMetadata[], addedIndex: number, addedSize: string): PaneMetadata[] {
  const addedValue = parseFloat(addedSize);
  const isPercent = addedSize.includes('%');

  if (!isPercent) {
    return panes;
  }

  const remainingPanes = panes.filter((_, i) => i !== addedIndex);
  const totalOtherSize = remainingPanes.reduce((sum, pane) => {
    return sum + parseFloat(pane.size);
  }, 0);

  const scaleFactor = (100 - addedValue) / totalOtherSize;

  return panes.map((pane, i) => {
    if (i === addedIndex) return pane;

    const currentValue = parseFloat(pane.size);
    const newValue = currentValue * scaleFactor;

    return {
      ...pane,
      size: pane.size.includes('%') ? `${newValue}%` : pane.size,
    };
  });
}

/**
 * Redistributes sizes among remaining panes when a pane is removed.
 * @param panes The current array of pane metadata after removal.
 * @param removedSize The size of the pane that was removed.
 * @returns A new array of pane metadata with redistributed sizes.
 */
function redistributeSizesOnRemove(panes: PaneMetadata[], removedSize: string): PaneMetadata[] {
  if (panes.length === 0) return panes;

  const removedValue = parseFloat(removedSize);
  const isPercent = removedSize.includes('%');

  if (!isPercent) {
    return panes;
  }

  const distributionAmount = removedValue / panes.length;

  return panes.map((pane) => {
    if (!pane.size.includes('%')) return pane;

    const currentValue = parseFloat(pane.size);
    const newValue = currentValue + distributionAmount;

    return {
      ...pane,
      size: `${newValue}%`,
    };
  });
}

/**
 * Redistributes pane sizes proportionally based on their current sizes.
 */
export function redistributeSizesProportional(panes: PaneMetadata[], removedSize: string): PaneMetadata[] {
  if (panes.length === 0) return panes;

  const removedValue = parseFloat(removedSize);
  const isPercent = removedSize.includes('%');

  if (!isPercent) return panes;

  const totalSize = panes.reduce((sum, pane) => {
    return sum + parseFloat(pane.size);
  }, 0);

  return panes.map((pane) => {
    if (!pane.size.includes('%')) return pane;

    const currentValue = parseFloat(pane.size);
    const proportion = currentValue / totalSize;
    const addition = removedValue * proportion;
    const newValue = currentValue + addition;

    return {
      ...pane,
      size: `${newValue}%`,
    };
  });
}
