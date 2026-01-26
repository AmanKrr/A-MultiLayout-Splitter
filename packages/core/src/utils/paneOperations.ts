import { Pane, AnimationOptions } from "../types";

/**
 * Updates DOM elements to reflect a pane's collapse state.
 */
export function applyCollapseState(element: HTMLElement, collapsed: boolean): void {
  if (collapsed) {
    element.classList.add("a-split-hidden");
    element.style.flexGrow = "0";
    element.style.flexShrink = "0";
    element.style.flexBasis = "0";
  } else {
    element.classList.remove("a-split-hidden");
    element.style.flexGrow = "";
    element.style.flexShrink = "";
  }
}

/**
 * Animates a pane's size change using CSS transitions.
 */
export function animatePaneSize(
  element: HTMLElement,
  targetSize: string,
  options: AnimationOptions = {},
): Promise<void> {
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
      element.style.transition = "";
      resolve();
    }, duration);
  });
}

export function togglePaneCollapse(pane: Pane): Pane {
  return { ...pane, collapsed: !pane.collapsed };
}

export function findPaneIndex(panes: Pane[], id: string): number {
  return panes.findIndex((pane) => pane.id === id);
}

export function isPaneVisible(pane: Pane): boolean {
  return !pane.collapsed;
}

export function getVisiblePanes(panes: Pane[]): Pane[] {
  return panes.filter(isPaneVisible);
}

export function getPaneElement(id: string): HTMLElement | null {
  return document.querySelector(`[data-pane-id="${id}"]`);
}

export function constrainSize(value: number, minSize: number, maxSize: number): number {
  return Math.max(minSize, Math.min(maxSize, value));
}

export function createPane(
  id: string,
  size: string,
  content: React.ReactNode,
  options: Partial<Pane> = {},
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

export function updatePaneSize(pane: Pane, newSize: string): Pane {
  return { ...pane, size: newSize };
}

export function batchUpdatePanes(panes: Pane[], updates: Map<string, Partial<Pane>>): Pane[] {
  return panes.map((pane) => {
    const update = updates.get(pane.id);
    return update ? { ...pane, ...update } : pane;
  });
}

export function restorePaneState(
  pane: Pane,
  savedState: { id: string; size: string; collapsed: boolean },
): Pane {
  return { ...pane, size: savedState.size, collapsed: savedState.collapsed };
}

export function serializePaneState(pane: Pane): {
  id: string;
  size: string;
  collapsed: boolean;
} {
  return { id: pane.id, size: pane.size, collapsed: pane.collapsed };
}

export function shouldShowHandlebar(_prevPane: Pane, _nextPane: Pane): boolean {
  return true;
}

/**
 * Resolves whether a specific handlebar (1-based index) is disabled based on prop config.
 */
export function isHandlebarDisabled(index: number, disable?: boolean | boolean[] | number[]): boolean {
  if (typeof disable === "boolean") return disable;
  if (Array.isArray(disable)) {
    if (typeof disable[0] === "boolean") return disable[index - 1] === true;
    return (disable as number[]).includes(index);
  }
  return false;
}

/**
 * Resolves whether a specific handlebar (1-based index) is visible based on prop config.
 */
export function isHandlebarVisible(index: number, visible?: boolean | boolean[] | number[]): boolean {
  if (typeof visible === "boolean") return visible;
  if (Array.isArray(visible)) {
    if (typeof visible[0] === "boolean") return visible[index - 1] !== false;
    return (visible as number[]).includes(index);
  }
  return true;
}

/**
 * Resolves whether a specific handlebar (1-based index) uses line styling.
 */
export function isLineBarStyle(index: number, lineBar?: boolean | boolean[] | number[]): boolean {
  if (typeof lineBar === "boolean") return lineBar;
  if (Array.isArray(lineBar)) {
    if (typeof lineBar[0] === "boolean") return lineBar[index - 1] === true;
    return (lineBar as number[]).includes(index);
  }
  return false;
}
