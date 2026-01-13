import { createPlugin } from '../createPlugin';

/**
 * Options for keyboard navigation plugin
 */
export interface KeyboardPluginOptions {
  /** Enable arrow key navigation */
  enableArrowKeys?: boolean;
  /** Enable number key navigation (1-9 to focus panes) */
  enableNumberKeys?: boolean;
  /** Step size for arrow key adjustments (in pixels) */
  stepSize?: number;
  /** Enable Tab key to cycle through panes */
  enableTabNavigation?: boolean;
}

/**
 * Creates a keyboard navigation plugin for accessibility
 *
 * Features:
 * - Arrow keys to resize panes
 * - Number keys to focus specific panes
 * - Tab navigation between panes
 *
 * @example
 * ```typescript
 * <Split
 *   id="my-split"
 *   plugins={[keyboardPlugin({ stepSize: 20 })]}
 * >
 *   ...
 * </Split>
 * ```
 */
export function keyboardPlugin(options: KeyboardPluginOptions = {}) {
  const {
    enableArrowKeys = true,
    enableNumberKeys = true,
    stepSize = 10,
    enableTabNavigation = true,
  } = options;

  let currentFocusedPaneIndex = 0;
  let keydownHandler: ((e: KeyboardEvent) => void) | null = null;

  const focusPane = (element: HTMLElement | null, index: number) => {
    if (!element) return;

    const panes = element.querySelectorAll('.a-split-control-pane');
    const pane = panes[index] as HTMLElement;

    if (pane) {
      pane.focus();
      pane.setAttribute('tabindex', '0');
      currentFocusedPaneIndex = index;
    }
  };

  return createPlugin({
    name: 'keyboard',
    version: '1.0.0',

    onInit(context) {
      const element = context.getElement();
      if (!element) return;

      // Make container and panes focusable
      element.setAttribute('tabindex', '0');
      const panes = element.querySelectorAll('.a-split-control-pane');
      panes.forEach((pane, index) => {
        (pane as HTMLElement).setAttribute('tabindex', index === 0 ? '0' : '-1');
      });

      keydownHandler = (e: KeyboardEvent) => {
        const state = context.getState();
        const panes = state.panes;

        // Arrow key navigation
        if (enableArrowKeys) {
          if (
            e.key === 'ArrowLeft' ||
            e.key === 'ArrowRight' ||
            e.key === 'ArrowUp' ||
            e.key === 'ArrowDown'
          ) {
            e.preventDefault();

            const isHorizontal = state.mode === 'horizontal';
            const isIncrease =
              (isHorizontal && e.key === 'ArrowRight') ||
              (!isHorizontal && e.key === 'ArrowDown');

            const direction = isIncrease ? 'increase' : 'decrease';

            context.dispatch({
              type: 'ADJUST_PANE_SIZE',
              payload: {
                direction,
                amount: stepSize,
              },
            });
          }
        }

        // Number key navigation (1-9)
        if (enableNumberKeys) {
          const num = parseInt(e.key, 10);
          if (!isNaN(num) && num >= 1 && num <= 9) {
            const paneIndex = num - 1;
            if (paneIndex < panes.length) {
              focusPane(element, paneIndex);
            }
          }
        }

        // Tab navigation
        if (enableTabNavigation && e.key === 'Tab') {
          e.preventDefault();

          let nextIndex = e.shiftKey
            ? currentFocusedPaneIndex - 1
            : currentFocusedPaneIndex + 1;

          // Wrap around
          if (nextIndex < 0) {
            nextIndex = panes.length - 1;
          } else if (nextIndex >= panes.length) {
            nextIndex = 0;
          }

          focusPane(element, nextIndex);
        }
      };

      element.addEventListener('keydown', keydownHandler);
    },

    onDestroy(context) {
      const element = context.getElement();
      if (element && keydownHandler) {
        element.removeEventListener('keydown', keydownHandler);
        keydownHandler = null;
      }
    },
  });
}
