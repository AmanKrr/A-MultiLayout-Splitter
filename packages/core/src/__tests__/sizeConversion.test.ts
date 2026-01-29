/**
 * Size Conversion Utilities Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { percentageToPixel, pixelToPercentage, normalizeSize, parseSize, haveSameUnit, clampSize } from '../utils/sizeConversion';

describe('sizeConversion utilities', () => {
  describe('percentageToPixel', () => {
    beforeEach(() => {
      // Mock window dimensions
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

    it('converts percentage to pixels with px reference', () => {
      expect(percentageToPixel(50, '1000px')).toBe(500);
      expect(percentageToPixel(25, '800px')).toBe(200);
      expect(percentageToPixel(100, '500px')).toBe(500);
      expect(percentageToPixel(0, '1000px')).toBe(0);
    });

    it('converts percentage to pixels with vw reference', () => {
      expect(percentageToPixel(50, '100vw')).toBe(500);
      expect(percentageToPixel(25, '50vw')).toBe(125);
      expect(percentageToPixel(100, '80vw')).toBe(800);
    });

    it('converts percentage to pixels with vh reference', () => {
      expect(percentageToPixel(50, '100vh')).toBe(400);
      expect(percentageToPixel(25, '50vh')).toBe(100);
      expect(percentageToPixel(100, '80vh')).toBe(640);
    });

    it('handles percentage reference with warning', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      expect(percentageToPixel(50, '50%')).toBe(250);
      expect(consoleWarnSpy).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });

    it('handles numeric reference as fallback', () => {
      expect(percentageToPixel(50, '1000')).toBe(500);
      expect(percentageToPixel(25, '400')).toBe(100);
    });

    it('handles edge cases', () => {
      expect(percentageToPixel(0, '1000px')).toBe(0);
      expect(percentageToPixel(100, '0px')).toBe(0);
    });
  });

  describe('pixelToPercentage', () => {
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

    it('converts pixels to percentage with px reference', () => {
      expect(pixelToPercentage(500, '1000px')).toBe(50);
      expect(pixelToPercentage(200, '800px')).toBe(25);
      expect(pixelToPercentage(500, '500px')).toBe(100);
      expect(pixelToPercentage(0, '1000px')).toBe(0);
    });

    it('converts pixels to percentage with vw reference', () => {
      expect(pixelToPercentage(500, '100vw')).toBe(50);
      expect(pixelToPercentage(125, '50vw')).toBe(25);
      expect(pixelToPercentage(800, '80vw')).toBe(100);
    });

    it('converts pixels to percentage with vh reference', () => {
      expect(pixelToPercentage(400, '100vh')).toBe(50);
      expect(pixelToPercentage(100, '50vh')).toBe(25);
      expect(pixelToPercentage(640, '80vh')).toBe(100);
    });

    it('handles percentage reference with warning', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      expect(pixelToPercentage(250, '50%')).toBe(50);
      expect(consoleWarnSpy).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });

    it('handles numeric reference as fallback', () => {
      expect(pixelToPercentage(500, '1000')).toBe(50);
      expect(pixelToPercentage(100, '400')).toBe(25);
    });

    it('handles edge cases', () => {
      expect(pixelToPercentage(0, '1000px')).toBe(0);
      expect(pixelToPercentage(100, '0px')).toBe(Infinity);
    });
  });

  describe('normalizeSize', () => {
    it('converts percentage to pixels', () => {
      expect(normalizeSize('50%', 1000, 'px')).toBe('500px');
      expect(normalizeSize('25%', 800, 'px')).toBe('200px');
      expect(normalizeSize('100%', 500, 'px')).toBe('500px');
    });

    it('converts pixels to percentage', () => {
      expect(normalizeSize('500px', 1000, '%')).toBe('50%');
      expect(normalizeSize('200px', 800, '%')).toBe('25%');
      expect(normalizeSize('500px', 500, '%')).toBe('100%');
    });

    it('returns same unit if already normalized', () => {
      expect(normalizeSize('50%', 1000, '%')).toBe('50%');
      expect(normalizeSize('500px', 1000, 'px')).toBe('500px');
    });

    it('handles unitless values as pixels', () => {
      expect(normalizeSize('500', 1000, 'px')).toBe('500px');
      expect(normalizeSize('500', 1000, '%')).toBe('50%');
    });

    it('handles zero values', () => {
      expect(normalizeSize('0%', 1000, 'px')).toBe('0px');
      expect(normalizeSize('0px', 1000, '%')).toBe('0%');
    });
  });

  describe('parseSize', () => {
    it('parses percentage values', () => {
      expect(parseSize('50%')).toEqual({ value: 50, unit: '%' });
      expect(parseSize('100%')).toEqual({ value: 100, unit: '%' });
      expect(parseSize('33.33%')).toEqual({ value: 33.33, unit: '%' });
    });

    it('parses pixel values', () => {
      expect(parseSize('500px')).toEqual({ value: 500, unit: 'px' });
      expect(parseSize('200px')).toEqual({ value: 200, unit: 'px' });
      expect(parseSize('0px')).toEqual({ value: 0, unit: 'px' });
    });

    it('parses viewport width values', () => {
      expect(parseSize('100vw')).toEqual({ value: 100, unit: 'vw' });
      expect(parseSize('50vw')).toEqual({ value: 50, unit: 'vw' });
    });

    it('parses viewport height values', () => {
      expect(parseSize('100vh')).toEqual({ value: 100, unit: 'vh' });
      expect(parseSize('80vh')).toEqual({ value: 80, unit: 'vh' });
    });

    it('defaults to px for unitless values', () => {
      expect(parseSize('500')).toEqual({ value: 500, unit: 'px' });
      expect(parseSize('0')).toEqual({ value: 0, unit: 'px' });
    });

    it('handles negative values', () => {
      expect(parseSize('-50px')).toEqual({ value: -50, unit: 'px' });
      expect(parseSize('-25%')).toEqual({ value: -25, unit: '%' });
    });

    it('handles decimal values', () => {
      expect(parseSize('33.33%')).toEqual({ value: 33.33, unit: '%' });
      expect(parseSize('250.5px')).toEqual({ value: 250.5, unit: 'px' });
    });
  });

  describe('haveSameUnit', () => {
    it('returns true for same percentage units', () => {
      expect(haveSameUnit('50%', '75%')).toBe(true);
      expect(haveSameUnit('0%', '100%')).toBe(true);
    });

    it('returns true for same pixel units', () => {
      expect(haveSameUnit('500px', '750px')).toBe(true);
      expect(haveSameUnit('0px', '1000px')).toBe(true);
    });

    it('returns true for same viewport units', () => {
      expect(haveSameUnit('100vw', '50vw')).toBe(true);
      expect(haveSameUnit('100vh', '80vh')).toBe(true);
    });

    it('returns false for different units', () => {
      expect(haveSameUnit('50%', '500px')).toBe(false);
      expect(haveSameUnit('500px', '50vw')).toBe(false);
      expect(haveSameUnit('50%', '50vh')).toBe(false);
      expect(haveSameUnit('100vw', '100vh')).toBe(false);
    });

    it('handles unitless values as pixels', () => {
      expect(haveSameUnit('500', '750px')).toBe(true);
      expect(haveSameUnit('500', '50%')).toBe(false);
    });
  });

  describe('clampSize', () => {
    it('clamps value within bounds', () => {
      expect(clampSize(50, 20, 80, '%')).toBe('50%');
      expect(clampSize(500, 200, 800, 'px')).toBe('500px');
    });

    it('clamps value to minimum', () => {
      expect(clampSize(10, 20, 80, '%')).toBe('20%');
      expect(clampSize(100, 200, 800, 'px')).toBe('200px');
      expect(clampSize(-10, 0, 100, '%')).toBe('0%');
    });

    it('clamps value to maximum', () => {
      expect(clampSize(90, 20, 80, '%')).toBe('80%');
      expect(clampSize(1000, 200, 800, 'px')).toBe('800px');
      expect(clampSize(150, 0, 100, '%')).toBe('100%');
    });

    it('handles edge cases at boundaries', () => {
      expect(clampSize(20, 20, 80, '%')).toBe('20%');
      expect(clampSize(80, 20, 80, '%')).toBe('80%');
      expect(clampSize(200, 200, 800, 'px')).toBe('200px');
      expect(clampSize(800, 200, 800, 'px')).toBe('800px');
    });

    it('works with different units', () => {
      expect(clampSize(50, 0, 100, '%')).toBe('50%');
      expect(clampSize(500, 0, 1000, 'px')).toBe('500px');
      expect(clampSize(50, 0, 100, 'vw')).toBe('50vw');
      expect(clampSize(50, 0, 100, 'vh')).toBe('50vh');
    });

    it('handles decimal values', () => {
      expect(clampSize(33.33, 20, 80, '%')).toBe('33.33%');
      expect(clampSize(250.5, 200, 800, 'px')).toBe('250.5px');
    });

    it('handles zero bounds', () => {
      expect(clampSize(50, 0, 0, '%')).toBe('0%');
      expect(clampSize(-10, 0, 0, 'px')).toBe('0px');
      expect(clampSize(0, 0, 0, '%')).toBe('0%');
    });
  });
});
