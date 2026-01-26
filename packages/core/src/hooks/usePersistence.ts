import { useCallback } from 'react';
import { debounce } from '../utils/native/throttle';
import { Pane, SplitMode } from '../types';

/**
 * usePersistence
 * 
 * Manages the serialization and retrieval of pane dimensions to localStorage.
 * Handles mode-specific keys to ensure horizontal and vertical layouts for the 
 * same ID remain distinct.
 * 
 * @param enabled - Whether auto-persistence is toggled on
 * @param storageKey - Base identifier for the storage entry
 * @param mode - Current split orientation
 */
export function usePersistence(
  enabled: boolean,
  storageKey: string,
  mode: SplitMode
) {
  /**
   * save
   * 
   * Debounced write operation to commit current pane states to localStorage.
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
   * load
   * 
   * Retrieves and parses the saved layout state from localStorage.
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
   * clear
   * 
   * Formally removes the stored state for this specific instance and mode.
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
