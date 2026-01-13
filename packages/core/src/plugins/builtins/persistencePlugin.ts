import { createPlugin } from '../createPlugin';
import { SplitState } from '../../types';

/**
 * Storage type for persistence
 */
export type StorageType = 'localStorage' | 'sessionStorage';

/**
 * Options for persistence plugin
 */
export interface PersistencePluginOptions {
  /** Storage type to use */
  storage?: StorageType;
  /** Custom storage key */
  key?: string;
  /** Debounce delay in ms */
  debounceDelay?: number;
}

/**
 * Creates a persistence plugin that saves/restores split state
 *
 * @example
 * ```typescript
 * <Split
 *   id="my-split"
 *   plugins={[persistencePlugin()]}
 * >
 *   ...
 * </Split>
 * ```
 */
export function persistencePlugin(options: PersistencePluginOptions = {}) {
  const {
    storage = 'localStorage',
    key: customKey,
    debounceDelay = 300,
  } = options;

  let debounceTimer: NodeJS.Timeout | null = null;

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
      // Try to restore saved state
      const saved = loadState(context.splitId);
      if (saved && saved.panes) {
        context.dispatch({
          type: 'RESTORE_STATE',
          payload: saved as SplitState,
        });
      }
    },

    onDragEnd(_event, context) {
      // Save state after drag
      const state = context.getState();
      debouncedSave(context.splitId, state);
    },

    onPaneAdd(_event, context) {
      // Save state after pane added
      const state = context.getState();
      debouncedSave(context.splitId, state);
    },

    onPaneRemove(_event, context) {
      // Save state after pane removed
      const state = context.getState();
      debouncedSave(context.splitId, state);
    },

    onDestroy() {
      // Clear debounce timer on cleanup
      if (debounceTimer) {
        clearTimeout(debounceTimer);
        debounceTimer = null;
      }
    },
  });
}

/**
 * Clear saved state for a specific split instance
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
