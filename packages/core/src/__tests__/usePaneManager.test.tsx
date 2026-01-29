/**
 * usePaneManager Hook Tests
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePaneManager, redistributeSizesProportional } from '../hooks/usePaneManager';

describe('usePaneManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createChildren = (count: number) => {
    return Array.from({ length: count }, (_, i) => (
      <div key={i}>Pane {i + 1}</div>
    ));
  };

  describe('Initialization', () => {
    it('initializes with children', () => {
      const children = createChildren(3);
      const { result } = renderHook(() =>
        usePaneManager(children, ['30%', '40%', '30%'], [], [], [], 'test-split')
      );

      expect(result.current.panes).toHaveLength(3);
    });

    it('applies initial sizes', () => {
      const children = createChildren(2);
      const { result } = renderHook(() =>
        usePaneManager(children, ['40%', '60%'], [], [], [], 'test-split')
      );

      expect(result.current.panes[0].size).toBe('40%');
      expect(result.current.panes[1].size).toBe('60%');
    });

    it('applies initial collapsed state', () => {
      const children = createChildren(2);
      const { result } = renderHook(() =>
        usePaneManager(children, ['50%', '50%'], [true, false], [], [], 'test-split')
      );

      expect(result.current.panes[0].collapsed).toBe(true);
      expect(result.current.panes[1].collapsed).toBe(false);
    });

    it('applies min and max sizes', () => {
      const children = createChildren(2);
      const { result } = renderHook(() =>
        usePaneManager(children, ['50%', '50%'], [], [20, 30], [80, 70], 'test-split')
      );

      expect(result.current.panes[0].minSize).toBe(20);
      expect(result.current.panes[0].maxSize).toBe(80);
      expect(result.current.panes[1].minSize).toBe(30);
      expect(result.current.panes[1].maxSize).toBe(70);
    });

    it('defaults to 100% size when no initialSizes provided', () => {
      const children = createChildren(2);
      const { result } = renderHook(() =>
        usePaneManager(children, [], [], [], [], 'test-split')
      );

      expect(result.current.panes[0].size).toBe('100%');
      expect(result.current.panes[1].size).toBe('100%');
    });

    it('generates unique pane IDs', () => {
      const children = createChildren(3);
      const { result } = renderHook(() =>
        usePaneManager(children, [], [], [], [], 'test-split')
      );

      const ids = result.current.panes.map(p => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('addPane', () => {
    it('adds a pane at the end by default', () => {
      const children = createChildren(2);
      const { result } = renderHook(() =>
        usePaneManager(children, ['50%', '50%'], [], [], [], 'test-split')
      );

      act(() => {
        result.current.addPane({
          size: '30%',
          content: <div>New Pane</div>,
        });
      });

      expect(result.current.panes).toHaveLength(3);
    });

    it('adds a pane at specific position', () => {
      const children = createChildren(2);
      const { result } = renderHook(() =>
        usePaneManager(children, ['50%', '50%'], [], [], [], 'test-split')
      );

      act(() => {
        result.current.addPane({
          size: '30%',
          content: <div>New Pane</div>,
          position: 0,
        });
      });

      expect(result.current.panes).toHaveLength(3);
    });

    it('redistributes sizes when adding percentage pane', () => {
      const children = createChildren(2);
      const { result } = renderHook(() =>
        usePaneManager(children, ['50%', '50%'], [], [], [], 'test-split')
      );

      act(() => {
        result.current.addPane({
          size: '20%',
          content: <div>New Pane</div>,
        });
      });

      // Original panes should be scaled down
      expect(parseFloat(result.current.panes[0].size)).toBeLessThan(50);
      expect(parseFloat(result.current.panes[1].size)).toBeLessThan(50);
    });
  });

  describe('removePane', () => {
    it('removes a pane by index', () => {
      const children = createChildren(3);
      const { result } = renderHook(() =>
        usePaneManager(children, ['33%', '34%', '33%'], [], [], [], 'test-split')
      );

      act(() => {
        result.current.removePane(1);
      });

      expect(result.current.panes).toHaveLength(2);
    });

    it('redistributes size to remaining panes', () => {
      const children = createChildren(2);
      const { result } = renderHook(() =>
        usePaneManager(children, ['40%', '60%'], [], [], [], 'test-split')
      );

      const initialTotal = result.current.panes.reduce(
        (sum, p) => sum + parseFloat(p.size),
        0
      );

      act(() => {
        result.current.removePane(0);
      });

      expect(result.current.panes).toHaveLength(1);
      expect(parseFloat(result.current.panes[0].size)).toBeCloseTo(initialTotal);
    });

    it('handles invalid index gracefully', () => {
      const children = createChildren(2);
      const { result } = renderHook(() =>
        usePaneManager(children, ['50%', '50%'], [], [], [], 'test-split')
      );

      act(() => {
        result.current.removePane(-1);
        result.current.removePane(10);
      });

      expect(result.current.panes).toHaveLength(2);
    });
  });

  describe('togglePane', () => {
    it('toggles pane collapsed state', () => {
      const children = createChildren(2);
      const { result } = renderHook(() =>
        usePaneManager(children, ['50%', '50%'], [false, false], [], [], 'test-split')
      );

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

    it('handles invalid index gracefully', () => {
      const children = createChildren(2);
      const { result } = renderHook(() =>
        usePaneManager(children, ['50%', '50%'], [], [], [], 'test-split')
      );

      act(() => {
        result.current.togglePane(-1);
        result.current.togglePane(10);
      });

      // Should not throw and panes remain unchanged
      expect(result.current.panes).toHaveLength(2);
    });
  });

  describe('setPaneSize', () => {
    it('sets pane size', () => {
      const children = createChildren(2);
      const { result } = renderHook(() =>
        usePaneManager(children, ['50%', '50%'], [], [], [], 'test-split')
      );

      act(() => {
        result.current.setPaneSize(0, '30%');
      });

      expect(result.current.panes[0].size).toBe('30%');
    });

    it('handles invalid index gracefully', () => {
      const children = createChildren(2);
      const { result } = renderHook(() =>
        usePaneManager(children, ['50%', '50%'], [], [], [], 'test-split')
      );

      act(() => {
        result.current.setPaneSize(-1, '30%');
        result.current.setPaneSize(10, '30%');
      });

      expect(result.current.panes[0].size).toBe('50%');
      expect(result.current.panes[1].size).toBe('50%');
    });
  });

  describe('getPaneState', () => {
    it('returns current pane state', () => {
      const children = createChildren(2);
      const { result } = renderHook(() =>
        usePaneManager(children, ['50%', '50%'], [], [], [], 'test-split')
      );

      const state = result.current.getPaneState();
      expect(state).toEqual(result.current.panes);
    });
  });

  describe('removePanes', () => {
    it('removes multiple panes by indices', () => {
      const children = createChildren(4);
      const { result } = renderHook(() =>
        usePaneManager(children, ['25%', '25%', '25%', '25%'], [], [], [], 'test-split')
      );

      act(() => {
        result.current.removePanes([0, 2]);
      });

      expect(result.current.panes).toHaveLength(2);
    });

    it('redistributes sizes after removal', () => {
      const children = createChildren(3);
      const { result } = renderHook(() =>
        usePaneManager(children, ['33%', '34%', '33%'], [], [], [], 'test-split')
      );

      act(() => {
        result.current.removePanes([0, 2]);
      });

      expect(result.current.panes).toHaveLength(1);
      expect(parseFloat(result.current.panes[0].size)).toBeCloseTo(100);
    });
  });

  describe('swapPanes', () => {
    it('swaps two panes', () => {
      const children = createChildren(3);
      const { result } = renderHook(() =>
        usePaneManager(children, ['30%', '40%', '30%'], [], [], [], 'test-split')
      );

      const originalFirst = result.current.panes[0].id;
      const originalLast = result.current.panes[2].id;

      act(() => {
        result.current.swapPanes(0, 2);
      });

      expect(result.current.panes[0].id).toBe(originalLast);
      expect(result.current.panes[2].id).toBe(originalFirst);
    });

    it('handles same index gracefully', () => {
      const children = createChildren(2);
      const { result } = renderHook(() =>
        usePaneManager(children, ['50%', '50%'], [], [], [], 'test-split')
      );

      const originalOrder = result.current.panes.map(p => p.id);

      act(() => {
        result.current.swapPanes(0, 0);
      });

      const newOrder = result.current.panes.map(p => p.id);
      expect(newOrder).toEqual(originalOrder);
    });

    it('handles invalid indices gracefully', () => {
      const children = createChildren(2);
      const { result } = renderHook(() =>
        usePaneManager(children, ['50%', '50%'], [], [], [], 'test-split')
      );

      const originalOrder = result.current.panes.map(p => p.id);

      act(() => {
        result.current.swapPanes(-1, 0);
        result.current.swapPanes(0, 10);
      });

      const newOrder = result.current.panes.map(p => p.id);
      expect(newOrder).toEqual(originalOrder);
    });
  });

  describe('collapsePane', () => {
    it('collapses a pane', () => {
      const children = createChildren(2);
      const { result } = renderHook(() =>
        usePaneManager(children, ['50%', '50%'], [], [], [], 'test-split')
      );

      act(() => {
        result.current.collapsePane(0);
      });

      expect(result.current.panes[0].collapsed).toBe(true);
    });

    it('does not collapse already collapsed pane', () => {
      const children = createChildren(2);
      const { result } = renderHook(() =>
        usePaneManager(children, ['50%', '50%'], [true, false], [], [], 'test-split')
      );

      act(() => {
        result.current.collapsePane(0);
      });

      expect(result.current.panes[0].collapsed).toBe(true);
    });

    it('handles direction option for left', () => {
      const children = createChildren(2);
      const { result } = renderHook(() =>
        usePaneManager(children, ['50%', '50%'], [], [], [], 'test-split')
      );

      act(() => {
        result.current.collapsePane(0, { direction: 'left' });
      });

      expect(result.current.panes[0].collapsed).toBe(true);
      expect(result.current.panes[1].flexGrow).toBe(1);
    });
  });

  describe('expandPane', () => {
    it('expands a collapsed pane', () => {
      const children = createChildren(2);
      const { result } = renderHook(() =>
        usePaneManager(children, ['50%', '50%'], [true, false], [], [], 'test-split')
      );

      expect(result.current.panes[0].collapsed).toBe(true);

      act(() => {
        result.current.expandPane(0);
      });

      expect(result.current.panes[0].collapsed).toBe(false);
    });

    it('does not expand already expanded pane', () => {
      const children = createChildren(2);
      const { result } = renderHook(() =>
        usePaneManager(children, ['50%', '50%'], [false, false], [], [], 'test-split')
      );

      act(() => {
        result.current.expandPane(0);
      });

      expect(result.current.panes[0].collapsed).toBe(false);
    });
  });

  describe('resizePane', () => {
    it('resizes pane by delta', () => {
      const children = createChildren(2);
      const { result } = renderHook(() =>
        usePaneManager(children, ['50%', '50%'], [], [0, 0], [100, 100], 'test-split')
      );

      act(() => {
        result.current.resizePane(0, 10);
      });

      expect(parseFloat(result.current.panes[0].size)).toBe(60);
    });

    it('respects minSize constraint', () => {
      const children = createChildren(2);
      const { result } = renderHook(() =>
        usePaneManager(children, ['50%', '50%'], [], [30, 0], [100, 100], 'test-split')
      );

      act(() => {
        result.current.resizePane(0, -50);
      });

      expect(parseFloat(result.current.panes[0].size)).toBe(30);
    });

    it('respects maxSize constraint', () => {
      const children = createChildren(2);
      const { result } = renderHook(() =>
        usePaneManager(children, ['50%', '50%'], [], [0, 0], [70, 100], 'test-split')
      );

      act(() => {
        result.current.resizePane(0, 50);
      });

      expect(parseFloat(result.current.panes[0].size)).toBe(70);
    });
  });
});

describe('redistributeSizesProportional', () => {
  it('redistributes proportionally based on pane sizes', () => {
    const panes = [
      { id: '1', size: '25%', collapsed: false, minSize: 0, maxSize: 100, content: null },
      { id: '2', size: '75%', collapsed: false, minSize: 0, maxSize: 100, content: null },
    ];

    const result = redistributeSizesProportional(panes, '20%');

    // The 20% should be distributed proportionally
    // Pane 1 (25% of remaining) should get 25% of 20% = 5%
    // Pane 2 (75% of remaining) should get 75% of 20% = 15%
    expect(parseFloat(result[0].size)).toBeCloseTo(30);
    expect(parseFloat(result[1].size)).toBeCloseTo(90);
  });

  it('handles empty panes array', () => {
    const result = redistributeSizesProportional([], '20%');
    expect(result).toEqual([]);
  });

  it('does not modify non-percentage panes', () => {
    const panes = [
      { id: '1', size: '200px', collapsed: false, minSize: 0, maxSize: 100, content: null },
      { id: '2', size: '300px', collapsed: false, minSize: 0, maxSize: 100, content: null },
    ];

    const result = redistributeSizesProportional(panes, '20%');

    expect(result[0].size).toBe('200px');
    expect(result[1].size).toBe('300px');
  });
});
