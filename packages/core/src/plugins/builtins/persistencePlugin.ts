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
      const savedPanes = saved?.panes;

      if (savedPanes && savedPanes.length > 0) {
        // Use setTimeout to restore state AFTER React has completed initial render
        // and applied initialSizes. This ensures persistence overrides initialSizes.
        setTimeout(() => {
          const currentState = context.getState();
          // Only restore if pane count matches (layout structure unchanged)
          if (currentState.panes.length === savedPanes.length) {
            context.dispatch({
              type: 'RESTORE_STATE',
              payload: { panes: savedPanes as { size: string; collapsed: boolean; id: string }[] },
            });
          }
        }, 0);
      } else {
        // No saved state - save the initial state after render completes
        setTimeout(() => {
          const state = context.getState();
          saveState(context.splitId, state);
        }, 0);
      }
    },

    onDragEnd(_event, context) {
      // Use setTimeout to ensure state is updated after React's state batch
      // The drag handler calls setPaneSize before onDragEnd, but React batches state updates
      setTimeout(() => {
        const state = context.getState();
        debouncedSave(context.splitId, state);
      }, 0);
    },

    onPaneAdd(_event, context) {
      setTimeout(() => {
        const state = context.getState();
        debouncedSave(context.splitId, state);
      }, 0);
    },

    onPaneRemove(_event, context) {
      setTimeout(() => {
        const state = context.getState();
        debouncedSave(context.splitId, state);
      }, 0);
    },

    onPaneCollapse(_event, context) {
      setTimeout(() => {
        const state = context.getState();
        debouncedSave(context.splitId, state);
      }, 0);
    },

    onPaneExpand(_event, context) {
      setTimeout(() => {
        const state = context.getState();
        debouncedSave(context.splitId, state);
      }, 0);
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
