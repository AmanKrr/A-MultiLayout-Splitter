import { createContext, useContext, useRef, useMemo, ReactNode } from 'react';
import { Pane, SplitMode, AddPaneConfig, AnimationOptions } from '../types';

/**
 * SplitConfig
 */
export interface SplitConfig {
  /** Unique identifier for the split instance */
  id: string;
  /** Current layout orientation */
  mode: SplitMode;
  /** Whether localStorage persistence is active */
  enablePersistence: boolean;
  /** Key used for localStorage persistence */
  storageKey: string;
}

/**
 * SplitState
 */
export interface SplitState {
  /** Current list of pane configurations */
  panes: Pane[];
  /** Whether a drag operation is currently active */
  isDragging: boolean;
  /** Index of the handlebar currently being dragged */
  activeHandlebar: number | null;
}

/**
 * SplitActions
 */
export interface SplitActions {
  /** Programmatically add a new pane */
  addPane: (config: AddPaneConfig) => void;
  /** Programmatically remove a pane by index */
  removePane: (index: number) => void;
  /** Toggle the collapse state of a pane */
  togglePane: (index: number) => void;
  /** Explicitly set the size of a pane */
  setPaneSize: (index: number, size: string, options?: AnimationOptions) => void;
  /** Retrieve the current reactive pane state */
  getPaneState: () => Pane[];
  /** Internal action to update drag state */
  setDragging: (dragging: boolean, handlebar?: number) => void;
}

const ConfigContext = createContext<SplitConfig | null>(null);
const StateContext = createContext<SplitState | null>(null);
const ActionsContext = createContext<SplitActions | null>(null);

/**
 * SplitProviderProps
 */
export interface SplitProviderProps {
  id: string;
  mode?: SplitMode;
  enablePersistence?: boolean;
  storageKey?: string;
  children: ReactNode;

  // Internal props injected by the Split component
  /** @internal */
  _panes?: Pane[];
  /** @internal */
  _addPane?: (config: AddPaneConfig) => void;
  /** @internal */
  _removePane?: (index: number) => void;
  /** @internal */
  _togglePane?: (index: number) => void;
  /** @internal */
  _setPaneSize?: (index: number, size: string, options?: AnimationOptions) => void;
  /** @internal */
  _getPaneState?: () => Pane[];
}

/**
 * SplitProvider
 *
 * An optional context provider that exposes split state and actions to nested components.
 * Useful for building custom toolbars or complex layouts that need to interact with the splitter.
 *
 * @param props - Provider configuration
 */
export function SplitProvider({
  id,
  mode = 'horizontal',
  enablePersistence = false,
  storageKey = `split-state-${id}`,
  children,
  _panes = [],
  _addPane,
  _removePane,
  _togglePane,
  _setPaneSize,
  _getPaneState,
}: SplitProviderProps) {
  const dragStateRef = useRef({ isDragging: false, activeHandlebar: null as number | null });

  const config = useMemo<SplitConfig>(
    () => ({
      id,
      mode,
      enablePersistence,
      storageKey,
    }),
    [id, mode, enablePersistence, storageKey]
  );

  const state = useMemo<SplitState>(
    () => ({
      panes: _panes,
      isDragging: dragStateRef.current.isDragging,
      activeHandlebar: dragStateRef.current.activeHandlebar,
    }),
    [_panes, dragStateRef.current.isDragging, dragStateRef.current.activeHandlebar]
  );

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
        <ActionsContext.Provider value={actions}>{children}</ActionsContext.Provider>
      </StateContext.Provider>
    </ConfigContext.Provider>
  );
}

/**
 * useSplitConfig
 *
 * Hook to retrieve the static configuration of the current Split instance.
 */
export function useSplitConfig(): SplitConfig {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useSplitConfig must be used within SplitProvider');
  }
  return context;
}

/**
 * useSplitState
 *
 * Hook to subscribe to the reactive state (panes, drag status) of the Split instance.
 */
export function useSplitState(): SplitState {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useSplitState must be used within SplitProvider');
  }
  return context;
}

/**
 * useSplitActions
 *
 * Hook to access methods for controlling the Split instance.
 * These methods are stable and do not trigger re-renders.
 */
export function useSplitActions(): SplitActions | null {
  const context = useContext(ActionsContext);
  return context;
}

/**
 * useSplit
 *
 * Convenience hook that returns the full split context (config, state, and actions).
 */
export function useSplit(): {
  config: SplitConfig;
  state: SplitState;
  actions: SplitActions;
} {
  const actions = useSplitActions();
  if (!actions) {
    throw new Error('useSplit must be used within SplitProvider');
  }
  return {
    config: useSplitConfig(),
    state: useSplitState(),
    actions,
  };
}

/**
 * usePane
 *
 * Fine-grained hook to subscribe to state updates for a specific pane.
 */
export function usePane(index: number): Pane | undefined {
  const { panes } = useSplitState();
  return panes[index];
}

/**
 * usePaneCount
 *
 * Hook to retrieve and subscribe to the total number of panes.
 */
export function usePaneCount(): number {
  const { panes } = useSplitState();
  return panes.length;
}

/**
 * useIsDragging
 *
 * Hook to subscribe specifically to the active dragging status.
 */
export function useIsDragging(): boolean {
  const { isDragging } = useSplitState();
  return isDragging;
}

/**
 * useIsCollapsed
 *
 * Hook to check and subscribe to the collapsed state of a specific pane.
 */
export function useIsCollapsed(index: number): boolean {
  const pane = usePane(index);
  return pane?.collapsed ?? false;
}

/**
 * useVisiblePanes
 *
 * Hook to retrieve and subscribe to only the currently expanded panes.
 */
export function useVisiblePanes(): Pane[] {
  const { panes } = useSplitState();
  return useMemo(() => panes.filter((p) => !p.collapsed), [panes]);
}
