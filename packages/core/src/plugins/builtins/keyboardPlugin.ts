import { createPlugin } from '../createPlugin';

/**
 * Options for the keyboard navigation plugin.
 */
export interface KeyboardPluginOptions {
  /** Enable arrow key resizing */
  enableArrowKeys?: boolean;
  /** Enable number key (1-9) to focus specific panes */
  enableNumberKeys?: boolean;
  /** Relative step size for each arrow key press (percentage) */
  stepSize?: number;
  /** Enable Tab to cycle through panes */
  enableTabNavigation?: boolean;
}

/**
 * keyboardPlugin
 *
 * Provides accessibility enhancements by enabling keyboard navigation.
 * Supports resizing via arrows, focusing via numbers, and Tab cycling.
 *
 * @param options - Plugin configuration options
 */
export function keyboardPlugin(options: KeyboardPluginOptions = {}) {
  const {
    enableArrowKeys = true,
    enableNumberKeys = true,
    stepSize = 5,
    enableTabNavigation = true,
  } = options;

  let currentFocusedPaneIndex = 0;
  let keydownHandler: ((e: KeyboardEvent) => void) | null = null;

  const focusPane = (element: HTMLElement | null, index: number) => {
    if (!element) return;

    const panes = element.querySelectorAll('.a-split-pane');
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

      element.setAttribute('tabindex', '0');
      const panes = element.querySelectorAll('.a-split-pane');
      panes.forEach((pane, index) => {
        (pane as HTMLElement).setAttribute('tabindex', index === 0 ? '0' : '-1');
      });

      keydownHandler = (e: KeyboardEvent) => {
        const state = context.getState();
        const panesState = state.panes;

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

            // Use currentFocusedPaneIndex to determine which pane to resize
            // Resize the focused pane and the next pane (or previous if last pane)
            const paneIndex = currentFocusedPaneIndex;
            const currentPane = panesState[paneIndex];
            const neighborIndex = paneIndex < panesState.length - 1 ? paneIndex + 1 : paneIndex - 1;
            const neighborPane = panesState[neighborIndex];

            if (!currentPane || !neighborPane) return;

            const currentSize = parseFloat(currentPane.size);
            const neighborSize = parseFloat(neighborPane.size);

            // Calculate new sizes
            const delta = isIncrease ? stepSize : -stepSize;
            let newCurrentSize = currentSize + delta;
            let newNeighborSize = neighborSize - delta;

            // Apply min/max constraints
            const minCurrent = currentPane.minSize || 0;
            const maxCurrent = currentPane.maxSize || 100;
            const minNeighbor = neighborPane.minSize || 0;
            const maxNeighbor = neighborPane.maxSize || 100;

            newCurrentSize = Math.max(minCurrent, Math.min(maxCurrent, newCurrentSize));
            newNeighborSize = Math.max(minNeighbor, Math.min(maxNeighbor, newNeighborSize));

            // Ensure total remains consistent
            const total = currentSize + neighborSize;
            if (newCurrentSize + newNeighborSize !== total) {
              // Adjust if constraints prevented full resize
              if (newCurrentSize === minCurrent || newCurrentSize === maxCurrent) {
                newNeighborSize = total - newCurrentSize;
              } else {
                newCurrentSize = total - newNeighborSize;
              }
            }

            // Apply sizes via dispatch
            context.dispatch({
              type: 'SET_PANE_SIZE',
              payload: { index: paneIndex, size: `${newCurrentSize}%` },
            });
            context.dispatch({
              type: 'SET_PANE_SIZE',
              payload: { index: neighborIndex, size: `${newNeighborSize}%` },
            });
          }
        }

        if (enableNumberKeys) {
          const num = parseInt(e.key, 10);
          if (!isNaN(num) && num >= 1 && num <= 9) {
            const paneIndex = num - 1;
            if (paneIndex < panesState.length) {
              focusPane(element, paneIndex);
            }
          }
        }

        if (enableTabNavigation && e.key === 'Tab') {
          e.preventDefault();

          let nextIndex = e.shiftKey
            ? currentFocusedPaneIndex - 1
            : currentFocusedPaneIndex + 1;

          if (nextIndex < 0) {
            nextIndex = panesState.length - 1;
          } else if (nextIndex >= panesState.length) {
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
