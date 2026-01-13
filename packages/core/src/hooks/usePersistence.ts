import { useCallback } from 'react';
import { debounce } from '../utils/native/throttle';
import { Pane, SplitMode } from '../types';

/**
 * usePersistence - Handles localStorage persistence
 *
 * This hook provides:
 * - Save pane state to localStorage
 * - Load pane state from localStorage
 * - Debounced saves to avoid performance issues
 * - Separate storage keys for horizontal/vertical modes
 *
 * @param enabled - Enable/disable persistence
 * @param storageKey - Base key for localStorage
 * @param mode - Split mode (affects storage key)
 */
export function usePersistence(
  enabled: boolean,
  storageKey: string,
  mode: SplitMode
) {
  /**
   * Save pane state to localStorage
   * Debounced at 300ms to avoid excessive writes during drag
   */
  const save = useCallback(
    debounce((panes: Pane[]) => {
      if (!enabled) return;

      try {
        const key = `${storageKey}-${mode}`;
        const data = panes.map((pane) => ({
          id: pane.id,
          size: pane.size,
          collapsed: pane.collapsed,
        }));

        localStorage.setItem(key, JSON.stringify(data));
      } catch (error) {
        console.warn('Failed to save split state to localStorage:', error);
      }
    }, 300),
    [enabled, storageKey, mode]
  );

  /**
   * Load pane state from localStorage
   */
  const load = useCallback((): Array<{
    id: string;
    size: string;
    collapsed: boolean;
  }> | null => {
    if (!enabled) return null;

    try {
      const key = `${storageKey}-${mode}`;
      const stored = localStorage.getItem(key);

      if (!stored) return null;

      return JSON.parse(stored);
    } catch (error) {
      console.warn('Failed to load split state from localStorage:', error);
      return null;
    }
  }, [enabled, storageKey, mode]);

  /**
   * Clear saved state
   */
  const clear = useCallback(() => {
    if (!enabled) return;

    try {
      const key = `${storageKey}-${mode}`;
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to clear split state from localStorage:', error);
    }
  }, [enabled, storageKey, mode]);

  return {
    save,
    load,
    clear,
  };
}
