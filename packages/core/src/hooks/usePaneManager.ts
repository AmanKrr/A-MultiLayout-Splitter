import React, { useState, useCallback, ReactNode } from "react";
import { Pane, AddPaneConfig, AnimationOptions } from "../types";
import { animatePaneSize } from "../utils/paneOperations";

/**
 * usePaneManager
 * Manages the state and layout of splinter panes.
 */
export function usePaneManager(
  children: ReactNode,
  initialSizes: string[] = [],
  collapsed: boolean[] = [],
  minSizes: number[] = [],
  maxSizes: number[] = [],
  splitId: string = "split",
) {
  const [panes, setPanes] = useState<Pane[]>(() => {
    const childArray = React.Children.toArray(children);

    return childArray.map((child, index) => ({
      id: `${splitId}-pane-${index}`,
      size: initialSizes[index] || "100%",
      collapsed: collapsed[index] || false,
      minSize: minSizes[index] || 0,
      maxSize: maxSizes[index] || 100,
      content: child,
    }));
  });

  const addPane = useCallback(
    (config: AddPaneConfig) => {
      setPanes((prevPanes) => {
        const position = config.position ?? prevPanes.length;
        const newPane: Pane = {
          id: `${splitId}-pane-${Date.now()}`,
          size: config.size,
          collapsed: config.collapsed || false,
          minSize: config.minSize || 0,
          maxSize: config.maxSize || 100,
          content: config.content,
        };

        const newPanes = [...prevPanes];
        newPanes.splice(position, 0, newPane);

        return redistributeSizesOnAdd(newPanes, position, config.size);
      });
    },
    [splitId],
  );

  const removePane = useCallback((index: number) => {
    setPanes((prevPanes) => {
      if (index < 0 || index >= prevPanes.length) return prevPanes;

      const newPanes = [...prevPanes];
      const removedPane = newPanes.splice(index, 1)[0];

      if (removedPane) {
        return redistributeSizesOnRemove(newPanes, removedPane.size);
      }
      return newPanes;
    });
  }, []);

  const togglePane = useCallback((index: number) => {
    setPanes((prevPanes) => {
      if (index < 0 || index >= prevPanes.length) return prevPanes;

      const currentPane = prevPanes[index];
      if (!currentPane) return prevPanes;

      const newPanes = [...prevPanes];
      newPanes[index] = {
        ...currentPane,
        collapsed: !currentPane.collapsed,
      };

      // Direct DOM update for immediate feedback and state persistence
      const element = document.querySelector(`[data-pane-id="${currentPane.id}"]`) as HTMLElement;

      if (element) {
        const updatedPane = newPanes[index];
        const isCollapsed = updatedPane?.collapsed ?? false;

        if (isCollapsed) {
          element.classList.add("a-split-hidden");
          element.style.flexGrow = "0";
        } else {
          element.classList.remove("a-split-hidden");
          element.style.flexGrow = "";
        }
      }

      return newPanes;
    });
  }, []);

  const setPaneSize = useCallback((index: number, size: string, options?: AnimationOptions) => {
    setPanes((prevPanes) => {
      if (index < 0 || index >= prevPanes.length) return prevPanes;

      const currentPane = prevPanes[index];
      if (!currentPane) return prevPanes;

      const newPanes = [...prevPanes];
      newPanes[index] = { ...currentPane, size, flexGrow: undefined };

      const element = document.querySelector(`[data-pane-id="${currentPane.id}"]`) as HTMLElement;

      if (element) {
        animatePaneSize(element, size, options || { animate: false });
      }

      return newPanes;
    });
  }, []);

  const getPaneState = useCallback(() => panes, [panes]);

  const removePanes = useCallback((indices: number[]) => {
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
  }, []);

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
   * Collapses a pane and makes the adjacent pane grow to fill the gap.
   */
  const collapsePane = useCallback(
    (index: number, options?: AnimationOptions & { direction?: "left" | "right" }) => {
      setPanes((prevPanes) => {
        if (index < 0 || index >= prevPanes.length) return prevPanes;

        const currentPane = prevPanes[index];
        if (!currentPane || currentPane.collapsed) return prevPanes;

        const direction = options?.direction;
        let adjacentIndex: number;

        if (direction === "left") {
          adjacentIndex = index + 1;
        } else if (direction === "right") {
          adjacentIndex = index - 1;
        } else {
          adjacentIndex = index < prevPanes.length - 1 ? index + 1 : index - 1;
        }

        const newPanes = prevPanes.map((pane, i) => {
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
              element.style.transition = "";
            }, options.duration || 300);
          }
        }

        return newPanes;
      });
    },
    [],
  );

  const expandPane = useCallback(
    (index: number, options?: AnimationOptions & { direction?: "left" | "right" }) => {
      setPanes((prevPanes) => {
        if (index < 0 || index >= prevPanes.length) return prevPanes;

        const currentPane = prevPanes[index];
        if (!currentPane || !currentPane.collapsed) return prevPanes;

        const openPaneCountAfter = prevPanes.filter((p) => !p.collapsed).length + 1;
        const totalPanes = prevPanes.length;

        let newPanes = [...prevPanes];
        newPanes[index] = { ...currentPane, collapsed: false, flexGrow: undefined };

        if (openPaneCountAfter === totalPanes) {
          newPanes = newPanes.map((pane) => ({ ...pane, flexGrow: undefined }));
        } else {
          const direction = options?.direction;
          let adjacentIndex: number;

          if (direction === "left") {
            adjacentIndex = index + 1;
          } else if (direction === "right") {
            adjacentIndex = index - 1;
          } else {
            adjacentIndex = index < prevPanes.length - 1 ? index + 1 : index - 1;
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
              element.style.transition = "";
            }, options.duration || 300);
          }
        }

        return newPanes;
      });
    },
    [],
  );

  const resizePane = useCallback((index: number, delta: number) => {
    setPanes((prevPanes) => {
      if (index < 0 || index >= prevPanes.length) return prevPanes;

      const currentPane = prevPanes[index];
      if (!currentPane) return prevPanes;

      const currentSize = parseFloat(currentPane.size) || 0;
      const newSize = Math.max(
        currentPane.minSize || 0,
        Math.min(currentPane.maxSize || 100, currentSize + delta),
      );

      const newPanes = [...prevPanes];
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
 * Redistributes sizes proportionally after adding a pane.
 */
function redistributeSizesOnAdd(panes: Pane[], addedIndex: number, addedSize: string): Pane[] {
  const addedValue = parseFloat(addedSize);
  const isPercent = addedSize.includes("%");

  if (!isPercent) return panes;

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
      size: pane.size.includes("%") ? `${newValue}%` : pane.size,
    };
  });
}

/**
 * Redistributes size equally among remaining panes after removal.
 */
function redistributeSizesOnRemove(panes: Pane[], removedSize: string): Pane[] {
  if (panes.length === 0) return panes;

  const removedValue = parseFloat(removedSize);
  const isPercent = removedSize.includes("%");

  if (!isPercent) return panes;

  const distributionAmount = removedValue / panes.length;

  return panes.map((pane) => {
    if (!pane.size.includes("%")) return pane;

    const currentValue = parseFloat(pane.size);
    const newValue = currentValue + distributionAmount;

    return {
      ...pane,
      size: `${newValue}%`,
    };
  });
}

/**
 * Redistributes size proportionally after removal.
 */
export function redistributeSizesProportional(panes: Pane[], removedSize: string): Pane[] {
  if (panes.length === 0) return panes;

  const removedValue = parseFloat(removedSize);
  const isPercent = removedSize.includes("%");

  if (!isPercent) return panes;

  const totalSize = panes.reduce((sum, pane) => {
    return sum + parseFloat(pane.size);
  }, 0);

  return panes.map((pane) => {
    if (!pane.size.includes("%")) return pane;

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
