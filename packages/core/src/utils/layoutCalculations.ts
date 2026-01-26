/**
 * Layout Calculation Utilities
 *
 * These functions handle layout-related calculations:
 * - Container size validation
 * - Pane positioning
 * - Flex-based layout calculations
 * - Constraint validation
 *
 * Refactored from v5 SplitUtils for better testability
 */

import { Pane, SplitMode } from '../types';
import { parseSize } from './sizeConversion';

/**
 * Calculate total size of all panes
 *
 * @param panes - Array of panes
 * @returns Total size in the unit of the first pane (or 0 if empty)
 */
export function calculateTotalSize(panes: Pane[]): { total: number; unit: string } {
  if (panes.length === 0) return { total: 0, unit: 'px' };

  const firstPane = panes[0];
  if (!firstPane) return { total: 0, unit: 'px' };

  const firstParsed = parseSize(firstPane.size);
  let total = 0;

  for (const pane of panes) {
    const parsed = parseSize(pane.size);
    if (parsed.unit === firstParsed.unit) {
      total += parsed.value;
    } else {
      console.warn(
        `Mixed units detected: ${firstParsed.unit} and ${parsed.unit}. Results may be inaccurate.`
      );
      total += parsed.value; // Still add, but warn
    }
  }

  return { total, unit: firstParsed.unit };
}

/**
 * Validate that pane sizes don't exceed container constraints
 *
 * @param panes - Array of panes
 * @param _containerSize - Container size in pixels (reserved for future use)
 * @returns Validation result with any errors
 */
export function validatePaneSizes(
  panes: Pane[],
  _containerSize: number
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check for empty panes
  if (panes.length === 0) {
    errors.push('No panes defined');
    return { valid: false, errors };
  }

  // Calculate total percentage
  const percentagePanes = panes.filter((p) => p.size.includes('%'));
  if (percentagePanes.length > 0) {
    const totalPercent = percentagePanes.reduce((sum, pane) => {
      return sum + parseFloat(pane.size);
    }, 0);

    if (totalPercent > 100.1) {
      // Allow small floating point errors
      errors.push(`Total percentage (${totalPercent}%) exceeds 100%`);
    }
  }

  // Validate min/max constraints
  panes.forEach((pane, index) => {
    if (pane.minSize < 0) {
      errors.push(`Pane ${index}: minSize cannot be negative`);
    }
    if (pane.maxSize < pane.minSize) {
      errors.push(`Pane ${index}: maxSize (${pane.maxSize}) less than minSize (${pane.minSize})`);
    }
    if (pane.maxSize > 100) {
      errors.push(`Pane ${index}: maxSize (${pane.maxSize}%) exceeds 100%`);
    }
  });

  return { valid: errors.length === 0, errors };
}

/**
 * Calculate flex-basis value for a pane
 *
 * @param size - Size string (e.g., "50%", "200px", "1fr")
 * @param _containerSize - Container size in pixels (reserved for future use)
 * @returns Flex basis value with unit
 */
export function calculateFlexBasis(size: string, _containerSize: number): string {
  const parsed = parseSize(size);

  switch (parsed.unit) {
    case '%':
      return size; // Use as-is for percentages
    case 'px':
      return size; // Use as-is for pixels
    case 'vw':
      return `${(parsed.value / 100) * window.innerWidth}px`;
    case 'vh':
      return `${(parsed.value / 100) * window.innerHeight}px`;
    case 'fr':
      // For fr units, use 0 as flex-basis and let flexGrow handle the sizing
      return '0';
    default:
      return `${parsed.value}px`; // Fallback to pixels
  }
}

/**
 * Determine flex grow/shrink values for a pane
 *
 * @param pane - Pane configuration
 * @param isCollapsed - Whether pane is collapsed
 * @returns Object with flexGrow and flexShrink values
 */
export function calculateFlexValues(
  pane: Pane,
  isCollapsed: boolean = false
): { flexGrow: number; flexShrink: number } {
  if (isCollapsed) {
    return { flexGrow: 0, flexShrink: 0 };
  }

  const parsed = parseSize(pane.size);

  // Percentage-based panes can grow/shrink
  if (parsed.unit === '%') {
    return { flexGrow: 1, flexShrink: 1 };
  }

  // fr units should grow based on their fr value (e.g., 1fr = flexGrow: 1, 2fr = flexGrow: 2)
  if (parsed.unit === 'fr') {
    return { flexGrow: parsed.value, flexShrink: 1 };
  }

  // Fixed-size panes don't grow/shrink
  return { flexGrow: 0, flexShrink: 0 };
}

/**
 * Calculate handlebar position between two panes
 *
 * @param prevPaneSize - Size of previous pane
 * @param containerSize - Total container size
 * @param _mode - Split orientation (reserved for future use)
 * @returns Position in pixels
 */
export function calculateHandlebarPosition(
  prevPaneSize: string,
  containerSize: number,
  _mode: SplitMode
): number {
  const parsed = parseSize(prevPaneSize);

  if (parsed.unit === '%') {
    return (parsed.value / 100) * containerSize;
  }

  if (parsed.unit === 'px') {
    return parsed.value;
  }

  if (parsed.unit === 'vw') {
    return (parsed.value / 100) * window.innerWidth;
  }

  if (parsed.unit === 'vh') {
    return (parsed.value / 100) * window.innerHeight;
  }

  return parsed.value; // Fallback
}

/**
 * Handlebar total size (1px line + 5px margin on each side)
 */
export const HANDLEBAR_SIZE = 11;

/**
 * Calculate container dimensions based on mode
 *
 * @param element - Container element
 * @param mode - Split orientation
 * @param handlebarCount - Number of handlebars (optional, for accurate pane space calculation)
 * @returns Object with width and height
 */
export function getContainerDimensions(
  element: HTMLElement,
  mode: SplitMode,
  handlebarCount: number = 0
): { width: number; height: number; primary: number; availableForPanes: number } {
  const width = element.offsetWidth;
  const height = element.offsetHeight;
  const primary = mode === 'horizontal' ? width : height;

  // Calculate space available for panes (subtract handlebar space)
  const handlebarSpace = handlebarCount * HANDLEBAR_SIZE;
  const availableForPanes = primary - handlebarSpace;

  return { width, height, primary, availableForPanes };
}

/**
 * Adjust pane sizes to fit container exactly
 * Useful when total doesn't equal 100% due to rounding
 *
 * @param panes - Array of panes
 * @returns Adjusted panes with sizes that sum to 100%
 */
export function normalizePaneSizes(panes: Pane[]): Pane[] {
  const percentagePanes = panes.filter((p) => p.size.includes('%'));

  if (percentagePanes.length === 0) {
    return panes; // No percentage panes to normalize
  }

  const totalPercent = percentagePanes.reduce((sum, pane) => {
    return sum + parseFloat(pane.size);
  }, 0);

  // If already close to 100%, no adjustment needed
  if (Math.abs(totalPercent - 100) < 0.01) {
    return panes;
  }

  // Calculate adjustment factor
  const adjustmentFactor = 100 / totalPercent;

  return panes.map((pane) => {
    if (!pane.size.includes('%')) return pane;

    const currentValue = parseFloat(pane.size);
    const newValue = currentValue * adjustmentFactor;

    return {
      ...pane,
      size: `${newValue}%`,
    };
  });
}

/**
 * Check if a pane can be resized
 *
 * @param pane - Pane to check
 * @param currentSize - Current size percentage
 * @param delta - Change amount (positive or negative)
 * @returns True if resize is allowed
 */
export function canResize(pane: Pane, currentSize: number, delta: number): boolean {
  const newSize = currentSize + delta;

  if (newSize < pane.minSize) return false;
  if (newSize > pane.maxSize) return false;

  return true;
}

/**
 * Get the axis property name for a given mode
 *
 * @param mode - Split orientation
 * @returns 'width' for horizontal, 'height' for vertical
 */
export function getAxisProperty(mode: SplitMode): 'width' | 'height' {
  return mode === 'horizontal' ? 'width' : 'height';
}

/**
 * Get the coordinate property for a given mode
 *
 * @param mode - Split orientation
 * @returns 'clientX' for horizontal, 'clientY' for vertical
 */
export function getCoordinateProperty(mode: SplitMode): 'clientX' | 'clientY' {
  return mode === 'horizontal' ? 'clientX' : 'clientY';
}
