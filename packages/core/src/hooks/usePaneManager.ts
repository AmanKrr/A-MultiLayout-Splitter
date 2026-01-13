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
  maxSizes: number[] = []
) {
  // Initialize panes from children
  const [panes, setPanes] = useState<Pane[]>(() => {
    const childArray = React.Children.toArray(children);

    return childArray.map((child, index) => ({
      id: `pane-${index}`,
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
        id: `pane-${Date.now()}`,
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
  }, []);

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
   */
  const setPaneSize = useCallback(
    (index: number, size: string, options?: AnimationOptions) => {
      setPanes((prevPanes) => {
        if (index < 0 || index >= prevPanes.length) return prevPanes;

        const currentPane = prevPanes[index];
        if (!currentPane) return prevPanes;

        const newPanes = [...prevPanes];
        newPanes[index] = { ...currentPane, size };

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
   */
  const collapsePane = useCallback((index: number, options?: AnimationOptions) => {
    setPanes((prevPanes) => {
      if (index < 0 || index >= prevPanes.length) return prevPanes;

      const currentPane = prevPanes[index];
      if (!currentPane || currentPane.collapsed) return prevPanes;

      const newPanes = [...prevPanes];
      newPanes[index] = { ...currentPane, collapsed: true };

      // Phase 5: Update DOM with animation support
      const element = document.querySelector(
        `[data-pane-id="${currentPane.id}"]`
      ) as HTMLElement;

      if (element) {
        if (options?.animate) {
          element.style.transition = `flex-basis ${options.duration || 300}ms ease`;
          setTimeout(() => {
            element.style.transition = '';
          }, options.duration || 300);
        }

        element.classList.add('a-split-hidden');
        element.style.flexGrow = '0';
        element.style.flexBasis = '0';
      }

      return newPanes;
    });
  }, []);

  /**
   * Expand a pane (Phase 4/5 Enhanced with animation)
   */
  const expandPane = useCallback((index: number, options?: AnimationOptions) => {
    setPanes((prevPanes) => {
      if (index < 0 || index >= prevPanes.length) return prevPanes;

      const currentPane = prevPanes[index];
      if (!currentPane || !currentPane.collapsed) return prevPanes;

      const newPanes = [...prevPanes];
      newPanes[index] = { ...currentPane, collapsed: false };

      // Phase 5: Update DOM with animation support
      const element = document.querySelector(
        `[data-pane-id="${currentPane.id}"]`
      ) as HTMLElement;

      if (element) {
        if (options?.animate) {
          element.style.transition = `flex-basis ${options.duration || 300}ms ease`;
          setTimeout(() => {
            element.style.transition = '';
          }, options.duration || 300);
        }

        element.classList.remove('a-split-hidden');
        element.style.flexGrow = '';
        element.style.flexBasis = currentPane.size;
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
