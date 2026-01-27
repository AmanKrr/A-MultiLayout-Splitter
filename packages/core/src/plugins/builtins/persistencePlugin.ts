import { createPlugin } from '../createPlugin';
import { SplitState } from '../../types';

/**
 * Storage backend type for persistence.
 */
export type StorageType = 'localStorage' | 'sessionStorage';

/**
 * Options for the persistence plugin.
 */
export interface PersistencePluginOptions {
  /** Which storage backend to use */
  storage?: StorageType;
  /** Custom key used for storage serialization */
  key?: string;
  /** Milliseconds to debounce save operations */
  debounceDelay?: number;
}

/**
 * persistencePlugin
 * 
 * Automatically captures and restores the state of split panes across page reloads.
 * Uses a debounced save mechanism to ensure performance during active resizing.
 * 
 * @param options - Plugin configuration options
 */
export function persistencePlugin(options: PersistencePluginOptions = {}) {
  const {
    storage = 'localStorage',
    key: customKey,
    debounceDelay = 300,
  } = options;

  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  const getStorageKey = (splitId: string) =>
    customKey || `a-multilayout-splitter:${splitId}`;

  const getStorage = (): Storage | null => {
    if (typeof window === 'undefined') return null;
    return storage === 'localStorage' ? window.localStorage : window.sessionStorage;
  };

  const saveState = (splitId: string, state: SplitState) => {
    const storageInstance = getStorage();
    if (!storageInstance) return;

    try {
      const key = getStorageKey(splitId);
      const serialized = JSON.stringify({
        panes: state.panes.map(pane => ({
          id: pane.id,
          size: pane.size,
          collapsed: pane.collapsed,
        })),
        mode: state.mode,
        timestamp: Date.now(),
      });
      storageInstance.setItem(key, serialized);
    } catch (error) {
      console.error('Failed to save split state:', error);
    }
  };

  const loadState = (splitId: string): Partial<SplitState> | null => {
    const storageInstance = getStorage();
    if (!storageInstance) return null;

    try {
      const key = getStorageKey(splitId);
      const saved = storageInstance.getItem(key);
      if (!saved) return null;

      return JSON.parse(saved);
    } catch (error) {
      console.error('Failed to load split state:', error);
      return null;
    }
  };

  const debouncedSave = (splitId: string, state: SplitState) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    debounceTimer = setTimeout(() => {
      saveState(splitId, state);
      debounceTimer = null;
    }, debounceDelay);
  };

  return createPlugin({
    name: 'persistence',
    version: '1.0.0',

    onInit(context) {
      const saved = loadState(context.splitId);
      if (saved && saved.panes) {
        context.dispatch({
          type: 'RESTORE_STATE',
          payload: { panes: saved.panes },
        });
      }
    },

    onDragEnd(_event, context) {
      const state = context.getState();
      debouncedSave(context.splitId, state);
    },

    onPaneAdd(_event, context) {
      const state = context.getState();
      debouncedSave(context.splitId, state);
    },

    onPaneRemove(_event, context) {
      const state = context.getState();
      debouncedSave(context.splitId, state);
    },

    onDestroy() {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
        debounceTimer = null;
      }
    },
  });
}

/**
 * Utility to manually clear the persisted state for a specific split ID.
 * 
 * @param splitId - Unique ID of the split instance to clear
 * @param storage - The storage backend that was used
 */
export function clearPersistedState(
  splitId: string,
  storage: StorageType = 'localStorage'
): void {
  const storageInstance =
    storage === 'localStorage' ? window.localStorage : window.sessionStorage;

  try {
    const key = `a-multilayout-splitter:${splitId}`;
    storageInstance.removeItem(key);
  } catch (error) {
    console.error('Failed to clear persisted state:', error);
  }
}
