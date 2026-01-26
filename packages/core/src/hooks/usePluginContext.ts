import { useRef, RefObject } from 'react';
import { PluginContext, SplitState, SplitAction } from '../types';

/**
 * usePluginContext
 * 
 * Internal hook to initialize and provide a stable reference context for plugins. 
 * This context allows plugins to interact with the Split component's state and 
 * lifecycle without triggering redundant renders.
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
  containerRef: RefObject<HTMLDivElement>
): PluginContext {
  const contextRef = useRef<PluginContext | null>(null);

  if (!contextRef.current) {
    contextRef.current = {
      splitId,
      getState,
      dispatch,
      getElement: () => containerRef.current,
      getPanes: () => getState().panes,
    };
  }

  return contextRef.current;
}
