/**
 * Split Component Tests
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Split } from '../components/Split';

describe('Split', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Rendering', () => {
    it('renders with children', () => {
      const { container } = render(
        <Split>
          <div>Pane 1</div>
          <div>Pane 2</div>
        </Split>
      );

      expect(container.querySelector('.a-split-container')).toBeInTheDocument();
      expect(container.querySelectorAll('.a-split-pane')).toHaveLength(2);
    });

    it('applies horizontal mode by default', () => {
      const { container } = render(
        <Split>
          <div>Pane 1</div>
          <div>Pane 2</div>
        </Split>
      );

      const splitContainer = container.querySelector('.a-split-container') as HTMLElement;
      expect(splitContainer.style.flexDirection).toBe('row');
    });

    it('applies vertical mode when specified', () => {
      const { container } = render(
        <Split mode="vertical">
          <div>Pane 1</div>
          <div>Pane 2</div>
        </Split>
      );

      const splitContainer = container.querySelector('.a-split-container') as HTMLElement;
      expect(splitContainer).toHaveClass('a-split-vertical');
      expect(splitContainer.style.flexDirection).toBe('column');
    });

    it('renders handlebars between panes', () => {
      const { container } = render(
        <Split>
          <div>Pane 1</div>
          <div>Pane 2</div>
          <div>Pane 3</div>
        </Split>
      );

      expect(container.querySelectorAll('.a-split-handlebar')).toHaveLength(2);
    });

    it('applies custom className', () => {
      const { container } = render(
        <Split className="custom-split">
          <div>Pane 1</div>
          <div>Pane 2</div>
        </Split>
      );

      expect(container.querySelector('.a-split-container')).toHaveClass('custom-split');
    });

    it('applies custom id', () => {
      const { container } = render(
        <Split id="my-split">
          <div>Pane 1</div>
          <div>Pane 2</div>
        </Split>
      );

      expect(container.querySelector('#my-split')).toBeInTheDocument();
    });

    it('applies custom styles', () => {
      const { container } = render(
        <Split style={{ backgroundColor: 'red' }}>
          <div>Pane 1</div>
          <div>Pane 2</div>
        </Split>
      );

      const splitContainer = container.querySelector('.a-split-container') as HTMLElement;
      expect(splitContainer.style.backgroundColor).toBe('red');
    });

    it('applies custom width and height', () => {
      const { container } = render(
        <Split width="800px" height="600px">
          <div>Pane 1</div>
          <div>Pane 2</div>
        </Split>
      );

      const splitContainer = container.querySelector('.a-split-container') as HTMLElement;
      expect(splitContainer.style.width).toBe('800px');
      expect(splitContainer.style.height).toBe('600px');
    });

    it('generates unique id when not provided', () => {
      const { container } = render(
        <Split>
          <div>Pane 1</div>
          <div>Pane 2</div>
        </Split>
      );

      const splitContainer = container.querySelector('.a-split-container');
      expect(splitContainer?.id).toMatch(/^split-/);
    });
  });

  describe('Initial Sizes', () => {
    it('applies initialSizes to panes', async () => {
      const { container } = render(
        <Split initialSizes={['30%', '70%']}>
          <div>Pane 1</div>
          <div>Pane 2</div>
        </Split>
      );

      const panes = container.querySelectorAll('.a-split-pane') as NodeListOf<HTMLElement>;
      expect(panes[0].style.flexBasis).toBe('30%');
      expect(panes[1].style.flexBasis).toBe('70%');
    });

    it('applies pixel-based initialSizes', async () => {
      const { container } = render(
        <Split initialSizes={['200px', '300px']}>
          <div>Pane 1</div>
          <div>Pane 2</div>
        </Split>
      );

      const panes = container.querySelectorAll('.a-split-pane') as NodeListOf<HTMLElement>;
      expect(panes[0].style.flexBasis).toBe('200px');
      expect(panes[1].style.flexBasis).toBe('300px');
    });
  });

  describe('Min/Max Sizes', () => {
    it('applies minSizes to panes', () => {
      const { container } = render(
        <Split initialSizes={['50%', '50%']} minSizes={[20, 30]}>
          <div>Pane 1</div>
          <div>Pane 2</div>
        </Split>
      );

      const panes = container.querySelectorAll('.a-split-pane');
      expect(panes[0]).toHaveAttribute('data-min-size', '20');
      expect(panes[1]).toHaveAttribute('data-min-size', '30');
    });

    it('applies maxSizes to panes', () => {
      const { container } = render(
        <Split initialSizes={['50%', '50%']} maxSizes={[80, 70]}>
          <div>Pane 1</div>
          <div>Pane 2</div>
        </Split>
      );

      const panes = container.querySelectorAll('.a-split-pane');
      expect(panes[0]).toHaveAttribute('data-max-size', '80');
      expect(panes[1]).toHaveAttribute('data-max-size', '70');
    });
  });

  describe('Collapsed State', () => {
    it('applies initial collapsed state', () => {
      const { container } = render(
        <Split initialSizes={['50%', '50%']} collapsed={[true, false]}>
          <div>Pane 1</div>
          <div>Pane 2</div>
        </Split>
      );

      const panes = container.querySelectorAll('.a-split-pane');
      expect(panes[0]).toHaveClass('a-split-hidden');
      expect(panes[1]).not.toHaveClass('a-split-hidden');
    });
  });

  describe('Disable Prop', () => {
    it('disables all handlebars when disable is true', () => {
      const { container } = render(
        <Split disable={true}>
          <div>Pane 1</div>
          <div>Pane 2</div>
        </Split>
      );

      const handlebar = container.querySelector('.a-split-handlebar');
      expect(handlebar).toHaveClass('a-split-handlebar-disabled');
    });

    it('disables specific handlebars when disable is array of indices', () => {
      const { container } = render(
        <Split disable={[1]}>
          <div>Pane 1</div>
          <div>Pane 2</div>
          <div>Pane 3</div>
        </Split>
      );

      const handlebars = container.querySelectorAll('.a-split-handlebar');
      expect(handlebars[0]).toHaveClass('a-split-handlebar-disabled');
      expect(handlebars[1]).not.toHaveClass('a-split-handlebar-disabled');
    });
  });

  describe('Visible Prop', () => {
    it('does not render handlebars when visible is false', () => {
      const { container } = render(
        <Split visible={false}>
          <div>Pane 1</div>
          <div>Pane 2</div>
        </Split>
      );

      // When visible=false, handlebars are not rendered at all
      const handlebars = container.querySelectorAll('.a-split-handlebar');
      expect(handlebars).toHaveLength(0);
    });

    it('only renders handlebars for visible indices when visible is array', () => {
      const { container } = render(
        <Split visible={[2]}>
          <div>Pane 1</div>
          <div>Pane 2</div>
          <div>Pane 3</div>
        </Split>
      );

      // Only handlebar at index 2 should be rendered
      const handlebars = container.querySelectorAll('.a-split-handlebar');
      expect(handlebars).toHaveLength(1);
    });
  });

  describe('LineBar Prop', () => {
    it('applies lineBar style when lineBar is true', () => {
      const { container } = render(
        <Split lineBar={true}>
          <div>Pane 1</div>
          <div>Pane 2</div>
        </Split>
      );

      const handlebar = container.querySelector('.a-split-handlebar');
      expect(handlebar).toHaveClass('a-split-handlebar-line');
    });

    it('applies lineBar to specific handlebars when array', () => {
      const { container } = render(
        <Split lineBar={[1]}>
          <div>Pane 1</div>
          <div>Pane 2</div>
          <div>Pane 3</div>
        </Split>
      );

      const handlebars = container.querySelectorAll('.a-split-handlebar');
      expect(handlebars[0]).toHaveClass('a-split-handlebar-line');
      expect(handlebars[1]).not.toHaveClass('a-split-handlebar-line');
    });
  });

  describe('Callbacks', () => {
    it('calls onLayoutChange when pane is collapsed', async () => {
      const onLayoutChange = vi.fn();
      const { container } = render(
        <Split onLayoutChange={onLayoutChange}>
          <div>Pane 1</div>
          <div>Pane 2</div>
        </Split>
      );

      const collapseButton = container.querySelector('.a-split-collapse-btn-left');
      if (collapseButton) {
        fireEvent.click(collapseButton);
        await waitFor(() => {
          expect(onLayoutChange).toHaveBeenCalled();
        });
      }
    });
  });

  describe('Imperative Handle', () => {
    it('exposes addPane method', () => {
      const ref = React.createRef<any>();
      render(
        <Split ref={ref}>
          <div>Pane 1</div>
          <div>Pane 2</div>
        </Split>
      );

      expect(ref.current?.addPane).toBeDefined();
      expect(typeof ref.current?.addPane).toBe('function');
    });

    it('exposes removePane method', () => {
      const ref = React.createRef<any>();
      render(
        <Split ref={ref}>
          <div>Pane 1</div>
          <div>Pane 2</div>
        </Split>
      );

      expect(ref.current?.removePane).toBeDefined();
      expect(typeof ref.current?.removePane).toBe('function');
    });

    it('exposes togglePane method', () => {
      const ref = React.createRef<any>();
      render(
        <Split ref={ref}>
          <div>Pane 1</div>
          <div>Pane 2</div>
        </Split>
      );

      expect(ref.current?.togglePane).toBeDefined();
      expect(typeof ref.current?.togglePane).toBe('function');
    });

    it('exposes setPaneSize method', () => {
      const ref = React.createRef<any>();
      render(
        <Split ref={ref}>
          <div>Pane 1</div>
          <div>Pane 2</div>
        </Split>
      );

      expect(ref.current?.setPaneSize).toBeDefined();
      expect(typeof ref.current?.setPaneSize).toBe('function');
    });

    it('exposes getSnapshot method', () => {
      const ref = React.createRef<any>();
      render(
        <Split ref={ref}>
          <div>Pane 1</div>
          <div>Pane 2</div>
        </Split>
      );

      expect(ref.current?.getSnapshot).toBeDefined();
      expect(typeof ref.current?.getSnapshot).toBe('function');

      const snapshot = ref.current?.getSnapshot();
      expect(snapshot).toHaveProperty('panes');
      expect(snapshot).toHaveProperty('mode');
      expect(snapshot).toHaveProperty('timestamp');
    });

    it('exposes restore method', () => {
      const ref = React.createRef<any>();
      render(
        <Split ref={ref}>
          <div>Pane 1</div>
          <div>Pane 2</div>
        </Split>
      );

      expect(ref.current?.restore).toBeDefined();
      expect(typeof ref.current?.restore).toBe('function');
    });

    it('exposes collapsePane method', () => {
      const ref = React.createRef<any>();
      render(
        <Split ref={ref}>
          <div>Pane 1</div>
          <div>Pane 2</div>
        </Split>
      );

      expect(ref.current?.collapsePane).toBeDefined();
      expect(typeof ref.current?.collapsePane).toBe('function');
    });

    it('exposes expandPane method', () => {
      const ref = React.createRef<any>();
      render(
        <Split ref={ref}>
          <div>Pane 1</div>
          <div>Pane 2</div>
        </Split>
      );

      expect(ref.current?.expandPane).toBeDefined();
      expect(typeof ref.current?.expandPane).toBe('function');
    });
  });

  describe('Fix Class', () => {
    it('applies fix class when fixClass is true', () => {
      const { container } = render(
        <Split fixClass={true}>
          <div>Pane 1</div>
          <div>Pane 2</div>
        </Split>
      );

      expect(container.querySelector('.a-split-container')).toHaveClass('a-split-fix');
    });

    it('does not apply fix class by default', () => {
      const { container } = render(
        <Split>
          <div>Pane 1</div>
          <div>Pane 2</div>
        </Split>
      );

      expect(container.querySelector('.a-split-container')).not.toHaveClass('a-split-fix');
    });
  });

  describe('Display Name', () => {
    it('has correct displayName', () => {
      expect(Split.displayName).toBe('Split');
    });
  });
});
