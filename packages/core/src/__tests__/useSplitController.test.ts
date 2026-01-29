/**
 * useSplitController Hook Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSplitController } from '../hooks/useSplitController';

describe('useSplitController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initialization', () => {
    it('initializes with default options', () => {
      const { result } = renderHook(() => useSplitController());

      expect(result.current.panes).toEqual([]);
      expect(result.current.mode).toBe('horizontal');
      expect(result.current.isDragging).toBe(false);
    });

    it('initializes with custom mode', () => {
      const { result } = renderHook(() => useSplitController({ mode: 'vertical' }));

      expect(result.current.mode).toBe('vertical');
    });

    it('initializes with initialSizes', () => {
      const { result } = renderHook(() =>
        useSplitController({
          initialSizes: ['30%', '40%', '30%'],
        })
      );

      expect(result.current.panes).toHaveLength(3);
      expect(result.current.panes[0].size).toBe('30%');
      expect(result.current.panes[1].size).toBe('40%');
      expect(result.current.panes[2].size).toBe('30%');
    });

    it('initializes with initialPanes', () => {
      const initialPanes = [
        { id: 'pane-1', size: '50%', collapsed: false, minSize: 10, maxSize: 90, content: null },
        { id: 'pane-2', size: '50%', collapsed: true, minSize: 20, maxSize: 80, content: null },
      ];

      const { result } = renderHook(() => useSplitController({ initialPanes }));

      expect(result.current.panes).toEqual(initialPanes);
    });

    it('applies minSizes and maxSizes', () => {
      const { result } = renderHook(() =>
        useSplitController({
          initialSizes: ['50%', '50%'],
          minSizes: [20, 30],
          maxSizes: [80, 70],
        })
      );

      expect(result.current.panes[0].minSize).toBe(20);
      expect(result.current.panes[0].maxSize).toBe(80);
      expect(result.current.panes[1].minSize).toBe(30);
      expect(result.current.panes[1].maxSize).toBe(70);
    });
  });

  describe('addPane', () => {
    it('adds a pane', () => {
      const { result } = renderHook(() => useSplitController({ initialSizes: ['50%', '50%'] }));

      act(() => {
        result.current.addPane({ size: '30%' });
      });

      expect(result.current.panes).toHaveLength(3);
    });

    it('adds a pane at specific position', () => {
      const { result } = renderHook(() => useSplitController({ initialSizes: ['50%', '50%'] }));

      act(() => {
        result.current.addPane({ size: '30%', position: 0 });
      });

      expect(result.current.panes).toHaveLength(3);
      expect(result.current.panes[0].size).toBe('30%');
    });

    it('adds pane with custom options', () => {
      const { result } = renderHook(() => useSplitController());

      act(() => {
        result.current.addPane({
          size: '50%',
          collapsed: true,
          minSize: 10,
          maxSize: 90,
        });
      });

      expect(result.current.panes[0].collapsed).toBe(true);
      expect(result.current.panes[0].minSize).toBe(10);
      expect(result.current.panes[0].maxSize).toBe(90);
    });
  });

  describe('removePane', () => {
    it('removes a pane by index', () => {
      const { result } = renderHook(() => useSplitController({ initialSizes: ['33%', '34%', '33%'] }));

      act(() => {
        result.current.removePane(1);
      });

      expect(result.current.panes).toHaveLength(2);
    });

    it('redistributes sizes after removal', () => {
      const { result } = renderHook(() => useSplitController({ initialSizes: ['50%', '50%'] }));

      act(() => {
        result.current.removePane(0);
      });

      expect(result.current.panes).toHaveLength(1);
      expect(parseFloat(result.current.panes[0].size)).toBeCloseTo(100);
    });

    it('handles invalid index', () => {
      const { result } = renderHook(() => useSplitController({ initialSizes: ['50%', '50%'] }));

      act(() => {
        result.current.removePane(-1);
        result.current.removePane(10);
      });

      expect(result.current.panes).toHaveLength(2);
    });
  });

  describe('removePanes', () => {
    it('removes multiple panes', () => {
      const { result } = renderHook(() => useSplitController({ initialSizes: ['25%', '25%', '25%', '25%'] }));

      act(() => {
        result.current.removePanes([0, 2]);
      });

      expect(result.current.panes).toHaveLength(2);
    });

    it('redistributes sizes after removal', () => {
      const { result } = renderHook(() => useSplitController({ initialSizes: ['25%', '25%', '25%', '25%'] }));

      act(() => {
        result.current.removePanes([0, 3]);
      });

      const totalSize = result.current.panes.reduce((sum, p) => sum + parseFloat(p.size), 0);
      expect(totalSize).toBeCloseTo(100);
    });
  });

  describe('togglePane', () => {
    it('toggles pane collapsed state', () => {
      const { result } = renderHook(() => useSplitController({ initialSizes: ['50%', '50%'] }));

      expect(result.current.panes[0].collapsed).toBe(false);

      act(() => {
        result.current.togglePane(0);
      });

      expect(result.current.panes[0].collapsed).toBe(true);

      act(() => {
        result.current.togglePane(0);
      });

      expect(result.current.panes[0].collapsed).toBe(false);
    });
  });

  describe('collapsePane', () => {
    it('collapses a pane', () => {
      const { result } = renderHook(() => useSplitController({ initialSizes: ['50%', '50%'] }));

      act(() => {
        result.current.collapsePane(0);
      });

      expect(result.current.panes[0].collapsed).toBe(true);
    });

    it('does not modify already collapsed pane', () => {
      const initialPanes = [
        { id: 'pane-1', size: '50%', collapsed: true, minSize: 0, maxSize: 100, content: null },
        { id: 'pane-2', size: '50%', collapsed: false, minSize: 0, maxSize: 100, content: null },
      ];

      const { result } = renderHook(() => useSplitController({ initialPanes }));

      act(() => {
        result.current.collapsePane(0);
      });

      expect(result.current.panes[0].collapsed).toBe(true);
    });
  });

  describe('expandPane', () => {
    it('expands a collapsed pane', () => {
      const initialPanes = [
        { id: 'pane-1', size: '50%', collapsed: true, minSize: 0, maxSize: 100, content: null },
        { id: 'pane-2', size: '50%', collapsed: false, minSize: 0, maxSize: 100, content: null },
      ];

      const { result } = renderHook(() => useSplitController({ initialPanes }));

      act(() => {
        result.current.expandPane(0);
      });

      expect(result.current.panes[0].collapsed).toBe(false);
    });

    it('does not modify already expanded pane', () => {
      const { result } = renderHook(() => useSplitController({ initialSizes: ['50%', '50%'] }));

      act(() => {
        result.current.expandPane(0);
      });

      expect(result.current.panes[0].collapsed).toBe(false);
    });
  });

  describe('setPaneSize', () => {
    it('sets pane size', () => {
      const { result } = renderHook(() => useSplitController({ initialSizes: ['50%', '50%'] }));

      act(() => {
        result.current.setPaneSize(0, '30%');
      });

      expect(result.current.panes[0].size).toBe('30%');
    });

    it('handles invalid index', () => {
      const { result } = renderHook(() => useSplitController({ initialSizes: ['50%', '50%'] }));

      act(() => {
        result.current.setPaneSize(-1, '30%');
        result.current.setPaneSize(10, '30%');
      });

      expect(result.current.panes[0].size).toBe('50%');
    });
  });

  describe('swapPanes', () => {
    it('swaps two panes', () => {
      const { result } = renderHook(() => useSplitController({ initialSizes: ['30%', '40%', '30%'] }));

      const originalFirst = result.current.panes[0].id;
      const originalLast = result.current.panes[2].id;

      act(() => {
        result.current.swapPanes(0, 2);
      });

      expect(result.current.panes[0].id).toBe(originalLast);
      expect(result.current.panes[2].id).toBe(originalFirst);
    });

    it('handles same index', () => {
      const { result } = renderHook(() => useSplitController({ initialSizes: ['50%', '50%'] }));

      const originalOrder = result.current.panes.map((p) => p.id);

      act(() => {
        result.current.swapPanes(0, 0);
      });

      expect(result.current.panes.map((p) => p.id)).toEqual(originalOrder);
    });
  });

  describe('setPanes', () => {
    it('sets panes directly', () => {
      const { result } = renderHook(() => useSplitController({ initialSizes: ['50%', '50%'] }));

      const newPanes = [
        { id: 'new-1', size: '60%', collapsed: false, minSize: 0, maxSize: 100, content: null },
        { id: 'new-2', size: '40%', collapsed: false, minSize: 0, maxSize: 100, content: null },
      ];

      act(() => {
        result.current.setPanes(newPanes);
      });

      expect(result.current.panes).toEqual(newPanes);
    });

    it('accepts function updater', () => {
      const { result } = renderHook(() => useSplitController({ initialSizes: ['50%', '50%'] }));

      act(() => {
        result.current.setPanes((prev) => prev.map((p) => ({ ...p, collapsed: true })));
      });

      expect(result.current.panes[0].collapsed).toBe(true);
      expect(result.current.panes[1].collapsed).toBe(true);
    });
  });

  describe('getSnapshot', () => {
    it('returns current snapshot', () => {
      const { result } = renderHook(() =>
        useSplitController({
          mode: 'vertical',
          initialSizes: ['30%', '70%'],
        })
      );

      const snapshot = result.current.getSnapshot();

      expect(snapshot.mode).toBe('vertical');
      expect(snapshot.panes).toHaveLength(2);
      expect(snapshot.timestamp).toBeDefined();
    });
  });

  describe('restore', () => {
    it('restores from snapshot', () => {
      const { result } = renderHook(() =>
        useSplitController({
          mode: 'horizontal',
          initialSizes: ['50%', '50%'],
        })
      );

      const snapshot = {
        mode: 'horizontal' as const,
        panes: [
          { id: 'pane-1', size: '30%', collapsed: false, minSize: 0, maxSize: 100, content: null },
          { id: 'pane-2', size: '70%', collapsed: true, minSize: 0, maxSize: 100, content: null },
        ],
        totalSize: 1000,
        timestamp: Date.now(),
      };

      act(() => {
        result.current.restore(snapshot);
      });

      expect(result.current.panes[0].size).toBe('30%');
      expect(result.current.panes[1].size).toBe('70%');
      expect(result.current.panes[1].collapsed).toBe(true);
    });

    it('warns when restoring with different mode', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const { result } = renderHook(() =>
        useSplitController({
          mode: 'horizontal',
          initialSizes: ['50%', '50%'],
        })
      );

      const snapshot = {
        mode: 'vertical' as const,
        panes: [{ id: 'pane-1', size: '30%', collapsed: false, minSize: 0, maxSize: 100, content: null }],
        totalSize: 1000,
        timestamp: Date.now(),
      };

      act(() => {
        result.current.restore(snapshot);
      });

      expect(consoleWarnSpy).toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });
  });

  describe('onPaneChange callback', () => {
    it('calls onPaneChange when panes change', () => {
      const onPaneChange = vi.fn();

      const { result } = renderHook(() =>
        useSplitController({
          initialSizes: ['50%', '50%'],
          onPaneChange,
        })
      );

      act(() => {
        result.current.togglePane(0);
      });

      expect(onPaneChange).toHaveBeenCalled();
    });
  });
});
