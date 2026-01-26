import { Pane, SplitMode } from '../types';
import { parseSize } from './sizeConversion';

/**
 * Calculates the total size of an array of panes.
 * 
 * @param panes - Array of pane configurations
 * @returns Total size and the unit of the first pane
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
      total += parsed.value;
    }
  }

  return { total, unit: firstParsed.unit };
}

/**
 * Validates pane size configurations against container constraints.
 * 
 * @param panes - Array of panes
 * @param _containerSize - Container size in pixels
 * @returns Object indicating validity and a list of errors
 */
export function validatePaneSizes(
  panes: Pane[],
  _containerSize: number
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (panes.length === 0) {
    errors.push('No panes defined');
    return { valid: false, errors };
  }

  const percentagePanes = panes.filter((p) => p.size.includes('%'));
  if (percentagePanes.length > 0) {
    const totalPercent = percentagePanes.reduce((sum, pane) => {
      return sum + parseFloat(pane.size);
    }, 0);

    if (totalPercent > 100.1) {
      errors.push(`Total percentage (${totalPercent}%) exceeds 100%`);
    }
  }

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
 * Calculates the appropriate flex-basis value for CSS layout.
 * 
 * @param size - Original size string
 * @param _containerSize - Container dimension in pixels
 * @returns Formatted CSS flex-basis value
 */
export function calculateFlexBasis(size: string, _containerSize: number): string {
  const parsed = parseSize(size);

  switch (parsed.unit) {
    case '%':
      return size;
    case 'px':
      return size;
    case 'vw':
      return `${(parsed.value / 100) * window.innerWidth}px`;
    case 'vh':
      return `${(parsed.value / 100) * window.innerHeight}px`;
    case 'fr':
      return '0';
    default:
      return `${parsed.value}px`;
  }
}

/**
 * Determines CSS flex-grow and flex-shrink values based on pane state.
 * 
 * @param pane - Pane configuration
 * @param isCollapsed - Whether the pane is currently hidden
 */
export function calculateFlexValues(
  pane: Pane,
  isCollapsed: boolean = false
): { flexGrow: number; flexShrink: number } {
  if (isCollapsed) {
    return { flexGrow: 0, flexShrink: 0 };
  }

  const parsed = parseSize(pane.size);

  if (parsed.unit === '%') {
    return { flexGrow: 1, flexShrink: 1 };
  }

  if (parsed.unit === 'fr') {
    return { flexGrow: parsed.value, flexShrink: 1 };
  }

  return { flexGrow: 0, flexShrink: 0 };
}

/**
 * Calculates the pixel position for a handlebar relative to its container.
 * 
 * @param prevPaneSize - Size of the pane preceding the handlebar
 * @param containerSize - Total dimension of the container
 * @param _mode - Layout orientation
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

  return parsed.value;
}

/**
 * Default size of the resize handlebar in pixels.
 */
export const HANDLEBAR_SIZE = 11;

/**
 * Calculates the operational dimensions of the split container.
 * 
 * @param element - Container DOM element
 * @param mode - Layout orientation
 * @param handlebarCount - Number of resize bars
 */
export function getContainerDimensions(
  element: HTMLElement,
  mode: SplitMode,
  handlebarCount: number = 0
): { width: number; height: number; primary: number; availableForPanes: number } {
  const width = element.offsetWidth;
  const height = element.offsetHeight;
  const primary = mode === 'horizontal' ? width : height;

  const handlebarSpace = handlebarCount * HANDLEBAR_SIZE;
  const availableForPanes = primary - handlebarSpace;

  return { width, height, primary, availableForPanes };
}

/**
 * Normalizes pane percentages so they sum exactly to 100%.
 */
export function normalizePaneSizes(panes: Pane[]): Pane[] {
  const percentagePanes = panes.filter((p) => p.size.includes('%'));

  if (percentagePanes.length === 0) {
    return panes;
  }

  const totalPercent = percentagePanes.reduce((sum, pane) => {
    return sum + parseFloat(pane.size);
  }, 0);

  if (Math.abs(totalPercent - 100) < 0.01) {
    return panes;
  }

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
 * Checks if a pane resize operation stays within its min/max limits.
 */
export function canResize(pane: Pane, currentSize: number, delta: number): boolean {
  const newSize = currentSize + delta;

  if (newSize < pane.minSize) return false;
  if (newSize > pane.maxSize) return false;

  return true;
}

/**
 * Retrieves the dimension property ('width' or 'height') associated with an orientation.
 */
export function getAxisProperty(mode: SplitMode): 'width' | 'height' {
  return mode === 'horizontal' ? 'width' : 'height';
}

/**
 * Retrieves the coordinate property ('clientX' or 'clientY') associated with an orientation.
 */
export function getCoordinateProperty(mode: SplitMode): 'clientX' | 'clientY' {
  return mode === 'horizontal' ? 'clientX' : 'clientY';
}
