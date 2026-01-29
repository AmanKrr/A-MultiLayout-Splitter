/**
 * Pane Operations Utilities Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  applyCollapseState,
  togglePaneCollapse,
  findPaneIndex,
  isPaneVisible,
  getVisiblePanes,
  getPaneElement,
  constrainSize,
  createPane,
  updatePaneSize,
  batchUpdatePanes,
  restorePaneState,
  serializePaneState,
  shouldShowHandlebar,
  isHandlebarDisabled,
  isHandlebarVisible,
  isLineBarStyle,
} from '../utils/paneOperations';
import { Pane } from '../types';

describe('paneOperations utilities', () => {
  describe('applyCollapseState', () => {
    let element: HTMLElement;

    beforeEach(() => {
      element = document.createElement('div');
    });

    it('applies collapsed state', () => {
      applyCollapseState(element, true);

      expect(element.classList.contains('a-split-hidden')).toBe(true);
      expect(element.style.flexGrow).toBe('0');
      expect(element.style.flexShrink).toBe('0');
      // Browser normalizes '0' to '0px'
      expect(element.style.flexBasis).toMatch(/^0(px)?$/);
    });

    it('removes collapsed state', () => {
      element.classList.add('a-split-hidden');
      element.style.flexGrow = '0';
      element.style.flexShrink = '0';
      element.style.flexBasis = '0';

      applyCollapseState(element, false);

      expect(element.classList.contains('a-split-hidden')).toBe(false);
      expect(element.style.flexGrow).toBe('');
      expect(element.style.flexShrink).toBe('');
    });
  });

  describe('togglePaneCollapse', () => {
    it('toggles collapsed state from false to true', () => {
      const pane: Pane = {
        id: '1',
        size: '50%',
        collapsed: false,
        minSize: 0,
        maxSize: 100,
        content: null,
      };

      const result = togglePaneCollapse(pane);

      expect(result.collapsed).toBe(true);
      expect(pane.collapsed).toBe(false); // Original unchanged
    });

    it('toggles collapsed state from true to false', () => {
      const pane: Pane = {
        id: '1',
        size: '50%',
        collapsed: true,
        minSize: 0,
        maxSize: 100,
        content: null,
      };

      const result = togglePaneCollapse(pane);

      expect(result.collapsed).toBe(false);
    });
  });

  describe('findPaneIndex', () => {
    const panes: Pane[] = [
      { id: 'pane-1', size: '50%', collapsed: false, minSize: 0, maxSize: 100, content: null },
      { id: 'pane-2', size: '30%', collapsed: false, minSize: 0, maxSize: 100, content: null },
      { id: 'pane-3', size: '20%', collapsed: false, minSize: 0, maxSize: 100, content: null },
    ];

    it('finds pane by id', () => {
      expect(findPaneIndex(panes, 'pane-1')).toBe(0);
      expect(findPaneIndex(panes, 'pane-2')).toBe(1);
      expect(findPaneIndex(panes, 'pane-3')).toBe(2);
    });

    it('returns -1 for non-existent id', () => {
      expect(findPaneIndex(panes, 'non-existent')).toBe(-1);
    });

    it('handles empty array', () => {
      expect(findPaneIndex([], 'pane-1')).toBe(-1);
    });
  });

  describe('isPaneVisible', () => {
    it('returns true for non-collapsed pane', () => {
      const pane: Pane = {
        id: '1',
        size: '50%',
        collapsed: false,
        minSize: 0,
        maxSize: 100,
        content: null,
      };

      expect(isPaneVisible(pane)).toBe(true);
    });

    it('returns false for collapsed pane', () => {
      const pane: Pane = {
        id: '1',
        size: '50%',
        collapsed: true,
        minSize: 0,
        maxSize: 100,
        content: null,
      };

      expect(isPaneVisible(pane)).toBe(false);
    });
  });

  describe('getVisiblePanes', () => {
    it('returns only visible panes', () => {
      const panes: Pane[] = [
        { id: '1', size: '50%', collapsed: false, minSize: 0, maxSize: 100, content: null },
        { id: '2', size: '30%', collapsed: true, minSize: 0, maxSize: 100, content: null },
        { id: '3', size: '20%', collapsed: false, minSize: 0, maxSize: 100, content: null },
      ];

      const result = getVisiblePanes(panes);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('1');
      expect(result[1].id).toBe('3');
    });

    it('returns empty array when all collapsed', () => {
      const panes: Pane[] = [
        { id: '1', size: '50%', collapsed: true, minSize: 0, maxSize: 100, content: null },
        { id: '2', size: '50%', collapsed: true, minSize: 0, maxSize: 100, content: null },
      ];

      expect(getVisiblePanes(panes)).toEqual([]);
    });
  });

  describe('getPaneElement', () => {
    afterEach(() => {
      document.body.innerHTML = '';
    });

    it('finds pane element by id', () => {
      const element = document.createElement('div');
      element.setAttribute('data-pane-id', 'test-pane');
      document.body.appendChild(element);

      const result = getPaneElement('test-pane');
      expect(result).toBe(element);
    });

    it('returns null for non-existent id', () => {
      const result = getPaneElement('non-existent');
      expect(result).toBeNull();
    });
  });

  describe('constrainSize', () => {
    it('returns value within bounds', () => {
      expect(constrainSize(50, 20, 80)).toBe(50);
    });

    it('clamps to minimum', () => {
      expect(constrainSize(10, 20, 80)).toBe(20);
    });

    it('clamps to maximum', () => {
      expect(constrainSize(90, 20, 80)).toBe(80);
    });

    it('handles equal min and max', () => {
      expect(constrainSize(50, 30, 30)).toBe(30);
    });
  });

  describe('createPane', () => {
    it('creates pane with defaults', () => {
      const pane = createPane('test-id', '50%', <div>Content</div>);

      expect(pane.id).toBe('test-id');
      expect(pane.size).toBe('50%');
      expect(pane.collapsed).toBe(false);
      expect(pane.minSize).toBe(0);
      expect(pane.maxSize).toBe(100);
    });

    it('creates pane with custom options', () => {
      const pane = createPane('test-id', '50%', <div>Content</div>, {
        collapsed: true,
        minSize: 20,
        maxSize: 80,
      });

      expect(pane.collapsed).toBe(true);
      expect(pane.minSize).toBe(20);
      expect(pane.maxSize).toBe(80);
    });
  });

  describe('updatePaneSize', () => {
    it('returns new pane with updated size', () => {
      const pane: Pane = {
        id: '1',
        size: '50%',
        collapsed: false,
        minSize: 0,
        maxSize: 100,
        content: null,
      };

      const result = updatePaneSize(pane, '30%');

      expect(result.size).toBe('30%');
      expect(pane.size).toBe('50%'); // Original unchanged
    });
  });

  describe('batchUpdatePanes', () => {
    it('updates multiple panes', () => {
      const panes: Pane[] = [
        { id: 'pane-1', size: '50%', collapsed: false, minSize: 0, maxSize: 100, content: null },
        { id: 'pane-2', size: '50%', collapsed: false, minSize: 0, maxSize: 100, content: null },
      ];

      const updates = new Map([
        ['pane-1', { size: '30%' }],
        ['pane-2', { collapsed: true }],
      ]);

      const result = batchUpdatePanes(panes, updates);

      expect(result[0].size).toBe('30%');
      expect(result[1].collapsed).toBe(true);
    });

    it('leaves unupdated panes unchanged', () => {
      const panes: Pane[] = [
        { id: 'pane-1', size: '50%', collapsed: false, minSize: 0, maxSize: 100, content: null },
        { id: 'pane-2', size: '50%', collapsed: false, minSize: 0, maxSize: 100, content: null },
      ];

      const updates = new Map([['pane-1', { size: '30%' }]]);

      const result = batchUpdatePanes(panes, updates);

      expect(result[1].size).toBe('50%');
    });
  });

  describe('restorePaneState', () => {
    it('restores pane state from saved state', () => {
      const pane: Pane = {
        id: 'pane-1',
        size: '50%',
        collapsed: false,
        minSize: 20,
        maxSize: 80,
        content: <div>Content</div>,
      };

      const savedState = {
        id: 'pane-1',
        size: '30%',
        collapsed: true,
      };

      const result = restorePaneState(pane, savedState);

      expect(result.size).toBe('30%');
      expect(result.collapsed).toBe(true);
      expect(result.minSize).toBe(20); // Preserved
      expect(result.maxSize).toBe(80); // Preserved
    });
  });

  describe('serializePaneState', () => {
    it('serializes pane to persistence format', () => {
      const pane: Pane = {
        id: 'pane-1',
        size: '50%',
        collapsed: true,
        minSize: 20,
        maxSize: 80,
        content: <div>Content</div>,
      };

      const result = serializePaneState(pane);

      expect(result).toEqual({
        id: 'pane-1',
        size: '50%',
        collapsed: true,
      });
    });
  });

  describe('shouldShowHandlebar', () => {
    it('returns true for adjacent panes', () => {
      const prevPane: Pane = {
        id: '1',
        size: '50%',
        collapsed: false,
        minSize: 0,
        maxSize: 100,
        content: null,
      };
      const nextPane: Pane = {
        id: '2',
        size: '50%',
        collapsed: false,
        minSize: 0,
        maxSize: 100,
        content: null,
      };

      expect(shouldShowHandlebar(prevPane, nextPane)).toBe(true);
    });
  });

  describe('isHandlebarDisabled', () => {
    it('returns false when disable is undefined', () => {
      expect(isHandlebarDisabled(1, undefined)).toBe(false);
    });

    it('returns true when disable is true', () => {
      expect(isHandlebarDisabled(1, true)).toBe(true);
    });

    it('returns false when disable is false', () => {
      expect(isHandlebarDisabled(1, false)).toBe(false);
    });

    it('handles array of booleans', () => {
      expect(isHandlebarDisabled(1, [true, false])).toBe(true);
      expect(isHandlebarDisabled(2, [true, false])).toBe(false);
    });

    it('handles array of indices', () => {
      expect(isHandlebarDisabled(1, [1, 3])).toBe(true);
      expect(isHandlebarDisabled(2, [1, 3])).toBe(false);
      expect(isHandlebarDisabled(3, [1, 3])).toBe(true);
    });
  });

  describe('isHandlebarVisible', () => {
    it('returns true when visible is undefined', () => {
      expect(isHandlebarVisible(1, undefined)).toBe(true);
    });

    it('returns true when visible is true', () => {
      expect(isHandlebarVisible(1, true)).toBe(true);
    });

    it('returns false when visible is false', () => {
      expect(isHandlebarVisible(1, false)).toBe(false);
    });

    it('handles array of booleans', () => {
      expect(isHandlebarVisible(1, [true, false])).toBe(true);
      expect(isHandlebarVisible(2, [true, false])).toBe(false);
    });

    it('handles array of indices', () => {
      expect(isHandlebarVisible(1, [1, 3])).toBe(true);
      expect(isHandlebarVisible(2, [1, 3])).toBe(false);
      expect(isHandlebarVisible(3, [1, 3])).toBe(true);
    });
  });

  describe('isLineBarStyle', () => {
    it('returns false when lineBar is undefined', () => {
      expect(isLineBarStyle(1, undefined)).toBe(false);
    });

    it('returns true when lineBar is true', () => {
      expect(isLineBarStyle(1, true)).toBe(true);
    });

    it('returns false when lineBar is false', () => {
      expect(isLineBarStyle(1, false)).toBe(false);
    });

    it('handles array of booleans', () => {
      expect(isLineBarStyle(1, [true, false])).toBe(true);
      expect(isLineBarStyle(2, [true, false])).toBe(false);
    });

    it('handles array of indices', () => {
      expect(isLineBarStyle(1, [1, 3])).toBe(true);
      expect(isLineBarStyle(2, [1, 3])).toBe(false);
      expect(isLineBarStyle(3, [1, 3])).toBe(true);
    });
  });
});
