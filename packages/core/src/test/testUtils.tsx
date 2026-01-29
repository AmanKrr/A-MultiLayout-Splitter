/**
 * Test Utilities
 *
 * Helper functions and utilities for writing tests.
 */

import { render, RenderOptions } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';
import { SplitProvider, SplitProviderProps } from '../contexts/SplitProvider';

/**
 * Custom render function that wraps components with providers
 */
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  providerProps?: Partial<SplitProviderProps>;
}

export function renderWithProvider(ui: ReactElement, options?: CustomRenderOptions) {
  const { providerProps, ...renderOptions } = options || {};

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <SplitProvider id={providerProps?.id || 'test-split'} mode={providerProps?.mode || 'horizontal'} {...providerProps}>
        {children}
      </SplitProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

/**
 * Create mock pane elements for testing
 */
export function createMockPanes(count: number): ReactNode[] {
  return Array.from({ length: count }, (_, i) => (
    <div key={i} data-testid={`pane-${i}`}>
      Pane {i + 1}
    </div>
  ));
}

/**
 * Mock getBoundingClientRect for an element
 */
export function mockElementSize(element: HTMLElement, size: { width: number; height: number; x?: number; y?: number }) {
  Object.defineProperty(element, 'offsetWidth', {
    configurable: true,
    value: size.width,
  });
  Object.defineProperty(element, 'offsetHeight', {
    configurable: true,
    value: size.height,
  });

  element.getBoundingClientRect = vi.fn(() => ({
    width: size.width,
    height: size.height,
    x: size.x || 0,
    y: size.y || 0,
    top: size.y || 0,
    left: size.x || 0,
    bottom: (size.y || 0) + size.height,
    right: (size.x || 0) + size.width,
    toJSON: () => {},
  }));
}

/**
 * Simulate drag operation on a handlebar
 */
export function simulateDrag(handlebar: HTMLElement, delta: { x?: number; y?: number }) {
  const startX = 100;
  const startY = 100;

  // Mouse down
  handlebar.dispatchEvent(
    new MouseEvent('mousedown', {
      bubbles: true,
      clientX: startX,
      clientY: startY,
    })
  );

  // Mouse move
  window.dispatchEvent(
    new MouseEvent('mousemove', {
      bubbles: true,
      clientX: startX + (delta.x || 0),
      clientY: startY + (delta.y || 0),
    })
  );

  // Mouse up
  window.dispatchEvent(
    new MouseEvent('mouseup', {
      bubbles: true,
      clientX: startX + (delta.x || 0),
      clientY: startY + (delta.y || 0),
    })
  );
}

/**
 * Get localStorage mock with spy functions
 */
export function createLocalStorageMock() {
  const store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach((key) => delete store[key]);
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    }),
  };
}

/**
 * Wait for next tick (useful for async operations)
 */
export function waitForNextTick() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

/**
 * Wait for RAF to complete
 */
export function waitForRAF() {
  return new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
}

// Re-export everything from @testing-library/react
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
