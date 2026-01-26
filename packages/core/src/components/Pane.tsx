/**
 * Pane Component
 *
 * Individual pane component that encapsulates rendering logic.
 * Handles flex calculations and collapse state.
 */

import React from 'react';
import { PaneProps, Pane as PaneType } from '../types';
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
  size: sizeProp,
  collapsed,
  minSize,
  maxSize,
  // mode is not used in rendering but kept in props for future use
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  mode: _mode,
  content,
  flexGrow: flexGrowProp,
}) => {
  // Ensure size is never undefined
  const size = sizeProp || '100%';

  // Calculate default flex values
  const paneConfig: PaneType = {
    id,
    size,
    collapsed,
    minSize,
    maxSize,
    content, // Include content to satisfy the Pane type
  };
  const { flexGrow: defaultFlexGrow, flexShrink } = calculateFlexValues(paneConfig, collapsed);

  // Use prop flexGrow if provided, otherwise use calculated default
  const flexGrow = flexGrowProp !== undefined ? flexGrowProp : defaultFlexGrow;

  // When collapsed, flexBasis should be 0, otherwise use the calculated size
  const flexBasis = collapsed ? '0' : calculateFlexBasis(size, 0);

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
        overflow: collapsed ? 'hidden' : 'auto',
      }}
    >
      {content}
    </div>
  );
};

Pane.displayName = 'Pane';
