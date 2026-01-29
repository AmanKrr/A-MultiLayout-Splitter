/**
 * Converts a percentage value to pixels based on a reference width.
 *
 * @param percentage - Numeric percentage (0-100)
 * @param referenceWidth - Container or viewport width string
 */
export function percentageToPixel(percentage: number, referenceWidth: string): number {
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
    console.warn('Percentage reference not fully supported, assuming viewport');
    return (percentage / 100) * window.innerWidth * (parseFloat(referenceWidth) / 100);
  }

  return (percentage / 100) * parseFloat(referenceWidth);
}

/**
 * Converts a pixel value to a percentage based on a reference width.
 *
 * @param pixelValue - Size in pixels
 * @param referenceWidth - Container or viewport width string
 */
export function pixelToPercentage(pixelValue: number, referenceWidth: string): number {
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

  return (pixelValue / parseFloat(referenceWidth)) * 100;
}

/**
 * Normalizes a size string to a target unit (px or %).
 *
 * @param value - Original size string
 * @param containerSize - Current container dimension in pixels
 * @param targetUnit - The unit to convert into
 */
export function normalizeSize(value: string, containerSize: number, targetUnit: 'px' | '%'): string {
  const numericValue = parseFloat(value);

  if (value.includes('%')) {
    if (targetUnit === 'px') {
      return `${(numericValue / 100) * containerSize}px`;
    }
    return value;
  }

  if (value.includes('px')) {
    if (targetUnit === '%') {
      return `${(numericValue / containerSize) * 100}%`;
    }
    return value;
  }

  return targetUnit === 'px' ? `${numericValue}px` : `${(numericValue / containerSize) * 100}%`;
}

/**
 * Parses a size string and extracts the numeric value and unit.
 *
 * @param value - The size string (e.g., "50%", "100px")
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

  if (value.includes('fr')) {
    return { value: numericValue, unit: 'fr' };
  }

  return { value: numericValue, unit: 'px' };
}

/**
 * Checks if two size strings share the same measurement unit.
 */
export function haveSameUnit(size1: string, size2: string): boolean {
  const parsed1 = parseSize(size1);
  const parsed2 = parseSize(size2);
  return parsed1.unit === parsed2.unit;
}

/**
 * Clamps a size value and appends the appropriate unit.
 *
 * @param value - Target size
 * @param min - Minimum bound
 * @param max - Maximum bound
 * @param unit - CSS unit string
 */
export function clampSize(value: number, min: number, max: number, unit: string): string {
  const clamped = Math.max(min, Math.min(max, value));
  return `${clamped}${unit}`;
}
