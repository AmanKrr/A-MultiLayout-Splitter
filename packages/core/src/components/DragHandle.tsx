/**
 * DragHandle Component
 *
 * Separate, reusable handlebar component for split panes.
 * Handles both custom and default rendering.
 */

import React from 'react';
import { DragHandleProps } from '../types';

/**
 * DragHandle - Renders the draggable handlebar between panes
 *
 * @example
 * ```tsx
 * <DragHandle
 *   index={1}
 *   mode="horizontal"
 *   disabled={false}
 *   lineBar={false}
 *   onMouseDown={(e) => handleDrag(e)}
 * />
 * ```
 */
export const DragHandle: React.FC<DragHandleProps> = ({
  index,
  mode,
  disabled,
  lineBar,
  onMouseDown,
  renderCustom,
}) => {
  // Custom renderer provided
  if (renderCustom) {
    return (
      <div
        className="a-split-handlebar"
        onMouseDown={(e) => !disabled && onMouseDown(e)}
        onTouchStart={(e) => !disabled && onMouseDown(e)}
      >
        {renderCustom({ index, disabled }, index)}
      </div>
    );
  }

  // Default handlebar
  const handlebarClass = [
    'a-split-handlebar',
    mode === 'horizontal' ? 'a-split-handlebar-horizontal' : 'a-split-handlebar-vertical',
    disabled ? 'a-split-handlebar-disabled' : '',
    lineBar ? 'a-split-handlebar-line' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={handlebarClass}
      onMouseDown={(e) => !disabled && onMouseDown(e)}
      onTouchStart={(e) => !disabled && onMouseDown(e)}
      style={{
        cursor: disabled ? 'default' : mode === 'horizontal' ? 'col-resize' : 'row-resize',
      }}
    />
  );
};

DragHandle.displayName = 'DragHandle';
