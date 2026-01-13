import { useRef, RefObject } from 'react';
import { PluginContext, SplitState, SplitAction } from '../types';

/**
 * Hook to create plugin context
 */
export function usePluginContext(
  splitId: string,
  getState: () => SplitState,
  dispatch: (action: SplitAction) => void,
  containerRef: RefObject<HTMLDivElement>
): PluginContext {
  const contextRef = useRef<PluginContext | null>(null);

  // Create stable context object
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
