import { Pane, AnimationOptions } from '../types';

/**
 * Applies collapse state styles directly to a pane element.
 *
 * @param element - The pane HTMLElement
 * @param collapsed - Whether the pane should be hidden
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
  }
}

/**
 * Animates a pane's size change using CSS transitions.
 *
 * @param element - The pane HTMLElement
 * @param targetSize - The target size string (e.g., "50%")
 * @param options - Animation configuration
 */
export function animatePaneSize(element: HTMLElement, targetSize: string, options: AnimationOptions = {}): Promise<void> {
  return new Promise((resolve) => {
    const duration = options.duration || 300;

    if (!options.animate) {
      element.style.flexBasis = targetSize;
      resolve();
      return;
    }

    element.style.transition = `flex-basis ${duration}ms ease`;
    element.offsetHeight; // force reflow
    element.style.flexBasis = targetSize;

    setTimeout(() => {
      element.style.transition = '';
      resolve();
    }, duration);
  });
}

/**
 * Returns a new pane object with the collapsed state toggled.
 */
export function togglePaneCollapse(pane: Pane): Pane {
  return {
    ...pane,
    collapsed: !pane.collapsed,
  };
}

/**
 * Finds the index of a pane within an array by its ID.
 */
export function findPaneIndex(panes: Pane[], id: string): number {
  return panes.findIndex((pane) => pane.id === id);
}

/**
 * Returns true if the pane is currently expanded.
 */
export function isPaneVisible(pane: Pane): boolean {
  return !pane.collapsed;
}

/**
 * Returns an array containing only the visible panes.
 */
export function getVisiblePanes(panes: Pane[]): Pane[] {
  return panes.filter(isPaneVisible);
}

/**
 * Retrieves a pane element from the DOM using its data attribute.
 */
export function getPaneElement(id: string): HTMLElement | null {
  return document.querySelector(`[data-pane-id="${id}"]`);
}

/**
 * Clamps a numeric size value between min and max bounds.
 */
export function constrainSize(value: number, minSize: number, maxSize: number): number {
  return Math.max(minSize, Math.min(maxSize, value));
}

/**
 * Factory function to create a new pane object with default values.
 */
export function createPane(id: string, size: string, content: React.ReactNode, options: Partial<Pane> = {}): Pane {
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
 * Returns a new pane object with an updated size.
 */
export function updatePaneSize(pane: Pane, newSize: string): Pane {
  return {
    ...pane,
    size: newSize,
  };
}

/**
 * Applies multiple updates to an array of panes based on their IDs.
 */
export function batchUpdatePanes(panes: Pane[], updates: Map<string, Partial<Pane>>): Pane[] {
  return panes.map((pane) => {
    const update = updates.get(pane.id);
    return update ? { ...pane, ...update } : pane;
  });
}

/**
 * Restores a pane's state from a saved persistence object.
 */
export function restorePaneState(pane: Pane, savedState: { id: string; size: string; collapsed: boolean }): Pane {
  return {
    ...pane,
    size: savedState.size,
    collapsed: savedState.collapsed,
  };
}

/**
 * serializes a pane's state into a persistence-friendly object.
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
 * Determines if a handlebar should be rendered between two panes.
 */
export function shouldShowHandlebar(_prevPane: Pane, _nextPane: Pane): boolean {
  return true;
}

/**
 * Calculates whether a specific handlebar should be interaction-disabled.
 */
export function isHandlebarDisabled(index: number, disable?: boolean | boolean[] | number[]): boolean {
  if (typeof disable === 'boolean') {
    return disable;
  }
  if (Array.isArray(disable)) {
    if (disable.length > 0 && typeof disable[0] === 'boolean') {
      return disable[index - 1] === true;
    }
    return (disable as number[]).includes(index);
  }
  return false;
}

/**
 * Calculates whether a specific handlebar should be visible in the DOM.
 */
export function isHandlebarVisible(index: number, visible?: boolean | boolean[] | number[]): boolean {
  if (typeof visible === 'boolean') {
    return visible;
  }
  if (Array.isArray(visible)) {
    if (visible.length > 0 && typeof visible[0] === 'boolean') {
      return visible[index - 1] !== false;
    }
    return (visible as number[]).includes(index);
  }
  return true;
}

/**
 * Calculates whether a handlebar should use the simplified line style.
 */
export function isLineBarStyle(index: number, lineBar?: boolean | boolean[] | number[]): boolean {
  if (typeof lineBar === 'boolean') {
    return lineBar;
  }
  if (Array.isArray(lineBar)) {
    if (lineBar.length > 0 && typeof lineBar[0] === 'boolean') {
      return lineBar[index - 1] === true;
    }
    return (lineBar as number[]).includes(index);
  }
  return false;
}
