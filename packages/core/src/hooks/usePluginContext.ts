import { useRef, RefObject, useMemo } from 'react';
import { PluginContext, SplitState, SplitAction } from '../types';

/**
 * usePluginContext
 *
 * Internal hook to initialize and provide a stable reference context for plugins.
 * This context allows plugins to interact with the Split component's state and
 * lifecycle without triggering redundant renders.
 *
 * The context object itself is stable (same reference), but internally it always
 * uses the latest getState/dispatch callbacks through refs.
 *
 * @param splitId - Unique identifier of the split instance
 * @param getState - Callback to retrieve current reactive state
 * @param dispatch - Callback to trigger state modifications
 * @param containerRef - Ref to the split's underlying DOM element
 */
export function usePluginContext(
  splitId: string,
  getState: () => SplitState,
  dispatch: (action: SplitAction) => void,
  containerRef: RefObject<HTMLDivElement | null>
): PluginContext {
  // Store latest callbacks in refs so context methods always use current values
  const getStateRef = useRef(getState);
  const dispatchRef = useRef(dispatch);

  // Update refs on each render
  getStateRef.current = getState;
  dispatchRef.current = dispatch;

  // Create stable context object once per splitId
  const context = useMemo<PluginContext>(() => ({
    splitId,
    getState: () => getStateRef.current(),
    dispatch: (action: SplitAction) => dispatchRef.current(action),
    getElement: () => containerRef.current,
    getPanes: () => getStateRef.current().panes,
  }), [splitId, containerRef]);

  return context;
}
