import React, { ComponentType, ReactNode } from 'react';
import { createPlugin } from '../createPlugin';
import { HandleRenderProps } from '../../types';

/**
 * Props for custom handle components
 */
export interface CustomHandleComponentProps extends HandleRenderProps {
  /** Additional custom props */
  [key: string]: any;
}

/**
 * Creates a custom handle plugin that replaces default handles
 *
 * This allows full control over handle appearance and behavior while
 * maintaining all features like disable, lineBar, collapse/expand, etc.
 *
 * @example
 * ```typescript
 * const MyCustomHandle = ({ index, disabled, onMouseDown }) => (
 *   <div
 *     className="my-handle"
 *     onMouseDown={disabled ? undefined : onMouseDown}
 *   >
 *     <span>Handle {index}</span>
 *   </div>
 * );
 *
 * <Split plugins={[customHandlePlugin(MyCustomHandle)]}>
 *   ...
 * </Split>
 * ```
 */
export function customHandlePlugin(component: ComponentType<CustomHandleComponentProps>, additionalProps?: Record<string, any>) {
  return createPlugin({
    name: 'custom-handle',
    version: '1.0.0',

    renderHandle(props: HandleRenderProps): ReactNode {
      return React.createElement(component, {
        ...props,
        ...additionalProps,
      });
    },
  });
}

/**
 * Creates a custom handle plugin with a render function
 *
 * @example
 * ```typescript
 * <Split
 *   plugins={[
 *     customHandleRenderPlugin((props) => (
 *       <div className="my-handle">
 *         {!props.disabled && <DragIndicator />}
 *       </div>
 *     ))
 *   ]}
 * >
 *   ...
 * </Split>
 * ```
 */
export function customHandleRenderPlugin(render: (props: HandleRenderProps) => ReactNode) {
  return createPlugin({
    name: 'custom-handle-render',
    version: '1.0.0',

    renderHandle(props: HandleRenderProps): ReactNode {
      return render(props);
    },
  });
}
