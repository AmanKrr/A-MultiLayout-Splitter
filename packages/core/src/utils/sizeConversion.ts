/**
 * Converts a percentage value to pixels based on a reference width string (px, vw, vh, %).
 */
export function percentageToPixel(percentage: number, referenceWidth: string): number {
  if (referenceWidth.includes("vw")) {
    const vwValue = parseFloat(referenceWidth);
    return (percentage / 100) * window.innerWidth * (vwValue / 100);
  }

  if (referenceWidth.includes("vh")) {
    const vhValue = parseFloat(referenceWidth);
    return (percentage / 100) * window.innerHeight * (vhValue / 100);
  }

  if (referenceWidth.includes("px")) {
    const pxValue = parseFloat(referenceWidth);
    return (percentage / 100) * pxValue;
  }

  if (referenceWidth.includes("%")) {
    return (percentage / 100) * window.innerWidth * (parseFloat(referenceWidth) / 100);
  }

  return (percentage / 100) * parseFloat(referenceWidth);
}

/**
 * Converts a pixel value to a percentage based on a reference width string.
 */
export function pixelToPercentage(pixelValue: number, referenceWidth: string): number {
  if (referenceWidth.includes("vw")) {
    const vwValue = parseFloat(referenceWidth);
    const containerPx = window.innerWidth * (vwValue / 100);
    return (pixelValue / containerPx) * 100;
  }

  if (referenceWidth.includes("vh")) {
    const vhValue = parseFloat(referenceWidth);
    const containerPx = window.innerHeight * (vhValue / 100);
    return (pixelValue / containerPx) * 100;
  }

  if (referenceWidth.includes("px")) {
    const pxValue = parseFloat(referenceWidth);
    return (pixelValue / pxValue) * 100;
  }

  if (referenceWidth.includes("%")) {
    const containerPx = window.innerWidth * (parseFloat(referenceWidth) / 100);
    return (pixelValue / containerPx) * 100;
  }

  return (pixelValue / parseFloat(referenceWidth)) * 100;
}

/**
 * Normalizes a size string to either pixels or percentage.
 */
export function normalizeSize(value: string, containerSize: number, targetUnit: "px" | "%"): string {
  const numericValue = parseFloat(value);

  if (value.includes("%")) {
    return targetUnit === "px" ? `${(numericValue / 100) * containerSize}px` : value;
  }

  if (value.includes("px")) {
    return targetUnit === "%" ? `${(numericValue / containerSize) * 100}%` : value;
  }

  return targetUnit === "px" ? `${numericValue}px` : `${(numericValue / containerSize) * 100}%`;
}

/**
 * Parses a size string into its numeric value and unit.
 */
export function parseSize(value: string): { value: number; unit: string } {
  const numericValue = parseFloat(value);

  if (value.includes("%")) return { value: numericValue, unit: "%" };
  if (value.includes("px")) return { value: numericValue, unit: "px" };
  if (value.includes("vw")) return { value: numericValue, unit: "vw" };
  if (value.includes("vh")) return { value: numericValue, unit: "vh" };
  if (value.includes("fr")) return { value: numericValue, unit: "fr" };

  return { value: numericValue, unit: "px" };
}

export function haveSameUnit(size1: string, size2: string): boolean {
  return parseSize(size1).unit === parseSize(size2).unit;
}

export function clampSize(value: number, min: number, max: number, unit: string): string {
  return `${Math.max(min, Math.min(max, value))}${unit}`;
}
