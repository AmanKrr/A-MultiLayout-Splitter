/**
 * usePersistence Hook Tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePersistence } from '../hooks/usePersistence';
import { Pane } from '../types';

describe('usePersistence', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('save', () => {
    it('saves pane state to localStorage when enabled', async () => {
      const { result } = renderHook(() =>
        usePersistence(true, 'test-split', 'horizontal')
      );

      const panes: Pane[] = [
        { id: '1', size: '50%', collapsed: false, minSize: 10, maxSize: 90, content: null, mode: 'horizontal' },
        { id: '2', size: '50%', collapsed: false, minSize: 10, maxSize: 90, content: null, mode: 'horizontal' },
      ];

      act(() => {
        result.current.save(panes);
      });

      // Wait for debounce
      await new Promise((resolve) => setTimeout(resolve, 350));

      const stored = localStorage.getItem('test-split-horizontal');
      expect(stored).toBeTruthy();

      const parsed = JSON.parse(stored!);
      expect(parsed).toEqual([
        { id: '1', size: '50%', collapsed: false },
        { id: '2', size: '50%', collapsed: false },
      ]);
    });

    it('does not save when disabled', async () => {
      const { result } = renderHook(() =>
        usePersistence(false, 'test-split', 'horizontal')
      );

      const panes: Pane[] = [
        { id: '1', size: '50%', collapsed: false, minSize: 10, maxSize: 90, content: null, mode: 'horizontal' },
      ];

      act(() => {
        result.current.save(panes);
      });

      await new Promise((resolve) => setTimeout(resolve, 350));

      const stored = localStorage.getItem('test-split-horizontal');
      expect(stored).toBeNull();
    });

    it('uses different keys for different modes', async () => {
      const { result: horizontalResult } = renderHook(() =>
        usePersistence(true, 'test-split', 'horizontal')
      );

      const { result: verticalResult } = renderHook(() =>
        usePersistence(true, 'test-split', 'vertical')
      );

      const panesH: Pane[] = [
        { id: 'h1', size: '50%', collapsed: false, minSize: 10, maxSize: 90, content: null, mode: 'horizontal' },
      ];

      const panesV: Pane[] = [
        { id: 'v1', size: '50%', collapsed: false, minSize: 10, maxSize: 90, content: null, mode: 'vertical' },
      ];

      act(() => {
        horizontalResult.current.save(panesH);
        verticalResult.current.save(panesV);
      });

      await new Promise((resolve) => setTimeout(resolve, 350));

      const storedH = localStorage.getItem('test-split-horizontal');
      const storedV = localStorage.getItem('test-split-vertical');

      expect(storedH).toBeTruthy();
      expect(storedV).toBeTruthy();
      expect(JSON.parse(storedH!)[0].id).toBe('h1');
      expect(JSON.parse(storedV!)[0].id).toBe('v1');
    });

    it('handles localStorage errors gracefully', async () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // Mock localStorage directly on the global object
      const originalSetItem = global.localStorage.setItem;
      global.localStorage.setItem = vi.fn(() => {
        throw new Error('Storage quota exceeded');
      });

      const { result } = renderHook(() =>
        usePersistence(true, 'test-split', 'horizontal')
      );

      const panes: Pane[] = [
        { id: '1', size: '50%', collapsed: false, minSize: 10, maxSize: 90, content: null, mode: 'horizontal' },
      ];

      act(() => {
        result.current.save(panes);
      });

      await new Promise((resolve) => setTimeout(resolve, 350));

      expect(consoleWarnSpy).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
      global.localStorage.setItem = originalSetItem;
    });

    it('debounces multiple rapid calls', async () => {
      const { result } = renderHook(() =>
        usePersistence(true, 'test-split', 'horizontal')
      );

      const panes1: Pane[] = [
        { id: '1', size: '30%', collapsed: false, minSize: 10, maxSize: 90, content: null, mode: 'horizontal' },
      ];
      const panes2: Pane[] = [
        { id: '1', size: '40%', collapsed: false, minSize: 10, maxSize: 90, content: null, mode: 'horizontal' },
      ];
      const panes3: Pane[] = [
        { id: '1', size: '50%', collapsed: false, minSize: 10, maxSize: 90, content: null, mode: 'horizontal' },
      ];

      act(() => {
        result.current.save(panes1);
        result.current.save(panes2);
        result.current.save(panes3);
      });

      await new Promise((resolve) => setTimeout(resolve, 350));

      const stored = localStorage.getItem('test-split-horizontal');
      const parsed = JSON.parse(stored!);

      // Only the last call should be saved
      expect(parsed[0].size).toBe('50%');
    });
  });

  describe('load', () => {
    it('loads pane state from localStorage when enabled', () => {
      const data = [
        { id: '1', size: '50%', collapsed: false },
        { id: '2', size: '50%', collapsed: false },
      ];

      localStorage.setItem('test-split-horizontal', JSON.stringify(data));

      const { result } = renderHook(() =>
        usePersistence(true, 'test-split', 'horizontal')
      );

      const loaded = result.current.load();
      expect(loaded).toEqual(data);
    });

    it('returns null when no data stored', () => {
      const { result } = renderHook(() =>
        usePersistence(true, 'test-split', 'horizontal')
      );

      const loaded = result.current.load();
      expect(loaded).toBeNull();
    });

    it('returns null when disabled', () => {
      const data = [
        { id: '1', size: '50%', collapsed: false },
      ];

      localStorage.setItem('test-split-horizontal', JSON.stringify(data));

      const { result } = renderHook(() =>
        usePersistence(false, 'test-split', 'horizontal')
      );

      const loaded = result.current.load();
      expect(loaded).toBeNull();
    });

    it('handles corrupted localStorage data', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      localStorage.setItem('test-split-horizontal', 'invalid json{');

      const { result } = renderHook(() =>
        usePersistence(true, 'test-split', 'horizontal')
      );

      const loaded = result.current.load();
      expect(loaded).toBeNull();
      expect(consoleWarnSpy).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });

    it('loads different data for different modes', () => {
      const dataH = [{ id: 'h1', size: '50%', collapsed: false }];
      const dataV = [{ id: 'v1', size: '50%', collapsed: false }];

      localStorage.setItem('test-split-horizontal', JSON.stringify(dataH));
      localStorage.setItem('test-split-vertical', JSON.stringify(dataV));

      const { result: horizontalResult } = renderHook(() =>
        usePersistence(true, 'test-split', 'horizontal')
      );

      const { result: verticalResult } = renderHook(() =>
        usePersistence(true, 'test-split', 'vertical')
      );

      const loadedH = horizontalResult.current.load();
      const loadedV = verticalResult.current.load();

      expect(loadedH).toEqual(dataH);
      expect(loadedV).toEqual(dataV);
    });
  });

  describe('clear', () => {
    it('clears pane state from localStorage when enabled', () => {
      const data = [
        { id: '1', size: '50%', collapsed: false },
      ];

      localStorage.setItem('test-split-horizontal', JSON.stringify(data));

      const { result } = renderHook(() =>
        usePersistence(true, 'test-split', 'horizontal')
      );

      act(() => {
        result.current.clear();
      });

      const stored = localStorage.getItem('test-split-horizontal');
      expect(stored).toBeNull();
    });

    it('does not clear when disabled', () => {
      const data = [
        { id: '1', size: '50%', collapsed: false },
      ];

      localStorage.setItem('test-split-horizontal', JSON.stringify(data));

      const { result } = renderHook(() =>
        usePersistence(false, 'test-split', 'horizontal')
      );

      act(() => {
        result.current.clear();
      });

      const stored = localStorage.getItem('test-split-horizontal');
      expect(stored).toBeTruthy();
    });

    it('handles localStorage errors gracefully', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // Mock localStorage directly on the global object
      const originalRemoveItem = global.localStorage.removeItem;
      global.localStorage.removeItem = vi.fn(() => {
        throw new Error('Storage error');
      });

      const { result } = renderHook(() =>
        usePersistence(true, 'test-split', 'horizontal')
      );

      act(() => {
        result.current.clear();
      });

      expect(consoleWarnSpy).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
      global.localStorage.removeItem = originalRemoveItem;
    });

    it('only clears data for specific mode', () => {
      const dataH = [{ id: 'h1', size: '50%', collapsed: false }];
      const dataV = [{ id: 'v1', size: '50%', collapsed: false }];

      localStorage.setItem('test-split-horizontal', JSON.stringify(dataH));
      localStorage.setItem('test-split-vertical', JSON.stringify(dataV));

      const { result } = renderHook(() =>
        usePersistence(true, 'test-split', 'horizontal')
      );

      act(() => {
        result.current.clear();
      });

      const storedH = localStorage.getItem('test-split-horizontal');
      const storedV = localStorage.getItem('test-split-vertical');

      expect(storedH).toBeNull();
      expect(storedV).toBeTruthy();
    });
  });

  describe('hook stability', () => {
    it('returns stable function references', () => {
      const { result, rerender } = renderHook(() =>
        usePersistence(true, 'test-split', 'horizontal')
      );

      const initialFunctions = result.current;

      rerender();

      expect(result.current.save).toBe(initialFunctions.save);
      expect(result.current.load).toBe(initialFunctions.load);
      expect(result.current.clear).toBe(initialFunctions.clear);
    });
  });
});
