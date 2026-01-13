/**
 * Nesting Context - Phase 5
 *
 * Provides automatic nesting level detection for Split components.
 * Helps automatically apply fixClass for deeply nested layouts.
 */

import React, { createContext, useContext, ReactNode } from 'react';

/**
 * Nesting level context
 */
const NestingContext = createContext<number>(0);

/**
 * Hook to get current nesting level
 *
 * @returns Current nesting depth (0 = top level, 1 = first nested, etc.)
 *
 * @example
 * ```tsx
 * const level = useNestingLevel();
 * const needsFix = level > 2; // Auto-apply fix for deep nesting
 * ```
 */
export function useNestingLevel(): number {
  return useContext(NestingContext);
}

/**
 * Hook to check if fix class is needed based on nesting level
 *
 * @param threshold - Nesting level threshold (default: 2)
 * @returns True if current level exceeds threshold
 *
 * @example
 * ```tsx
 * const needsFix = useNeedsFixClass();
 * // Returns true if nesting level > 2
 * ```
 */
export function useNeedsFixClass(threshold: number = 2): boolean {
  const level = useNestingLevel();
  return level > threshold;
}

/**
 * Nesting provider props
 */
export interface NestingProviderProps {
  /** Current nesting level */
  level?: number;
  /** Child elements */
  children: ReactNode;
}

/**
 * Nesting Provider Component
 *
 * Wraps Split components to provide nesting level information.
 * Automatically increments level for nested Splits.
 *
 * @example
 * ```tsx
 * <NestingProvider level={0}>
 *   <Split>
 *     <Pane>Content</Pane>
 *     <Pane>
 *       <NestingProvider level={1}>
 *         <Split>
 *           <Pane>Nested content</Pane>
 *         </Split>
 *       </NestingProvider>
 *     </Pane>
 *   </Split>
 * </NestingProvider>
 * ```
 */
export const NestingProvider: React.FC<NestingProviderProps> = ({
  level = 0,
  children,
}) => {
  return (
    <NestingContext.Provider value={level}>
      {children}
    </NestingContext.Provider>
  );
};

NestingProvider.displayName = 'NestingProvider';

/**
 * HOC to wrap a component with nesting detection
 *
 * @param Component - Component to wrap
 * @returns Wrapped component with automatic nesting level increment
 *
 * @example
 * ```tsx
 * const SplitWithNesting = withNesting(Split);
 * // Now automatically increments nesting level for children
 * ```
 */
export function withNesting<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> {
  const WrappedComponent: React.FC<P> = (props) => {
    const currentLevel = useNestingLevel();

    return (
      <NestingProvider level={currentLevel + 1}>
        <Component {...props} />
      </NestingProvider>
    );
  };

  WrappedComponent.displayName = `withNesting(${Component.displayName || Component.name || 'Component'})`;

  return WrappedComponent;
}
