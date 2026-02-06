import { parseSize } from './sizeConversion';

/**
 * Base interface for pane state that includes size information.
 * Both usePaneManager and useSplitController use compatible structures.
 */
export interface PaneWithSize {
  size: string;
}

/**
 * Redistributes percentage sizes when a new pane is added.
 * Scales down existing percentage panes proportionally to make room for the new pane.
 *
 * @param panes - Array of panes with size property
 * @param addedIndex - Index where the new pane was inserted
 * @param addedPercent - Percentage value of the added pane
 * @returns Updated panes array with redistributed sizes
 */
export function redistributePercentagePanes<T extends PaneWithSize>(
  panes: T[],
  addedIndex: number,
  addedPercent: number
): T[] {
  // Calculate total percentage of existing panes (excluding the newly added one)
  let totalExistingPercent = 0;
  const existingPanes: { index: number; percent: number }[] = [];

  panes.forEach((pane, i) => {
    if (i !== addedIndex) {
      const parsed = parseSize(pane.size);
      if (parsed.unit === '%') {
        totalExistingPercent += parsed.value;
        existingPanes.push({ index: i, percent: parsed.value });
      }
    }
  });

  // If no existing percentage panes, just return as is
  if (existingPanes.length === 0) {
    return panes;
  }

  // Calculate scale factor to shrink existing panes
  const targetTotal = 100 - addedPercent;
  const scaleFactor = targetTotal / totalExistingPercent;

  // Apply the scale factor
  return panes.map((pane, i) => {
    if (i === addedIndex) {
      return pane;
    }

    const parsed = parseSize(pane.size);
    if (parsed.unit === '%') {
      const newPercent = parsed.value * scaleFactor;
      return { ...pane, size: `${newPercent}%` };
    }

    return pane;
  });
}

/**
 * Redistributes sizes when a new pane is added.
 * Handles pixel-to-percentage conversion and proportional redistribution.
 *
 * For percentage-based added panes: scales down other percentage panes proportionally.
 * For pixel-based added panes: converts to percentage and redistributes.
 * For fr-based added panes: no redistribution needed (fr panes share remaining space naturally).
 *
 * @param panes - Current pane states
 * @param addedIndex - Index where the new pane was inserted
 * @param addedSize - Size string of the added pane (e.g., '200px', '30%', '1fr')
 * @param containerSize - Optional container size in pixels for accurate pixel->percent conversion
 * @returns Updated panes array with redistributed sizes
 */
export function redistributeSizesOnAdd<T extends PaneWithSize>(
  panes: T[],
  addedIndex: number,
  addedSize: string,
  containerSize?: number
): T[] {
  const parsed = parseSize(addedSize);
  const isPercent = parsed.unit === '%';
  const isPixel = parsed.unit === 'px';
  const isFr = parsed.unit === 'fr';

  // For fr panes, no redistribution needed
  if (isFr) {
    return panes;
  }

  // For pixel panes: convert to percentage if we have container size, then redistribute
  if (isPixel && containerSize && containerSize > 0) {
    // Calculate how much percentage the pixel size takes
    const pixelAsPercent = (parsed.value / containerSize) * 100;

    // Update the added pane to use percentage
    const updatedPanes = panes.map((pane, i) => {
      if (i === addedIndex) {
        return { ...pane, size: `${pixelAsPercent}%` };
      }
      return pane;
    });

    // Now redistribute as if it was a percentage pane
    return redistributePercentagePanes(updatedPanes, addedIndex, pixelAsPercent);
  }

  // For pixel panes without container size: shrink percentage panes proportionally
  if (isPixel) {
    const percentPanes = panes.filter((p, i) => i !== addedIndex && parseSize(p.size).unit === '%');
    if (percentPanes.length === 0) return panes;

    const totalPercent = percentPanes.reduce((sum, p) => sum + parseSize(p.size).value, 0);
    if (totalPercent <= 0) return panes;

    // Shrink all percentage panes by 20% to make room for the pixel pane
    // This is a heuristic - the actual sizing happens via flex layout
    const shrinkFactor = 0.8;

    return panes.map((pane, i) => {
      if (i === addedIndex) return pane;
      const paneParsed = parseSize(pane.size);
      if (paneParsed.unit !== '%') return pane;

      const newValue = paneParsed.value * shrinkFactor;
      return {
        ...pane,
        size: `${newValue}%`,
      };
    });
  }

  // For percentage panes: scale down other percentage panes
  if (isPercent) {
    return redistributePercentagePanes(panes, addedIndex, parsed.value);
  }

  return panes;
}

/**
 * Redistributes sizes among remaining panes when a pane is removed.
 * Only redistributes if the removed pane was percentage-based.
 *
 * @param panes - Remaining panes after removal
 * @param removedSize - Size string of the removed pane
 * @returns Updated panes array with redistributed sizes
 */
export function redistributeSizesOnRemove<T extends PaneWithSize>(
  panes: T[],
  removedSize: string
): T[] {
  if (panes.length === 0) return panes;

  const parsed = parseSize(removedSize);

  // Only redistribute for percentage panes
  if (parsed.unit !== '%') {
    return panes;
  }

  const distributionAmount = parsed.value / panes.length;

  return panes.map((pane) => {
    const paneParsed = parseSize(pane.size);
    if (paneParsed.unit !== '%') return pane;

    const newValue = paneParsed.value + distributionAmount;
    return {
      ...pane,
      size: `${newValue}%`,
    };
  });
}

/**
 * Redistributes pane sizes proportionally based on their current sizes.
 * Each pane gets a share of the removed size proportional to its current size.
 *
 * @param panes - Remaining panes after removal
 * @param removedSize - Size string of the removed pane
 * @returns Updated panes array with proportionally redistributed sizes
 */
export function redistributeSizesProportional<T extends PaneWithSize>(
  panes: T[],
  removedSize: string
): T[] {
  if (panes.length === 0) return panes;

  const parsed = parseSize(removedSize);

  // Only redistribute for percentage panes
  if (parsed.unit !== '%') return panes;

  const totalSize = panes.reduce((sum, pane) => {
    const paneParsed = parseSize(pane.size);
    return sum + (paneParsed.unit === '%' ? paneParsed.value : 0);
  }, 0);

  if (totalSize === 0) return panes;

  return panes.map((pane) => {
    const paneParsed = parseSize(pane.size);
    if (paneParsed.unit !== '%') return pane;

    const proportion = paneParsed.value / totalSize;
    const addition = parsed.value * proportion;
    const newValue = paneParsed.value + addition;

    return {
      ...pane,
      size: `${newValue}%`,
    };
  });
}

/**
 * Removes panes by indices and redistributes sizes.
 * Handles batch removal with proper size redistribution.
 *
 * @param panes - Current panes array
 * @param indices - Array of indices to remove
 * @returns Updated panes array with removed panes and redistributed sizes
 */
export function removePanesWithRedistribution<T extends PaneWithSize>(
  panes: T[],
  indices: number[]
): T[] {
  // Sort indices in descending order for safe removal
  const sortedIndices = [...indices].sort((a, b) => b - a);
  let newPanes = [...panes];
  let totalRemovedPercent = 0;

  sortedIndices.forEach((index) => {
    if (index >= 0 && index < newPanes.length) {
      const removed = newPanes.splice(index, 1)[0];
      if (removed) {
        const parsed = parseSize(removed.size);
        if (parsed.unit === '%') {
          totalRemovedPercent += parsed.value;
        }
      }
    }
  });

  if (newPanes.length > 0 && totalRemovedPercent > 0) {
    const redistributeAmount = totalRemovedPercent / newPanes.length;
    newPanes = newPanes.map((pane) => {
      const parsed = parseSize(pane.size);
      if (parsed.unit === '%') {
        return {
          ...pane,
          size: `${parsed.value + redistributeAmount}%`,
        };
      }
      return pane;
    });
  }

  return newPanes;
}
