/**
 * Pane Component
 *
 * Individual pane component that encapsulates rendering logic.
 * Handles flex calculations and collapse state.
 */

import React from 'react';
import { PaneProps } from '../types';
import { calculateFlexBasis, calculateFlexValues } from '../utils/layoutCalculations';

/**
 * Pane - Individual split pane with content
 *
 * @example
 * ```tsx
 * <Pane
 *   id="pane-0"
 *   size="50%"
 *   collapsed={false}
 *   minSize={10}
 *   maxSize={90}
 *   mode="horizontal"
 *   content={<div>Content</div>}
 * />
 * ```
 */
export const Pane: React.FC<PaneProps> = ({
  id,
  size,
  collapsed,
  minSize,
  maxSize,
  // mode is not used in rendering but kept in props for future use
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  mode: _mode,
  content,
}) => {
  // Calculate flex values
  const { flexGrow, flexShrink } = calculateFlexValues({ collapsed } as any, collapsed);
  const flexBasis = calculateFlexBasis(size, 0); // containerSize will be applied by CSS

  return (
    <div
      data-pane-id={id}
      data-min-size={minSize}
      data-max-size={maxSize}
      className={`a-split-pane${collapsed ? ' a-split-hidden' : ''}`}
      style={{
        flexBasis,
        flexGrow,
        flexShrink,
        overflow: 'auto',
      }}
    >
      {content}
    </div>
  );
};

Pane.displayName = 'Pane';
