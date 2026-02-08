/**
 * DragHandle Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { DragHandle } from '../components/DragHandle';

describe('DragHandle', () => {
  const defaultProps = {
    index: 1,
    mode: 'horizontal' as const,
    disabled: false,
    lineBar: false,
    onMouseDown: vi.fn(),
    onCollapse: vi.fn(),
    onExpand: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders with default props', () => {
      const { container } = render(<DragHandle {...defaultProps} />);

      const handlebar = container.querySelector('.a-split-handlebar');
      expect(handlebar).toBeInTheDocument();
    });

    it('applies horizontal class for horizontal mode', () => {
      const { container } = render(<DragHandle {...defaultProps} mode="horizontal" />);

      const handlebar = container.querySelector('.a-split-handlebar');
      expect(handlebar).toHaveClass('a-split-handlebar-horizontal');
    });

    it('applies vertical class for vertical mode', () => {
      const { container } = render(<DragHandle {...defaultProps} mode="vertical" />);

      const handlebar = container.querySelector('.a-split-handlebar');
      expect(handlebar).toHaveClass('a-split-handlebar-vertical');
    });

    it('applies disabled class when disabled', () => {
      const { container } = render(<DragHandle {...defaultProps} disabled={true} />);

      const handlebar = container.querySelector('.a-split-handlebar');
      expect(handlebar).toHaveClass('a-split-handlebar-disabled');
    });

    it('applies line class when lineBar is true', () => {
      const { container } = render(<DragHandle {...defaultProps} lineBar={true} />);

      const handlebar = container.querySelector('.a-split-handlebar');
      expect(handlebar).toHaveClass('a-split-handlebar-line');
    });

    it('has correct cursor class for horizontal mode', () => {
      const { container } = render(<DragHandle {...defaultProps} mode="horizontal" />);

      const handlebar = container.querySelector('.a-split-handlebar') as HTMLElement;
      expect(handlebar).toHaveClass('a-split-handlebar-horizontal');
    });

    it('has correct cursor class for vertical mode', () => {
      const { container } = render(<DragHandle {...defaultProps} mode="vertical" />);

      const handlebar = container.querySelector('.a-split-handlebar') as HTMLElement;
      expect(handlebar).toHaveClass('a-split-handlebar-vertical');
    });

    it('has disabled cursor class when disabled', () => {
      const { container } = render(<DragHandle {...defaultProps} disabled={true} />);

      const handlebar = container.querySelector('.a-split-handlebar') as HTMLElement;
      expect(handlebar).toHaveClass('a-split-handlebar-disabled');
    });
  });

  describe('Mouse Events', () => {
    it('calls onMouseDown when handlebar is clicked', () => {
      const onMouseDown = vi.fn();
      const { container } = render(<DragHandle {...defaultProps} onMouseDown={onMouseDown} />);

      const handlebar = container.querySelector('.a-split-handlebar')!;
      fireEvent.mouseDown(handlebar);

      expect(onMouseDown).toHaveBeenCalled();
    });

    it('does not call onMouseDown when disabled', () => {
      const onMouseDown = vi.fn();
      const { container } = render(<DragHandle {...defaultProps} disabled={true} onMouseDown={onMouseDown} />);

      const handlebar = container.querySelector('.a-split-handlebar')!;
      fireEvent.mouseDown(handlebar);

      expect(onMouseDown).not.toHaveBeenCalled();
    });

    it('calls onMouseDown on touch start', () => {
      const onMouseDown = vi.fn();
      const { container } = render(<DragHandle {...defaultProps} onMouseDown={onMouseDown} />);

      const handlebar = container.querySelector('.a-split-handlebar')!;
      fireEvent.touchStart(handlebar);

      expect(onMouseDown).toHaveBeenCalled();
    });
  });

  describe('Collapse/Expand Buttons', () => {
    it('renders collapse buttons when not lineBar', () => {
      const { container } = render(<DragHandle {...defaultProps} lineBar={false} />);

      const buttons = container.querySelectorAll('.a-split-collapse-btn');
      expect(buttons.length).toBe(2);
    });

    it('does not render collapse buttons when lineBar is true', () => {
      const { container } = render(<DragHandle {...defaultProps} lineBar={true} />);

      const buttons = container.querySelectorAll('.a-split-collapse-btn');
      expect(buttons.length).toBe(0);
    });

    it('does not render collapse buttons when explicitlyDisabled', () => {
      const { container } = render(<DragHandle {...defaultProps} explicitlyDisabled={true} />);

      const buttons = container.querySelectorAll('.a-split-collapse-btn');
      expect(buttons.length).toBe(0);
    });

    it('calls onCollapse with left direction when left button clicked', () => {
      const onCollapse = vi.fn();
      const { container } = render(<DragHandle {...defaultProps} onCollapse={onCollapse} />);

      const leftButton = container.querySelector('.a-split-collapse-btn-left')!;
      fireEvent.click(leftButton);

      expect(onCollapse).toHaveBeenCalledWith('left');
    });

    it('calls onCollapse with right direction when right button clicked', () => {
      const onCollapse = vi.fn();
      const { container } = render(<DragHandle {...defaultProps} onCollapse={onCollapse} />);

      const rightButton = container.querySelector('.a-split-collapse-btn-right')!;
      fireEvent.click(rightButton);

      expect(onCollapse).toHaveBeenCalledWith('right');
    });

    it('calls onExpand when right pane is collapsed and left button clicked', () => {
      const onExpand = vi.fn();
      const { container } = render(<DragHandle {...defaultProps} rightPaneCollapsed={true} onExpand={onExpand} />);

      const leftButton = container.querySelector('.a-split-collapse-btn-left')!;
      fireEvent.click(leftButton);

      expect(onExpand).toHaveBeenCalledWith('right');
    });

    it('calls onExpand when left pane is collapsed and right button clicked', () => {
      const onExpand = vi.fn();
      const { container } = render(<DragHandle {...defaultProps} leftPaneCollapsed={true} onExpand={onExpand} />);

      const rightButton = container.querySelector('.a-split-collapse-btn-right')!;
      fireEvent.click(rightButton);

      expect(onExpand).toHaveBeenCalledWith('left');
    });

    it('hides left button when left pane is collapsed', () => {
      const { container } = render(<DragHandle {...defaultProps} leftPaneCollapsed={true} />);

      const leftButton = container.querySelector('.a-split-collapse-btn-left');
      expect(leftButton).toHaveClass('hidden');
    });

    it('hides right button when right pane is collapsed', () => {
      const { container } = render(<DragHandle {...defaultProps} rightPaneCollapsed={true} />);

      const rightButton = container.querySelector('.a-split-collapse-btn-right');
      expect(rightButton).toHaveClass('hidden');
    });
  });

  describe('Grip Icon', () => {
    it('renders grip icon when not collapsed', () => {
      const { container } = render(<DragHandle {...defaultProps} />);

      const gripIcon = container.querySelector('.a-split-grip-icon');
      expect(gripIcon).toBeInTheDocument();
      expect(gripIcon).not.toHaveClass('hidden');
    });

    it('hides grip icon when left pane is collapsed', () => {
      const { container } = render(<DragHandle {...defaultProps} leftPaneCollapsed={true} />);

      const gripIcon = container.querySelector('.a-split-grip-icon');
      expect(gripIcon).toHaveClass('hidden');
    });

    it('hides grip icon when right pane is collapsed', () => {
      const { container } = render(<DragHandle {...defaultProps} rightPaneCollapsed={true} />);

      const gripIcon = container.querySelector('.a-split-grip-icon');
      expect(gripIcon).toHaveClass('hidden');
    });
  });

  describe('Custom Render', () => {
    it('uses custom render function when provided', () => {
      const renderCustom = vi.fn(() => <div data-testid="custom-handle">Custom</div>);
      const { getByTestId } = render(<DragHandle {...defaultProps} renderCustom={renderCustom} />);

      expect(getByTestId('custom-handle')).toBeInTheDocument();
      expect(renderCustom).toHaveBeenCalled();
    });

    it('passes correct props to custom render function', () => {
      const renderCustom = vi.fn(() => <div>Custom</div>);
      render(<DragHandle {...defaultProps} index={2} mode="vertical" renderCustom={renderCustom} />);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const callProps = (renderCustom as any).mock.calls[0][0];
      expect(callProps.index).toBe(2);
      expect(callProps.mode).toBe('vertical');
    });
  });

  describe('Accessibility', () => {
    it('has aria-label on collapse buttons', () => {
      const { container } = render(<DragHandle {...defaultProps} mode="horizontal" />);

      const leftButton = container.querySelector('.a-split-collapse-btn-left');
      const rightButton = container.querySelector('.a-split-collapse-btn-right');

      expect(leftButton).toHaveAttribute('aria-label');
      expect(rightButton).toHaveAttribute('aria-label');
    });

    it('has correct aria-label when right pane is collapsed', () => {
      const { container } = render(<DragHandle {...defaultProps} mode="horizontal" rightPaneCollapsed={true} />);

      const leftButton = container.querySelector('.a-split-collapse-btn-left');
      expect(leftButton?.getAttribute('aria-label')).toContain('Expand');
    });

    it('has aria-hidden on grip icon', () => {
      const { container } = render(<DragHandle {...defaultProps} />);

      const gripIcon = container.querySelector('.a-split-grip-icon');
      expect(gripIcon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Display Name', () => {
    it('has correct displayName', () => {
      expect(DragHandle.displayName).toBe('DragHandle');
    });
  });
});
