/**
 * Size Conversion Utilities
 *
 * These pure functions handle conversion between different size units:
 * - Percentage to Pixel
 * - Pixel to Percentage
 * - Viewport units (vw, vh)
 *
 * Refactored from v5 SplitUtils for better testability and composition
 */

/**
 * Convert percentage to pixels based on reference size
 *
 * @param percentage - Percentage value (0-100)
 * @param referenceWidth - Reference dimension (e.g., "1000px", "100vw", "50%")
 * @returns Pixel value
 */
export function percentageToPixel(
  percentage: number,
  referenceWidth: string
): number {
  if (referenceWidth.includes('vw')) {
    const vwValue = parseFloat(referenceWidth);
    return (percentage / 100) * window.innerWidth * (vwValue / 100);
  }

  if (referenceWidth.includes('vh')) {
    const vhValue = parseFloat(referenceWidth);
    return (percentage / 100) * window.innerHeight * (vhValue / 100);
  }

  if (referenceWidth.includes('px')) {
    const pxValue = parseFloat(referenceWidth);
    return (percentage / 100) * pxValue;
  }

  if (referenceWidth.includes('%')) {
    // Assume parent container width (would need actual measurement)
    console.warn('Percentage reference not fully supported, assuming viewport');
    return (percentage / 100) * window.innerWidth * (parseFloat(referenceWidth) / 100);
  }

  // Fallback: treat as pixels
  return (percentage / 100) * parseFloat(referenceWidth);
}

/**
 * Convert pixels to percentage based on reference size
 *
 * @param pixelValue - Pixel value
 * @param referenceWidth - Reference dimension (e.g., "1000px", "100vw")
 * @returns Percentage value (0-100)
 */
export function pixelToPercentage(
  pixelValue: number,
  referenceWidth: string
): number {
  if (referenceWidth.includes('vw')) {
    const vwValue = parseFloat(referenceWidth);
    const containerPx = window.innerWidth * (vwValue / 100);
    return (pixelValue / containerPx) * 100;
  }

  if (referenceWidth.includes('vh')) {
    const vhValue = parseFloat(referenceWidth);
    const containerPx = window.innerHeight * (vhValue / 100);
    return (pixelValue / containerPx) * 100;
  }

  if (referenceWidth.includes('px')) {
    const pxValue = parseFloat(referenceWidth);
    return (pixelValue / pxValue) * 100;
  }

  if (referenceWidth.includes('%')) {
    console.warn('Percentage reference not fully supported, assuming viewport');
    const containerPx = window.innerWidth * (parseFloat(referenceWidth) / 100);
    return (pixelValue / containerPx) * 100;
  }

  // Fallback: treat as pixels
  return (pixelValue / parseFloat(referenceWidth)) * 100;
}

/**
 * Normalize size to a specific unit
 *
 * @param value - Size value with unit (e.g., "50%", "200px")
 * @param containerSize - Container size in pixels
 * @param targetUnit - Target unit ('px' or '%')
 * @returns Normalized size string
 */
export function normalizeSize(
  value: string,
  containerSize: number,
  targetUnit: 'px' | '%'
): string {
  const numericValue = parseFloat(value);

  if (value.includes('%')) {
    if (targetUnit === 'px') {
      return `${(numericValue / 100) * containerSize}px`;
    }
    return value; // Already in percentage
  }

  if (value.includes('px')) {
    if (targetUnit === '%') {
      return `${(numericValue / containerSize) * 100}%`;
    }
    return value; // Already in pixels
  }

  // Fallback: assume pixels
  return targetUnit === 'px' ? `${numericValue}px` : `${(numericValue / containerSize) * 100}%`;
}

/**
 * Parse size value and extract number + unit
 *
 * @param value - Size string (e.g., "50%", "200px")
 * @returns Object with numeric value and unit
 */
export function parseSize(value: string): { value: number; unit: string } {
  const numericValue = parseFloat(value);

  if (value.includes('%')) {
    return { value: numericValue, unit: '%' };
  }

  if (value.includes('px')) {
    return { value: numericValue, unit: 'px' };
  }

  if (value.includes('vw')) {
    return { value: numericValue, unit: 'vw' };
  }

  if (value.includes('vh')) {
    return { value: numericValue, unit: 'vh' };
  }

  // Default to px
  return { value: numericValue, unit: 'px' };
}

/**
 * Check if two sizes are in the same unit
 *
 * @param size1 - First size string
 * @param size2 - Second size string
 * @returns True if both use the same unit
 */
export function haveSameUnit(size1: string, size2: string): boolean {
  const parsed1 = parseSize(size1);
  const parsed2 = parseSize(size2);
  return parsed1.unit === parsed2.unit;
}

/**
 * Clamp a size value within min/max bounds
 *
 * @param value - Size value
 * @param min - Minimum value
 * @param max - Maximum value
 * @param unit - Unit to append
 * @returns Clamped size string
 */
export function clampSize(
  value: number,
  min: number,
  max: number,
  unit: string
): string {
  const clamped = Math.max(min, Math.min(max, value));
  return `${clamped}${unit}`;
}
