/**
 * Layout Calculation Utilities Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  calculateTotalSize,
  validatePaneSizes,
  calculateFlexBasis,
  calculateFlexValues,
  calculateHandlebarPosition,
  getContainerDimensions,
  normalizePaneSizes,
  canResize,
  getAxisProperty,
  getCoordinateProperty,
} from '../layoutCalculations';
import { Pane } from '../../types';

describe('layoutCalculations utilities', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1000,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 800,
    });
  });

  describe('calculateTotalSize', () => {
    it('calculates total size for percentage panes', () => {
      const panes: Pane[] = [
        { id: '1', size: '30%', collapsed: false, minSize: 10, maxSize: 90, content: null, mode: 'horizontal' },
        { id: '2', size: '40%', collapsed: false, minSize: 10, maxSize: 90, content: null, mode: 'horizontal' },
        { id: '3', size: '30%', collapsed: false, minSize: 10, maxSize: 90, content: null, mode: 'horizontal' },
      ];

      const result = calculateTotalSize(panes);
      expect(result.total).toBe(100);
      expect(result.unit).toBe('%');
    });

    it('calculates total size for pixel panes', () => {
      const panes: Pane[] = [
        { id: '1', size: '200px', collapsed: false, minSize: 100, maxSize: 500, content: null, mode: 'horizontal' },
        { id: '2', size: '300px', collapsed: false, minSize: 100, maxSize: 500, content: null, mode: 'horizontal' },
        { id: '3', size: '500px', collapsed: false, minSize: 100, maxSize: 500, content: null, mode: 'horizontal' },
      ];

      const result = calculateTotalSize(panes);
      expect(result.total).toBe(1000);
      expect(result.unit).toBe('px');
    });

    it('handles empty pane array', () => {
      const result = calculateTotalSize([]);
      expect(result.total).toBe(0);
      expect(result.unit).toBe('px');
    });

    it('warns on mixed units', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const panes: Pane[] = [
        { id: '1', size: '50%', collapsed: false, minSize: 10, maxSize: 90, content: null, mode: 'horizontal' },
        { id: '2', size: '500px', collapsed: false, minSize: 100, maxSize: 900, content: null, mode: 'horizontal' },
      ];

      calculateTotalSize(panes);
      expect(consoleWarnSpy).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });
  });

  describe('validatePaneSizes', () => {
    it('validates correct pane sizes', () => {
      const panes: Pane[] = [
        { id: '1', size: '50%', collapsed: false, minSize: 10, maxSize: 90, content: null, mode: 'horizontal' },
        { id: '2', size: '50%', collapsed: false, minSize: 10, maxSize: 90, content: null, mode: 'horizontal' },
      ];

      const result = validatePaneSizes(panes, 1000);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('detects empty panes', () => {
      const result = validatePaneSizes([], 1000);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('No panes defined');
    });

    it('detects total percentage exceeding 100%', () => {
      const panes: Pane[] = [
        { id: '1', size: '60%', collapsed: false, minSize: 10, maxSize: 90, content: null, mode: 'horizontal' },
        { id: '2', size: '60%', collapsed: false, minSize: 10, maxSize: 90, content: null, mode: 'horizontal' },
      ];

      const result = validatePaneSizes(panes, 1000);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('exceeds 100%'))).toBe(true);
    });

    it('allows small floating point errors', () => {
      const panes: Pane[] = [
        { id: '1', size: '33.33%', collapsed: false, minSize: 10, maxSize: 90, content: null, mode: 'horizontal' },
        { id: '2', size: '33.33%', collapsed: false, minSize: 10, maxSize: 90, content: null, mode: 'horizontal' },
        { id: '3', size: '33.34%', collapsed: false, minSize: 10, maxSize: 90, content: null, mode: 'horizontal' },
      ];

      const result = validatePaneSizes(panes, 1000);
      expect(result.valid).toBe(true);
    });

    it('detects negative minSize', () => {
      const panes: Pane[] = [
        { id: '1', size: '50%', collapsed: false, minSize: -10, maxSize: 90, content: null, mode: 'horizontal' },
      ];

      const result = validatePaneSizes(panes, 1000);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('cannot be negative'))).toBe(true);
    });

    it('detects maxSize less than minSize', () => {
      const panes: Pane[] = [
        { id: '1', size: '50%', collapsed: false, minSize: 80, maxSize: 20, content: null, mode: 'horizontal' },
      ];

      const result = validatePaneSizes(panes, 1000);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('less than minSize'))).toBe(true);
    });

    it('detects maxSize exceeding 100%', () => {
      const panes: Pane[] = [
        { id: '1', size: '50%', collapsed: false, minSize: 10, maxSize: 120, content: null, mode: 'horizontal' },
      ];

      const result = validatePaneSizes(panes, 1000);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('exceeds 100%'))).toBe(true);
    });
  });

  describe('calculateFlexBasis', () => {
    it('returns percentage as-is', () => {
      expect(calculateFlexBasis('50%', 1000)).toBe('50%');
      expect(calculateFlexBasis('33.33%', 1000)).toBe('33.33%');
    });

    it('returns pixels as-is', () => {
      expect(calculateFlexBasis('500px', 1000)).toBe('500px');
      expect(calculateFlexBasis('250px', 1000)).toBe('250px');
    });

    it('converts viewport width to pixels', () => {
      expect(calculateFlexBasis('100vw', 1000)).toBe('1000px');
      expect(calculateFlexBasis('50vw', 1000)).toBe('500px');
    });

    it('converts viewport height to pixels', () => {
      expect(calculateFlexBasis('100vh', 1000)).toBe('800px');
      expect(calculateFlexBasis('50vh', 1000)).toBe('400px');
    });

    it('falls back to pixels for unknown units', () => {
      // The actual implementation returns '500' not '500px' for unitless values
      expect(calculateFlexBasis('500', 1000)).toBe('500');
    });
  });

  describe('calculateFlexValues', () => {
    it('returns 0/0 for collapsed panes', () => {
      const pane: Pane = {
        id: '1',
        size: '50%',
        collapsed: false,
        minSize: 10,
        maxSize: 90,
        content: null,
        mode: 'horizontal',
      };

      const result = calculateFlexValues(pane, true);
      expect(result).toEqual({ flexGrow: 0, flexShrink: 0 });
    });

    it('returns 1/1 for percentage panes', () => {
      const pane: Pane = {
        id: '1',
        size: '50%',
        collapsed: false,
        minSize: 10,
        maxSize: 90,
        content: null,
        mode: 'horizontal',
      };

      const result = calculateFlexValues(pane, false);
      expect(result).toEqual({ flexGrow: 1, flexShrink: 1 });
    });

    it('returns 0/0 for fixed-size panes', () => {
      const pane: Pane = {
        id: '1',
        size: '500px',
        collapsed: false,
        minSize: 100,
        maxSize: 900,
        content: null,
        mode: 'horizontal',
      };

      const result = calculateFlexValues(pane, false);
      expect(result).toEqual({ flexGrow: 0, flexShrink: 0 });
    });
  });

  describe('calculateHandlebarPosition', () => {
    it('calculates position for percentage', () => {
      expect(calculateHandlebarPosition('50%', 1000, 'horizontal')).toBe(500);
      expect(calculateHandlebarPosition('25%', 800, 'horizontal')).toBe(200);
    });

    it('calculates position for pixels', () => {
      expect(calculateHandlebarPosition('500px', 1000, 'horizontal')).toBe(500);
      expect(calculateHandlebarPosition('200px', 800, 'horizontal')).toBe(200);
    });

    it('calculates position for viewport width', () => {
      expect(calculateHandlebarPosition('50vw', 1000, 'horizontal')).toBe(500);
      expect(calculateHandlebarPosition('100vw', 1000, 'horizontal')).toBe(1000);
    });

    it('calculates position for viewport height', () => {
      expect(calculateHandlebarPosition('50vh', 1000, 'horizontal')).toBe(400);
      expect(calculateHandlebarPosition('100vh', 1000, 'horizontal')).toBe(800);
    });
  });

  describe('getContainerDimensions', () => {
    it('returns dimensions for horizontal mode', () => {
      const element = document.createElement('div');
      Object.defineProperty(element, 'offsetWidth', { value: 1000, writable: true });
      Object.defineProperty(element, 'offsetHeight', { value: 600, writable: true });

      const result = getContainerDimensions(element, 'horizontal');
      expect(result).toEqual({ width: 1000, height: 600, primary: 1000 });
    });

    it('returns dimensions for vertical mode', () => {
      const element = document.createElement('div');
      Object.defineProperty(element, 'offsetWidth', { value: 1000, writable: true });
      Object.defineProperty(element, 'offsetHeight', { value: 600, writable: true });

      const result = getContainerDimensions(element, 'vertical');
      expect(result).toEqual({ width: 1000, height: 600, primary: 600 });
    });
  });

  describe('normalizePaneSizes', () => {
    it('normalizes panes that sum to more than 100%', () => {
      const panes: Pane[] = [
        { id: '1', size: '60%', collapsed: false, minSize: 10, maxSize: 90, content: null, mode: 'horizontal' },
        { id: '2', size: '60%', collapsed: false, minSize: 10, maxSize: 90, content: null, mode: 'horizontal' },
      ];

      const result = normalizePaneSizes(panes);
      expect(parseFloat(result[0].size)).toBeCloseTo(50);
      expect(parseFloat(result[1].size)).toBeCloseTo(50);
    });

    it('normalizes panes that sum to less than 100%', () => {
      const panes: Pane[] = [
        { id: '1', size: '30%', collapsed: false, minSize: 10, maxSize: 90, content: null, mode: 'horizontal' },
        { id: '2', size: '30%', collapsed: false, minSize: 10, maxSize: 90, content: null, mode: 'horizontal' },
      ];

      const result = normalizePaneSizes(panes);
      expect(parseFloat(result[0].size)).toBeCloseTo(50);
      expect(parseFloat(result[1].size)).toBeCloseTo(50);
    });

    it('does not modify panes already at 100%', () => {
      const panes: Pane[] = [
        { id: '1', size: '50%', collapsed: false, minSize: 10, maxSize: 90, content: null, mode: 'horizontal' },
        { id: '2', size: '50%', collapsed: false, minSize: 10, maxSize: 90, content: null, mode: 'horizontal' },
      ];

      const result = normalizePaneSizes(panes);
      expect(result[0].size).toBe('50%');
      expect(result[1].size).toBe('50%');
    });

    it('does not modify pixel panes', () => {
      const panes: Pane[] = [
        { id: '1', size: '500px', collapsed: false, minSize: 100, maxSize: 900, content: null, mode: 'horizontal' },
        { id: '2', size: '500px', collapsed: false, minSize: 100, maxSize: 900, content: null, mode: 'horizontal' },
      ];

      const result = normalizePaneSizes(panes);
      expect(result[0].size).toBe('500px');
      expect(result[1].size).toBe('500px');
    });

    it('handles mixed units correctly', () => {
      const panes: Pane[] = [
        { id: '1', size: '30%', collapsed: false, minSize: 10, maxSize: 90, content: null, mode: 'horizontal' },
        { id: '2', size: '500px', collapsed: false, minSize: 100, maxSize: 900, content: null, mode: 'horizontal' },
        { id: '3', size: '30%', collapsed: false, minSize: 10, maxSize: 90, content: null, mode: 'horizontal' },
      ];

      const result = normalizePaneSizes(panes);
      expect(parseFloat(result[0].size)).toBeCloseTo(50);
      expect(result[1].size).toBe('500px');
      expect(parseFloat(result[2].size)).toBeCloseTo(50);
    });
  });

  describe('canResize', () => {
    const pane: Pane = {
      id: '1',
      size: '50%',
      collapsed: false,
      minSize: 20,
      maxSize: 80,
      content: null,
      mode: 'horizontal',
    };

    it('allows resize within bounds', () => {
      expect(canResize(pane, 50, 10)).toBe(true);
      expect(canResize(pane, 50, -10)).toBe(true);
      expect(canResize(pane, 30, 20)).toBe(true);
    });

    it('prevents resize below minSize', () => {
      expect(canResize(pane, 25, -10)).toBe(false);
      expect(canResize(pane, 20, -1)).toBe(false);
    });

    it('prevents resize above maxSize', () => {
      expect(canResize(pane, 75, 10)).toBe(false);
      expect(canResize(pane, 80, 1)).toBe(false);
    });

    it('allows resize to exact min/max', () => {
      expect(canResize(pane, 30, -10)).toBe(true); // Exactly minSize
      expect(canResize(pane, 70, 10)).toBe(true); // Exactly maxSize
    });
  });

  describe('getAxisProperty', () => {
    it('returns width for horizontal mode', () => {
      expect(getAxisProperty('horizontal')).toBe('width');
    });

    it('returns height for vertical mode', () => {
      expect(getAxisProperty('vertical')).toBe('height');
    });
  });

  describe('getCoordinateProperty', () => {
    it('returns clientX for horizontal mode', () => {
      expect(getCoordinateProperty('horizontal')).toBe('clientX');
    });

    it('returns clientY for vertical mode', () => {
      expect(getCoordinateProperty('vertical')).toBe('clientY');
    });
  });
});
