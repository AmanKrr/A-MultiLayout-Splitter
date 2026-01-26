import { Pane, SplitMode } from "../types";
import { parseSize } from "./sizeConversion";

/**
 * Calculates the total size of all panes in the unit of the first pane.
 */
export function calculateTotalSize(panes: Pane[]): { total: number; unit: string } {
  if (panes.length === 0) return { total: 0, unit: "px" };

  const firstPane = panes[0]!;
  const firstParsed = parseSize(firstPane.size);
  let total = 0;

  for (const pane of panes) {
    const parsed = parseSize(pane.size);
    if (parsed.unit !== firstParsed.unit) {
      console.warn(`Mixed units detected: ${firstParsed.unit} and ${parsed.unit}.`);
    }
    total += parsed.value;
  }

  return { total, unit: firstParsed.unit };
}

/**
 * Validates that pane sizes don't exceed logical constraints.
 */
export function validatePaneSizes(
  panes: Pane[],
  _containerSize: number,
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (panes.length === 0) {
    errors.push("No panes defined");
    return { valid: false, errors };
  }

  const percentagePanes = panes.filter((p) => p.size.includes("%"));
  if (percentagePanes.length > 0) {
    const totalPercent = percentagePanes.reduce((sum, pane) => sum + parseFloat(pane.size), 0);
    if (totalPercent > 100.1) {
      errors.push(`Total percentage (${totalPercent}%) exceeds 100%`);
    }
  }

  panes.forEach((pane, index) => {
    if (pane.minSize < 0) errors.push(`Pane ${index}: minSize cannot be negative`);
    if (pane.maxSize < pane.minSize) {
      errors.push(`Pane ${index}: maxSize (${pane.maxSize}) less than minSize (${pane.minSize})`);
    }
    if (pane.maxSize > 100) errors.push(`Pane ${index}: maxSize (${pane.maxSize}%) exceeds 100%`);
  });

  return { valid: errors.length === 0, errors };
}

/**
 * Calculates a flex-basis value for specific unit types.
 */
export function calculateFlexBasis(size: string, _containerSize: number): string {
  const parsed = parseSize(size);

  switch (parsed.unit) {
    case "%":
    case "px":
      return size;
    case "vw":
      return `${(parsed.value / 100) * window.innerWidth}px`;
    case "vh":
      return `${(parsed.value / 100) * window.innerHeight}px`;
    case "fr":
      return "0"; // flex-grow handles fr units
    default:
      return `${parsed.value}px`;
  }
}

/**
 * Determines flex grow/shrink values based on pane configuration.
 */
export function calculateFlexValues(
  pane: Pane,
  isCollapsed: boolean = false,
): { flexGrow: number; flexShrink: number } {
  if (isCollapsed) return { flexGrow: 0, flexShrink: 0 };

  const parsed = parseSize(pane.size);

  if (parsed.unit === "%") return { flexGrow: 1, flexShrink: 1 };
  if (parsed.unit === "fr") return { flexGrow: parsed.value, flexShrink: 1 };

  return { flexGrow: 0, flexShrink: 0 };
}

/**
 * Static handlebar legacy size. 
 * Note: Dynamic sizing is now handled in useDragHandler.
 */
export const HANDLEBAR_SIZE = 11;

/**
 * Gets container dimensions and calculates available space for panes.
 */
export function getContainerDimensions(
  element: HTMLElement,
  mode: SplitMode,
  handlebarCount: number = 0,
): { width: number; height: number; primary: number; availableForPanes: number } {
  const width = element.offsetWidth;
  const height = element.offsetHeight;
  const primary = mode === "horizontal" ? width : height;

  const handlebarSpace = handlebarCount * HANDLEBAR_SIZE;
  const availableForPanes = primary - handlebarSpace;

  return { width, height, primary, availableForPanes };
}

/**
 * Normalizes percentage sizes to ensure they sum to exactly 100%.
 */
export function normalizePaneSizes(panes: Pane[]): Pane[] {
  const percentagePanes = panes.filter((p) => p.size.includes("%"));
  if (percentagePanes.length === 0) return panes;

  const totalPercent = percentagePanes.reduce((sum, pane) => sum + parseFloat(pane.size), 0);
  if (Math.abs(totalPercent - 100) < 0.01) return panes;

  const factor = 100 / totalPercent;

  return panes.map((pane) => {
    if (!pane.size.includes("%")) return pane;
    return { ...pane, size: `${parseFloat(pane.size) * factor}%` };
  });
}

/**
 * Checks if a pane's new size would fall within defined min/max constraints.
 */
export function canResize(pane: Pane, currentSize: number, delta: number): boolean {
  const newSize = currentSize + delta;
  return newSize >= pane.minSize && newSize <= pane.maxSize;
}

export function getAxisProperty(mode: SplitMode): "width" | "height" {
  return mode === "horizontal" ? "width" : "height";
}

export function getCoordinateProperty(mode: SplitMode): "clientX" | "clientY" {
  return mode === "horizontal" ? "clientX" : "clientY";
}
