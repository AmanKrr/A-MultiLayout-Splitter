import React, { createContext, useContext, ReactNode } from 'react';

/**
 * Internal context for tracking the nesting depth of Split components.
 */
const NestingContext = createContext<number>(0);

/**
 * useNestingLevel
 *
 * Hook to retrieve the current nesting depth.
 * 0 indicates top-level, 1 indicates first nested level, etc.
 */
export function useNestingLevel(): number {
  return useContext(NestingContext);
}

/**
 * useNeedsFixClass
 *
 * Determines if a CSS fix class is necessary based on nesting depth.
 * Deeply nested layouts sometimes require specific CSS overrides to maintain correct flex distribution.
 *
 * @param threshold - The nesting level at which the fix class is applied (default: 2)
 */
export function useNeedsFixClass(threshold: number = 2): boolean {
  const level = useNestingLevel();
  return level > threshold;
}

/**
 * NestingProviderProps
 */
export interface NestingProviderProps {
  /** The specific nesting level to provide to children */
  level?: number;
  /** React children */
  children: ReactNode;
}

/**
 * NestingProvider
 *
 * Provides nesting level information to descendant Split components.
 */
export const NestingProvider: React.FC<NestingProviderProps> = ({ level = 0, children }) => {
  return <NestingContext.Provider value={level}>{children}</NestingContext.Provider>;
};

NestingProvider.displayName = 'NestingProvider';

/**
 * withNesting
 *
 * Higher-Order Component (HOC) that automatically increments the nesting level
 * for any component it wraps.
 *
 * @param Component - The component to be enhanced with nesting detection
 */
export function withNesting<P extends object>(Component: React.ComponentType<P>): React.FC<P> {
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
