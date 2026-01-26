import React, { useState, useCallback, ReactNode } from 'react';
import { Pane, AddPaneConfig, AnimationOptions } from '../types';
import { animatePaneSize } from '../utils/paneOperations';

/**
 * usePaneManager - Manages pane state and operations
 *
 * This hook handles:
 * - Pane state management
 * - Add/remove operations
 * - Toggle collapse/expand
 * - Programmatic resize
 * - Size redistribution on pane removal
 *
 * @param children - React children to convert to panes
 * @param initialSizes - Initial size configuration
 * @param collapsed - Initial collapsed states
 * @param minSizes - Minimum sizes
 * @param maxSizes - Maximum sizes
 */
export function usePaneManager(
  children: ReactNode,
  initialSizes: string[] = [],
  collapsed: boolean[] = [],
  minSizes: number[] = [],
  maxSizes: number[] = [],
  splitId: string = 'split' // Unique ID for this Split instance
) {
  // Initialize panes from children
  const [panes, setPanes] = useState<Pane[]>(() => {
    const childArray = React.Children.toArray(children);

    return childArray.map((child, index) => ({
      // Use splitId prefix to ensure unique pane IDs across nested Splits
      id: `${splitId}-pane-${index}`,
      size: initialSizes[index] || '100%',
      collapsed: collapsed[index] || false,
      minSize: minSizes[index] || 0,
      maxSize: maxSizes[index] || 100,
      content: child,
    }));
  });

  /**
   * Add a new pane
   * Redistributes sizes to accommodate the new pane
   */
  const addPane = useCallback((config: AddPaneConfig) => {
    setPanes((prevPanes) => {
      const position = config.position ?? prevPanes.length;
      const newPane: Pane = {
        // Use splitId prefix to ensure unique pane IDs
        id: `${splitId}-pane-${Date.now()}`,
        size: config.size,
        collapsed: config.collapsed || false,
        minSize: config.minSize || 0,
        maxSize: config.maxSize || 100,
        content: config.content,
      };

      // Insert at position
      const newPanes = [...prevPanes];
      newPanes.splice(position, 0, newPane);

      // Redistribute sizes if needed
      return redistributeSizesOnAdd(newPanes, position, config.size);
    });
  }, [splitId]);

  /**
   * Remove a pane
   * Redistributes the removed pane's size to remaining panes
   */
  const removePane = useCallback((index: number) => {
    setPanes((prevPanes) => {
      if (index < 0 || index >= prevPanes.length) return prevPanes;

      const newPanes = [...prevPanes];
      const removedPane = newPanes.splice(index, 1)[0];

      // Redistribute the removed pane's size
      if (removedPane) {
        return redistributeSizesOnRemove(newPanes, removedPane.size);
      }
      return newPanes;
    });
  }, []);

  /**
   * Toggle pane collapse state
   * Uses direct DOM manipulation for performance
   */
  const togglePane = useCallback(
    (index: number) => {
      setPanes((prevPanes) => {
        if (index < 0 || index >= prevPanes.length) return prevPanes;

        const currentPane = prevPanes[index];
        if (!currentPane) return prevPanes;

        // Update React state
        const newPanes = [...prevPanes];
        newPanes[index] = {
          ...currentPane,
          collapsed: !currentPane.collapsed,
        };

        // PERFORMANCE: Also update DOM directly for immediate visual feedback
        // This preserves the v5 pattern of CSS-based state persistence
        const element = document.querySelector(
          `[data-pane-id="${currentPane.id}"]`
        ) as HTMLElement;

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
    },
    []
  );

  /**
   * Set pane size programmatically
   * Optionally with animation
   * Also clears flexGrow override since size is being explicitly set
   */
  const setPaneSize = useCallback(
    (index: number, size: string, options?: AnimationOptions) => {
      setPanes((prevPanes) => {
        if (index < 0 || index >= prevPanes.length) return prevPanes;

        const currentPane = prevPanes[index];
        if (!currentPane) return prevPanes;

        const newPanes = [...prevPanes];
        // Clear flexGrow when explicitly setting size (e.g., after drag)
        newPanes[index] = { ...currentPane, size, flexGrow: undefined };

        // Phase 5: Update DOM directly with animation support
        const element = document.querySelector(
          `[data-pane-id="${currentPane.id}"]`
        ) as HTMLElement;

        if (element) {
          // Use animatePaneSize utility for consistent animation behavior
          animatePaneSize(element, size, options || { animate: false });
        }

        return newPanes;
      });
    },
    []
  );

  /**
   * Get current pane state
   */
  const getPaneState = useCallback(() => panes, [panes]);

  /**
   * Remove multiple panes at once (Phase 4)
   */
  const removePanes = useCallback((indices: number[]) => {
    setPanes((prevPanes) => {
      // Sort indices in descending order to remove from end first
      const sortedIndices = [...indices].sort((a, b) => b - a);
      let newPanes = [...prevPanes];
      let totalRemovedSize = 0;

      // Remove all specified panes
      sortedIndices.forEach((index) => {
        if (index >= 0 && index < newPanes.length) {
          const removed = newPanes.splice(index, 1)[0];
          if (removed) {
            totalRemovedSize += parseFloat(removed.size) || 0;
          }
        }
      });

      // Redistribute removed size to remaining panes
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
   * Swap two panes (Phase 4)
   */
  const swapPanes = useCallback((indexA: number, indexB: number) => {
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
  }, []);

  /**
   * Collapse a pane (Phase 4/5 Enhanced with animation)
   * Uses React state to trigger re-render, Pane component handles styling
   *
   * Direction determines which adjacent pane grows to take the space:
   * - 'left' direction: collapsing left pane, so RIGHT/NEXT pane grows
   * - 'right' direction: collapsing right pane, so LEFT/PREV pane grows
   */
  const collapsePane = useCallback((index: number, options?: AnimationOptions & { direction?: 'left' | 'right' }) => {
    setPanes((prevPanes) => {
      if (index < 0 || index >= prevPanes.length) return prevPanes;

      const currentPane = prevPanes[index];
      if (!currentPane || currentPane.collapsed) return prevPanes;

      // Determine which adjacent pane should grow
      const direction = options?.direction;
      let adjacentIndex: number;

      if (direction === 'left') {
        // Collapsing left pane, next pane should grow
        adjacentIndex = index + 1;
      } else if (direction === 'right') {
        // Collapsing right pane, previous pane should grow
        adjacentIndex = index - 1;
      } else {
        // No direction specified, prefer next pane, fallback to previous
        adjacentIndex = index < prevPanes.length - 1 ? index + 1 : index - 1;
      }

      // Create new panes array with proper flexGrow values
      // Key: ONLY the adjacent pane gets flexGrow: 1, all others get flexGrow: 0
      const newPanes = prevPanes.map((pane, i) => {
        if (i === index) {
          // Collapsed pane: flexGrow 0
          return { ...pane, collapsed: true, flexGrow: 0 };
        } else if (i === adjacentIndex && !pane.collapsed) {
          // Adjacent pane that should grow: flexGrow 1
          return { ...pane, flexGrow: 1 };
        } else if (!pane.collapsed) {
          // Other open panes: flexGrow 0 to keep their size
          return { ...pane, flexGrow: 0 };
        }
        // Already collapsed panes stay as-is
        return pane;
      });

      // Animation support via DOM
      if (options?.animate) {
        const element = document.querySelector(
          `[data-pane-id="${currentPane.id}"]`
        ) as HTMLElement;
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
   * Expand a pane (Phase 4/5 Enhanced with animation)
   * Uses React state to trigger re-render, Pane component handles styling
   *
   * Direction determines which adjacent pane to adjust:
   * - 'left' direction: expanding left pane
   * - 'right' direction: expanding right pane
   */
  const expandPane = useCallback((index: number, options?: AnimationOptions & { direction?: 'left' | 'right' }) => {
    setPanes((prevPanes) => {
      if (index < 0 || index >= prevPanes.length) return prevPanes;

      const currentPane = prevPanes[index];
      if (!currentPane || !currentPane.collapsed) return prevPanes;

      // Count how many panes will be open after this expansion
      const openPaneCountAfter = prevPanes.filter(p => !p.collapsed).length + 1;
      const totalPanes = prevPanes.length;

      // Create new panes array with expanded pane
      let newPanes = [...prevPanes];
      newPanes[index] = { ...currentPane, collapsed: false, flexGrow: undefined };

      // If all panes will be open after this, reset ALL flexGrow values
      // This matches v5's reCheckPaneOpening behavior
      if (openPaneCountAfter === totalPanes) {
        newPanes = newPanes.map(pane => ({
          ...pane,
          flexGrow: undefined,
        }));
      } else {
        // Not all panes open yet - only reset the adjacent pane that was growing
        const direction = options?.direction;
        let adjacentIndex: number;

        if (direction === 'left') {
          adjacentIndex = index + 1;
        } else if (direction === 'right') {
          adjacentIndex = index - 1;
        } else {
          adjacentIndex = index < prevPanes.length - 1 ? index + 1 : index - 1;
        }

        // Reset adjacent pane's flexGrow
        if (adjacentIndex >= 0 && adjacentIndex < newPanes.length) {
          const adjacentPane = newPanes[adjacentIndex];
          if (adjacentPane && adjacentPane.flexGrow === 1) {
            newPanes[adjacentIndex] = { ...adjacentPane, flexGrow: undefined };
          }
        }
      }

      // Animation support via DOM
      if (options?.animate) {
        const element = document.querySelector(
          `[data-pane-id="${currentPane.id}"]`
        ) as HTMLElement;
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
   * Resize a pane by delta (Phase 4)
   */
  const resizePane = useCallback((index: number, delta: number) => {
    setPanes((prevPanes) => {
      if (index < 0 || index >= prevPanes.length) return prevPanes;

      const currentPane = prevPanes[index];
      if (!currentPane) return prevPanes;

      const currentSize = parseFloat(currentPane.size) || 0;
      const newSize = Math.max(
        currentPane.minSize || 0,
        Math.min(currentPane.maxSize || 100, currentSize + delta)
      );

      const newPanes = [...prevPanes];
      newPanes[index] = { ...currentPane, size: `${newSize}%` };

      // Update DOM
      const element = document.querySelector(
        `[data-pane-id="${currentPane.id}"]`
      ) as HTMLElement;
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
    // Phase 4: Enhanced operations
    removePanes,
    swapPanes,
    collapsePane,
    expandPane,
    resizePane,
  };
}

/**
 * Helper: Redistribute sizes when adding a pane
 */
function redistributeSizesOnAdd(
  panes: Pane[],
  addedIndex: number,
  addedSize: string
): Pane[] {
  // Parse added size
  const addedValue = parseFloat(addedSize);
  const isPercent = addedSize.includes('%');

  if (!isPercent) {
    // If adding fixed size (px), don't redistribute
    return panes;
  }

  // Reduce other panes proportionally
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
 * Helper: Redistribute sizes when removing a pane
 * Strategy: Equal distribution among remaining panes
 */
function redistributeSizesOnRemove(panes: Pane[], removedSize: string): Pane[] {
  if (panes.length === 0) return panes;

  const removedValue = parseFloat(removedSize);
  const isPercent = removedSize.includes('%');

  if (!isPercent) {
    // If removed pane was fixed size (px), don't redistribute
    return panes;
  }

  // Distribute removed size equally among remaining panes
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
 * Helper: Redistribute sizes proportionally (alternative strategy)
 * Can be swapped in for different behavior
 */
export function redistributeSizesProportional(
  panes: Pane[],
  removedSize: string
): Pane[] {
  if (panes.length === 0) return panes;

  const removedValue = parseFloat(removedSize);
  const isPercent = removedSize.includes('%');

  if (!isPercent) return panes;

  // Calculate total size of remaining panes
  const totalSize = panes.reduce((sum, pane) => {
    return sum + parseFloat(pane.size);
  }, 0);

  // Distribute proportionally based on current sizes
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
