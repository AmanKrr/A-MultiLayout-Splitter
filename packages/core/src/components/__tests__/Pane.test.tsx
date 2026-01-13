/**
 * Pane Component Tests
 */

import { describe, it, expect } from 'vitest';
import { render } from '../../test/testUtils';
import { Pane } from '../Pane';

describe('Pane', () => {
  describe('Rendering', () => {
    it('renders with basic props', () => {
      const { container } = render(
        <Pane
          id="pane-0"
          size="50%"
          collapsed={false}
          minSize={10}
          maxSize={90}
          mode="horizontal"
          content={<div>Test Content</div>}
        />
      );

      const pane = container.querySelector('.a-split-pane');
      expect(pane).toBeInTheDocument();
      expect(pane).toHaveTextContent('Test Content');
    });

    it('applies correct data attributes', () => {
      const { container } = render(
        <Pane
          id="test-pane"
          size="30%"
          collapsed={false}
          minSize={20}
          maxSize={80}
          mode="horizontal"
          content={<div>Content</div>}
        />
      );

      const pane = container.querySelector('.a-split-pane');
      expect(pane).toHaveAttribute('data-pane-id', 'test-pane');
      expect(pane).toHaveAttribute('data-min-size', '20');
      expect(pane).toHaveAttribute('data-max-size', '80');
    });

    it('renders content correctly', () => {
      const content = (
        <div data-testid="custom-content">
          <h1>Title</h1>
          <p>Paragraph</p>
        </div>
      );

      const { getByTestId } = render(
        <Pane
          id="pane-0"
          size="50%"
          collapsed={false}
          minSize={0}
          maxSize={100}
          mode="horizontal"
          content={content}
        />
      );

      expect(getByTestId('custom-content')).toBeInTheDocument();
    });
  });

  describe('Flex Basis', () => {
    it('applies correct flexBasis with percentage', () => {
      const { container } = render(
        <Pane
          id="pane-0"
          size="60%"
          collapsed={false}
          minSize={0}
          maxSize={100}
          mode="horizontal"
          content={<div>Content</div>}
        />
      );

      const pane = container.querySelector('.a-split-pane') as HTMLElement;
      expect(pane.style.flexBasis).toBe('60%');
    });

    it('applies correct flexBasis with pixels', () => {
      const { container } = render(
        <Pane
          id="pane-0"
          size="200px"
          collapsed={false}
          minSize={0}
          maxSize={100}
          mode="horizontal"
          content={<div>Content</div>}
        />
      );

      const pane = container.querySelector('.a-split-pane') as HTMLElement;
      expect(pane.style.flexBasis).toBe('200px');
    });

    it('falls back to 100% if size is undefined', () => {
      const { container } = render(
        <Pane
          id="pane-0"
          size={undefined as any}
          collapsed={false}
          minSize={0}
          maxSize={100}
          mode="horizontal"
          content={<div>Content</div>}
        />
      );

      const pane = container.querySelector('.a-split-pane') as HTMLElement;
      expect(pane.style.flexBasis).toBe('100%');
    });
  });

  describe('Collapsed State', () => {
    it('applies a-split-hidden class when collapsed', () => {
      const { container } = render(
        <Pane
          id="pane-0"
          size="50%"
          collapsed={true}
          minSize={0}
          maxSize={100}
          mode="horizontal"
          content={<div>Content</div>}
        />
      );

      const pane = container.querySelector('.a-split-pane');
      expect(pane).toHaveClass('a-split-hidden');
    });

    it('does not apply a-split-hidden class when not collapsed', () => {
      const { container } = render(
        <Pane
          id="pane-0"
          size="50%"
          collapsed={false}
          minSize={0}
          maxSize={100}
          mode="horizontal"
          content={<div>Content</div>}
        />
      );

      const pane = container.querySelector('.a-split-pane');
      expect(pane).not.toHaveClass('a-split-hidden');
    });

    it('applies flexGrow: 0 when collapsed', () => {
      const { container } = render(
        <Pane
          id="pane-0"
          size="50%"
          collapsed={true}
          minSize={0}
          maxSize={100}
          mode="horizontal"
          content={<div>Content</div>}
        />
      );

      const pane = container.querySelector('.a-split-pane') as HTMLElement;
      expect(pane.style.flexGrow).toBe('0');
    });

    it('applies flexGrow: 1 when not collapsed', () => {
      const { container } = render(
        <Pane
          id="pane-0"
          size="50%"
          collapsed={false}
          minSize={0}
          maxSize={100}
          mode="horizontal"
          content={<div>Content</div>}
        />
      );

      const pane = container.querySelector('.a-split-pane') as HTMLElement;
      expect(pane.style.flexGrow).toBe('1');
    });
  });

  describe('Flex Properties', () => {
    it('applies flexShrink: 1 by default', () => {
      const { container } = render(
        <Pane
          id="pane-0"
          size="50%"
          collapsed={false}
          minSize={0}
          maxSize={100}
          mode="horizontal"
          content={<div>Content</div>}
        />
      );

      const pane = container.querySelector('.a-split-pane') as HTMLElement;
      expect(pane.style.flexShrink).toBe('1');
    });

    it('applies overflow: auto', () => {
      const { container } = render(
        <Pane
          id="pane-0"
          size="50%"
          collapsed={false}
          minSize={0}
          maxSize={100}
          mode="horizontal"
          content={<div>Content</div>}
        />
      );

      const pane = container.querySelector('.a-split-pane') as HTMLElement;
      expect(pane.style.overflow).toBe('auto');
    });
  });

  describe('Display Name', () => {
    it('has correct displayName', () => {
      expect(Pane.displayName).toBe('Pane');
    });
  });
});
