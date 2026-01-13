/**
 * Split Context Provider v6
 *
 * Three-context architecture for granular subscriptions:
 * 1. ConfigContext - Static configuration (rarely changes)
 * 2. StateContext - Dynamic state (panes, sizes, collapsed)
 * 3. ActionsContext - Methods (stable references)
 *
 * This pattern prevents unnecessary re-renders:
 * - Components only subscribe to what they need
 * - Actions don't cause re-renders (stable references)
 * - Config changes are rare, isolated updates
 *
 * Optional: This provider is NOT required for basic usage.
 * Use it when you need to access split state/actions from child components.
 */

import {
  createContext,
  useContext,
  useRef,
  useMemo,
  ReactNode,
} from 'react';
import { Pane, SplitMode, AddPaneConfig, AnimationOptions } from '../types';

// ==================== Types ====================

export interface SplitConfig {
  id: string;
  mode: SplitMode;
  enableSessionStorage: boolean;
  storageKey: string;
}

export interface SplitState {
  panes: Pane[];
  isDragging: boolean;
  activeHandlebar: number | null;
}

export interface SplitActions {
  addPane: (config: AddPaneConfig) => void;
  removePane: (index: number) => void;
  togglePane: (index: number) => void;
  setPaneSize: (index: number, size: string, options?: AnimationOptions) => void;
  getPaneState: () => Pane[];
  setDragging: (dragging: boolean, handlebar?: number) => void;
}

// ==================== Contexts ====================

const ConfigContext = createContext<SplitConfig | null>(null);
const StateContext = createContext<SplitState | null>(null);
const ActionsContext = createContext<SplitActions | null>(null);

// ==================== Provider ====================

export interface SplitProviderProps {
  id: string;
  mode?: SplitMode;
  enableSessionStorage?: boolean;
  storageKey?: string;
  children: ReactNode;

  // Internal: Injected by Split component
  _panes?: Pane[];
  _addPane?: (config: AddPaneConfig) => void;
  _removePane?: (index: number) => void;
  _togglePane?: (index: number) => void;
  _setPaneSize?: (index: number, size: string, options?: AnimationOptions) => void;
  _getPaneState?: () => Pane[];
}

/**
 * SplitProvider
 *
 * Optional context provider for accessing split state/actions from child components.
 *
 * @example
 * ```tsx
 * // Wrap your Split component
 * <SplitProvider id="my-split" mode="horizontal">
 *   <Split>
 *     <ChildThatNeedsSplitAccess />
 *     <AnotherChild />
 *   </Split>
 * </SplitProvider>
 *
 * // Access from children
 * function ChildThatNeedsSplitAccess() {
 *   const { panes } = useSplitState();
 *   const { togglePane } = useSplitActions();
 *   // ...
 * }
 * ```
 */
export function SplitProvider({
  id,
  mode = 'horizontal',
  enableSessionStorage = false,
  storageKey = `split-state-${id}`,
  children,
  _panes = [],
  _addPane,
  _removePane,
  _togglePane,
  _setPaneSize,
  _getPaneState,
}: SplitProviderProps) {
  // Track drag state
  const dragStateRef = useRef({ isDragging: false, activeHandlebar: null as number | null });

  // Config (stable, rarely changes)
  const config = useMemo<SplitConfig>(
    () => ({
      id,
      mode,
      enableSessionStorage,
      storageKey,
    }),
    [id, mode, enableSessionStorage, storageKey]
  );

  // State (dynamic, changes frequently)
  const state = useMemo<SplitState>(
    () => ({
      panes: _panes,
      isDragging: dragStateRef.current.isDragging,
      activeHandlebar: dragStateRef.current.activeHandlebar,
    }),
    [_panes, dragStateRef.current.isDragging, dragStateRef.current.activeHandlebar]
  );

  // Actions (stable references)
  const actions = useMemo<SplitActions>(
    () => ({
      addPane: _addPane || (() => console.warn('addPane not available')),
      removePane: _removePane || (() => console.warn('removePane not available')),
      togglePane: _togglePane || (() => console.warn('togglePane not available')),
      setPaneSize: _setPaneSize || (() => console.warn('setPaneSize not available')),
      getPaneState: _getPaneState || (() => []),
      setDragging: (dragging: boolean, handlebar?: number) => {
        dragStateRef.current.isDragging = dragging;
        dragStateRef.current.activeHandlebar = handlebar ?? null;
      },
    }),
    [_addPane, _removePane, _togglePane, _setPaneSize, _getPaneState]
  );

  return (
    <ConfigContext.Provider value={config}>
      <StateContext.Provider value={state}>
        <ActionsContext.Provider value={actions}>
          {children}
        </ActionsContext.Provider>
      </StateContext.Provider>
    </ConfigContext.Provider>
  );
}

// ==================== Hooks ====================

/**
 * Access split configuration
 * This rarely changes, so components subscribing to this won't re-render often
 */
export function useSplitConfig(): SplitConfig {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useSplitConfig must be used within SplitProvider');
  }
  return context;
}

/**
 * Access split state
 * Subscribe to this for reactive updates to panes, drag state, etc.
 */
export function useSplitState(): SplitState {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useSplitState must be used within SplitProvider');
  }
  return context;
}

/**
 * Access split actions
 * These are stable references, so subscribing won't cause re-renders
 */
export function useSplitActions(): SplitActions {
  const context = useContext(ActionsContext);
  if (!context) {
    throw new Error('useSplitActions must be used within SplitProvider');
  }
  return context;
}

/**
 * Access full split context (convenience hook)
 * Use specific hooks above for better performance
 */
export function useSplit(): {
  config: SplitConfig;
  state: SplitState;
  actions: SplitActions;
} {
  return {
    config: useSplitConfig(),
    state: useSplitState(),
    actions: useSplitActions(),
  };
}

// ==================== Selector Hooks (for fine-grained subscriptions) ====================

/**
 * Subscribe to a specific pane
 * Only re-renders when this pane changes
 */
export function usePane(index: number): Pane | undefined {
  const { panes } = useSplitState();
  return panes[index];
}

/**
 * Subscribe to pane count
 * Only re-renders when pane count changes (not on size/collapse changes)
 */
export function usePaneCount(): number {
  const { panes } = useSplitState();
  return panes.length;
}

/**
 * Subscribe to drag state only
 */
export function useIsDragging(): boolean {
  const { isDragging } = useSplitState();
  return isDragging;
}

/**
 * Check if a specific pane is collapsed
 */
export function useIsCollapsed(index: number): boolean {
  const pane = usePane(index);
  return pane?.collapsed ?? false;
}

/**
 * Get visible panes only
 */
export function useVisiblePanes(): Pane[] {
  const { panes } = useSplitState();
  return useMemo(() => panes.filter((p) => !p.collapsed), [panes]);
}
