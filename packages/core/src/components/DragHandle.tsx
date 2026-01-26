/**
 * DragHandle Component
 *
 * Syncfusion-style handlebar component for split panes.
 * Structure: [Left Button] [Grip] [Right Button]
 */

import React from 'react';
import { DragHandleProps } from '../types';

export const DragHandle: React.FC<DragHandleProps & {
  leftPaneCollapsed?: boolean;
  rightPaneCollapsed?: boolean;
  explicitlyDisabled?: boolean;
}> = ({
  index,
  mode,
  disabled,
  lineBar,
  onMouseDown,
  onTouchStart,
  onCollapse,
  onExpand,
  renderCustom,
  leftPaneCollapsed = false,
  rightPaneCollapsed = false,
  explicitlyDisabled = false,
}) => {
  // Custom renderer
  if (renderCustom) {
    const handleRenderProps = {
      index,
      mode,
      disabled,
      lineBar,
      onMouseDown,
      onTouchStart: onTouchStart || onMouseDown,
      onCollapse,
      onExpand,
    };

    return (
      <div
        className="a-split-handlebar"
        onMouseDown={(e) => !disabled && onMouseDown(e)}
        onTouchStart={(e) => !disabled && (onTouchStart ? onTouchStart(e) : onMouseDown(e))}
      >
        {renderCustom(handleRenderProps, index)}
      </div>
    );
  }

  // Build handlebar class
  const handlebarClass = [
    'a-split-handlebar',
    mode === 'horizontal' ? 'a-split-handlebar-horizontal' : 'a-split-handlebar-vertical',
    disabled ? 'a-split-handlebar-disabled' : '',
    lineBar ? 'a-split-handlebar-line' : '',
  ].filter(Boolean).join(' ');

  // Left/Top button click handler
  // - Normal: collapse left pane
  // - When right pane collapsed: expand right pane
  const handleLeftClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (rightPaneCollapsed) {
      onExpand?.('right');
    } else {
      onCollapse?.('left');
    }
  };

  // Right/Bottom button click handler
  // - Normal: collapse right pane
  // - When left pane collapsed: expand left pane
  const handleRightClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (leftPaneCollapsed) {
      onExpand?.('left');
    } else {
      onCollapse?.('right');
    }
  };

  // Don't show buttons for lineBar or explicitly disabled
  const showButtons = !lineBar && !explicitlyDisabled;

  const isHorizontal = mode === 'horizontal';

  // Determine which buttons to hide (using visibility:hidden to keep layout):
  // When a pane is collapsed, show only the button pointing toward the collapsed pane
  // - If right pane (next pane) is collapsed: show LEFT button (points toward collapsed), hide right
  // - If left pane (prev pane) is collapsed: show RIGHT button (points toward collapsed), hide left
  // - If neither collapsed: show both buttons
  const hideLeftButton = leftPaneCollapsed && !rightPaneCollapsed;
  const hideRightButton = rightPaneCollapsed && !leftPaneCollapsed;

  // Arrow SVG paths
  const arrowLeft = isHorizontal ? "M8 3L4 6L8 9" : "M3 8L6 4L9 8";   // Points left (horizontal) / up (vertical)
  const arrowRight = isHorizontal ? "M4 3L8 6L4 9" : "M3 4L6 8L9 4";  // Points right (horizontal) / down (vertical)

  // Left button arrow: always points LEFT (toward the left/collapsed pane)
  const leftArrow = arrowLeft;

  // Right button arrow: always points RIGHT (toward the right/collapsed pane)
  const rightArrow = arrowRight;

  // Hide grip when any pane is collapsed
  const hideGrip = leftPaneCollapsed || rightPaneCollapsed;

  return (
    <div
      className={handlebarClass}
      onMouseDown={(e) => !disabled && onMouseDown(e)}
      onTouchStart={(e) => !disabled && onMouseDown(e)}
      style={{ cursor: disabled ? 'default' : isHorizontal ? 'col-resize' : 'row-resize' }}
    >
      {showButtons && (
        <>
          {/* Left/Top Button - hidden when left pane is collapsed */}
          <button
            className={`a-split-collapse-btn a-split-collapse-btn-${isHorizontal ? 'left' : 'top'}${hideLeftButton ? ' hidden' : ''}`}
            onClick={handleLeftClick}
            aria-label={rightPaneCollapsed ? `Expand ${isHorizontal ? 'right' : 'bottom'} pane` : `Collapse ${isHorizontal ? 'left' : 'top'} pane`}
            title={rightPaneCollapsed ? `Expand ${isHorizontal ? 'right' : 'bottom'} pane` : `Collapse ${isHorizontal ? 'left' : 'top'} pane`}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d={leftArrow} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Grip Icon - hidden when any pane is collapsed */}
          <div className={`a-split-grip-icon${hideGrip ? ' hidden' : ''}`} aria-hidden="true">
            {isHorizontal ? (
              <svg width="8" height="24" viewBox="0 0 8 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="4" cy="4" r="2.5" fill="currentColor" />
                <circle cx="4" cy="12" r="2.5" fill="currentColor" />
                <circle cx="4" cy="20" r="2.5" fill="currentColor" />
              </svg>
            ) : (
              <svg width="24" height="8" viewBox="0 0 24 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="4" cy="4" r="2.5" fill="currentColor" />
                <circle cx="12" cy="4" r="2.5" fill="currentColor" />
                <circle cx="20" cy="4" r="2.5" fill="currentColor" />
              </svg>
            )}
          </div>

          {/* Right/Bottom Button - hidden when right pane is collapsed */}
          <button
            className={`a-split-collapse-btn a-split-collapse-btn-${isHorizontal ? 'right' : 'bottom'}${hideRightButton ? ' hidden' : ''}`}
            onClick={handleRightClick}
            aria-label={leftPaneCollapsed ? `Expand ${isHorizontal ? 'left' : 'top'} pane` : `Collapse ${isHorizontal ? 'right' : 'bottom'} pane`}
            title={leftPaneCollapsed ? `Expand ${isHorizontal ? 'left' : 'top'} pane` : `Collapse ${isHorizontal ? 'right' : 'bottom'} pane`}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d={rightArrow} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
};

DragHandle.displayName = 'DragHandle';
