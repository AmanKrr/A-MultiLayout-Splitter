import React from 'react';
import { PaneProps, Pane as PaneType } from '../types';
import { calculateFlexBasis, calculateFlexValues } from '../utils/layoutCalculations';

/**
 * Pane
 * 
 * Individual split pane component.
 * Responsible for rendering individual pane content and applying flex styles.
 * 
 * @param props - Component properties
 */
export const Pane: React.FC<PaneProps> = ({
  id,
  size: sizeProp,
  collapsed,
  minSize,
  maxSize,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  mode: _mode,
  content,
  flexGrow: flexGrowProp,
}) => {
  const size = sizeProp || '100%';

  const paneConfig: PaneType = {
    id,
    size,
    collapsed,
    minSize,
    maxSize,
    content,
  };
  const { flexGrow: defaultFlexGrow, flexShrink } = calculateFlexValues(paneConfig, collapsed);

  const flexGrow = flexGrowProp !== undefined ? flexGrowProp : defaultFlexGrow;

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
