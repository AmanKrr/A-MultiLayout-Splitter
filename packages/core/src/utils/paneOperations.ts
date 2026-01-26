/**
 * Pane Operation Utilities
 *
 * These functions handle pane-level operations:
 * - Open/close/toggle operations
 * - State management helpers
 * - DOM manipulation utilities
 * - Animation helpers
 *
 * Refactored from v5 SplitUtils for better testability and composition
 */

import { Pane, AnimationOptions } from '../types';

/**
 * Apply collapse state to a pane element
 * Uses direct DOM manipulation for immediate visual feedback
 *
 * @param element - Pane DOM element
 * @param collapsed - Target collapsed state
 */
export function applyCollapseState(element: HTMLElement, collapsed: boolean): void {
  if (collapsed) {
    element.classList.add('a-split-hidden');
    element.style.flexGrow = '0';
    element.style.flexShrink = '0';
    element.style.flexBasis = '0';
  } else {
    element.classList.remove('a-split-hidden');
    element.style.flexGrow = '';
    element.style.flexShrink = '';
    // Note: flexBasis restored by pane manager based on saved size
  }
}

/**
 * Animate pane size change
 *
 * @param element - Pane DOM element
 * @param targetSize - Target size (e.g., "50%", "200px")
 * @param options - Animation configuration
 * @returns Promise that resolves when animation completes
 */
export function animatePaneSize(
  element: HTMLElement,
  targetSize: string,
  options: AnimationOptions = {}
): Promise<void> {
  return new Promise((resolve) => {
    const duration = options.duration || 300;

    if (!options.animate) {
      element.style.flexBasis = targetSize;
      resolve();
      return;
    }

    // Apply transition
    element.style.transition = `flex-basis ${duration}ms ease`;

    // Trigger reflow to ensure transition applies
    element.offsetHeight;

    // Set target size
    element.style.flexBasis = targetSize;

    // Clean up after animation
    setTimeout(() => {
      element.style.transition = '';
      resolve();
    }, duration);
  });
}

/**
 * Toggle pane collapse state
 *
 * @param pane - Pane to toggle
 * @returns New pane with toggled state
 */
export function togglePaneCollapse(pane: Pane): Pane {
  return {
    ...pane,
    collapsed: !pane.collapsed,
  };
}

/**
 * Find pane index by ID
 *
 * @param panes - Array of panes
 * @param id - Pane ID to find
 * @returns Index or -1 if not found
 */
export function findPaneIndex(panes: Pane[], id: string): number {
  return panes.findIndex((pane) => pane.id === id);
}

/**
 * Check if a pane is visible (not collapsed)
 *
 * @param pane - Pane to check
 * @returns True if visible
 */
export function isPaneVisible(pane: Pane): boolean {
  return !pane.collapsed;
}

/**
 * Get all visible panes
 *
 * @param panes - Array of panes
 * @returns Filtered array of visible panes
 */
export function getVisiblePanes(panes: Pane[]): Pane[] {
  return panes.filter(isPaneVisible);
}

/**
 * Get pane element by ID
 *
 * @param id - Pane ID
 * @returns HTML element or null
 */
export function getPaneElement(id: string): HTMLElement | null {
  return document.querySelector(`[data-pane-id="${id}"]`);
}

/**
 * Apply size constraints to a value
 *
 * @param value - Size value to constrain
 * @param minSize - Minimum allowed size
 * @param maxSize - Maximum allowed size
 * @returns Constrained value
 */
export function constrainSize(value: number, minSize: number, maxSize: number): number {
  return Math.max(minSize, Math.min(maxSize, value));
}

/**
 * Create a new pane with default values
 *
 * @param id - Pane ID
 * @param size - Initial size
 * @param content - React content
 * @returns New pane object
 */
export function createPane(
  id: string,
  size: string,
  content: React.ReactNode,
  options: Partial<Pane> = {}
): Pane {
  return {
    id,
    size,
    content,
    collapsed: options.collapsed ?? false,
    minSize: options.minSize ?? 0,
    maxSize: options.maxSize ?? 100,
  };
}

/**
 * Update pane size
 *
 * @param pane - Pane to update
 * @param newSize - New size value
 * @returns Updated pane
 */
export function updatePaneSize(pane: Pane, newSize: string): Pane {
  return {
    ...pane,
    size: newSize,
  };
}

/**
 * Batch update multiple panes
 *
 * @param panes - Array of panes
 * @param updates - Map of pane ID to updates
 * @returns Updated panes array
 */
export function batchUpdatePanes(
  panes: Pane[],
  updates: Map<string, Partial<Pane>>
): Pane[] {
  return panes.map((pane) => {
    const update = updates.get(pane.id);
    return update ? { ...pane, ...update } : pane;
  });
}

/**
 * Restore pane from saved state
 *
 * @param pane - Current pane
 * @param savedState - Saved state from localStorage
 * @returns Pane with restored state
 */
export function restorePaneState(
  pane: Pane,
  savedState: { id: string; size: string; collapsed: boolean }
): Pane {
  return {
    ...pane,
    size: savedState.size,
    collapsed: savedState.collapsed,
  };
}

/**
 * Serialize pane state for persistence
 *
 * @param pane - Pane to serialize
 * @returns Serializable state object
 */
export function serializePaneState(pane: Pane): {
  id: string;
  size: string;
  collapsed: boolean;
} {
  return {
    id: pane.id,
    size: pane.size,
    collapsed: pane.collapsed,
  };
}

/**
 * Check if handlebar should be shown between panes
 *
 * @param prevPane - Previous pane
 * @param nextPane - Next pane
 * @returns True if handlebar should be visible
 */
export function shouldShowHandlebar(_prevPane: Pane, _nextPane: Pane): boolean {
  // Always show handlebar - even when panes are collapsed
  // The handlebar needs to remain visible so users can expand collapsed panes
  // Drag functionality is disabled when panes are collapsed, but buttons still work
  return true;
}

/**
 * Calculate handlebar disable state
 *
 * @param index - Handlebar index (1-based)
 * @param disable - Disable configuration (boolean, array of booleans, or array of indices)
 * @returns True if this handlebar should be disabled
 */
export function isHandlebarDisabled(
  index: number,
  disable?: boolean | boolean[] | number[]
): boolean {
  if (typeof disable === 'boolean') {
    return disable;
  }
  if (Array.isArray(disable)) {
    // Check if it's an array of booleans or array of indices
    if (disable.length > 0 && typeof disable[0] === 'boolean') {
      // Array of booleans: disable[i] indicates if handlebar at index (i+1) is disabled
      // Handlebar indices are 1-based, so disable[0] corresponds to handlebar 1
      return disable[index - 1] === true;
    }
    // Array of indices: check if index is in the array
    return (disable as number[]).includes(index);
  }
  return false;
}

/**
 * Calculate handlebar visibility
 *
 * @param index - Handlebar index (1-based)
 * @param visible - Visibility configuration (boolean, array of booleans, or array of indices)
 * @returns True if this handlebar should be visible
 */
export function isHandlebarVisible(
  index: number,
  visible?: boolean | boolean[] | number[]
): boolean {
  if (typeof visible === 'boolean') {
    return visible;
  }
  if (Array.isArray(visible)) {
    // Check if it's an array of booleans or array of indices
    if (visible.length > 0 && typeof visible[0] === 'boolean') {
      // Array of booleans: visible[i] indicates if handlebar at index (i+1) is visible
      return visible[index - 1] !== false; // Default to visible if undefined
    }
    // Array of indices: check if index is in the array
    return (visible as number[]).includes(index);
  }
  return true; // Default to visible
}

/**
 * Check if handlebar should use line bar style
 *
 * @param index - Handlebar index (1-based)
 * @param lineBar - Line bar configuration (boolean, array of booleans, or array of indices)
 * @returns True if this handlebar should use line bar style
 */
export function isLineBarStyle(
  index: number,
  lineBar?: boolean | boolean[] | number[]
): boolean {
  if (typeof lineBar === 'boolean') {
    return lineBar;
  }
  if (Array.isArray(lineBar)) {
    // Check if it's an array of booleans or array of indices
    if (lineBar.length > 0 && typeof lineBar[0] === 'boolean') {
      // Array of booleans: lineBar[i] indicates if handlebar at index (i+1) uses line bar style
      return lineBar[index - 1] === true;
    }
    // Array of indices: check if index is in the array
    return (lineBar as number[]).includes(index);
  }
  return false;
}
