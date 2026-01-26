import { useCallback } from "react";
import { debounce } from "../utils/native/throttle";
import { Pane, SplitMode } from "../types";

/**
 * usePersistence
 * Manages saving and loading pane state to/from localStorage.
 */
export function usePersistence(enabled: boolean, storageKey: string, mode: SplitMode) {
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
        console.warn("Failed to save split state:", error);
      }
    }, 300),
    [enabled, storageKey, mode],
  );

  const load = useCallback((): Array<{
    id: string;
    size: string;
    collapsed: boolean;
  }> | null => {
    if (!enabled) return null;

    try {
      const key = `${storageKey}-${mode}`;
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.warn("Failed to load split state:", error);
      return null;
    }
  }, [enabled, storageKey, mode]);

  const clear = useCallback(() => {
    if (!enabled) return;

    try {
      const key = `${storageKey}-${mode}`;
      localStorage.removeItem(key);
    } catch (error) {
      console.warn("Failed to clear split state:", error);
    }
  }, [enabled, storageKey, mode]);

  return { save, load, clear };
}
