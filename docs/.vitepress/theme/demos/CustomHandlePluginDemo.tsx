import React, { useState, useMemo } from 'react';
import { Split, customHandlePlugin, customHandleRenderPlugin, type HandleRenderProps } from '@a-multilayout-splitter/core';

// Custom handle component
const GripHandle: React.FC<HandleRenderProps> = ({ index, mode, disabled, onMouseDown }) => {
  const isHorizontal = mode === 'horizontal';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: disabled ? 'var(--vp-c-bg-alt)' : 'var(--vp-c-brand-soft)',
        cursor: disabled ? 'default' : isHorizontal ? 'col-resize' : 'row-resize',
        width: isHorizontal ? '12px' : '100%',
        height: isHorizontal ? '100%' : '12px',
        transition: 'background 0.2s ease',
      }}
      onMouseDown={disabled ? undefined : onMouseDown}
      onTouchStart={disabled ? undefined : onMouseDown}
    >
      <div style={{
        display: 'flex',
        flexDirection: isHorizontal ? 'column' : 'row',
        gap: '2px',
      }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              background: disabled ? 'var(--vp-c-text-3)' : 'var(--vp-c-brand)',
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Gradient handle using render function
const GradientHandle = (props: HandleRenderProps) => {
  const { mode, disabled, onMouseDown } = props;
  const isHorizontal = mode === 'horizontal';

  return (
    <div
      style={{
        width: isHorizontal ? '8px' : '100%',
        height: isHorizontal ? '100%' : '8px',
        background: disabled
          ? 'var(--vp-c-divider)'
          : 'linear-gradient(135deg, var(--vp-c-brand) 0%, var(--vp-c-brand-light) 100%)',
        cursor: disabled ? 'default' : isHorizontal ? 'col-resize' : 'row-resize',
        transition: 'opacity 0.2s ease',
        opacity: disabled ? 0.5 : 1,
      }}
      onMouseDown={disabled ? undefined : onMouseDown}
      onTouchStart={disabled ? undefined : onMouseDown}
    />
  );
};

type HandleType = 'default' | 'grip' | 'gradient' | 'minimal';

// Minimal handle render function (defined outside component to be stable)
const MinimalHandle = (props: HandleRenderProps) => (
  <div
    style={{
      width: props.mode === 'horizontal' ? '2px' : '100%',
      height: props.mode === 'horizontal' ? '100%' : '2px',
      background: 'var(--vp-c-brand)',
      cursor: props.disabled ? 'default' : props.mode === 'horizontal' ? 'col-resize' : 'row-resize',
    }}
    onMouseDown={props.disabled ? undefined : props.onMouseDown}
    onTouchStart={props.disabled ? undefined : props.onMouseDown}
  />
);

export default function CustomHandlePluginDemo() {
  const [handleType, setHandleType] = useState<HandleType>('grip');

  // Memoize plugins based on handleType to prevent unnecessary recreations
  const plugins = useMemo(() => {
    switch (handleType) {
      case 'grip':
        return [customHandlePlugin(GripHandle)];
      case 'gradient':
        return [customHandleRenderPlugin(GradientHandle)];
      case 'minimal':
        return [customHandleRenderPlugin(MinimalHandle)];
      default:
        return [];
    }
  }, [handleType]);

  const buttonStyle = (active: boolean) => ({
    padding: '6px 12px',
    background: active ? 'var(--vp-c-brand)' : 'var(--vp-c-bg)',
    color: active ? 'white' : 'var(--vp-c-text-1)',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold' as const,
    border: `1px solid ${active ? 'var(--vp-c-brand)' : 'var(--vp-c-divider)'}`,
    cursor: 'pointer',
  });

  const paneStyle = {
    height: '100%',
    display: 'flex',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    fontSize: '14px',
    fontWeight: 'bold' as const,
  };

  return (
    <div style={{ padding: '20px', background: 'var(--vp-c-bg-soft)', borderRadius: '8px' }}>
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '15px',
        flexWrap: 'wrap',
        alignItems: 'center',
        padding: '10px',
        background: 'var(--vp-c-bg)',
        borderRadius: '6px',
        border: '1px solid var(--vp-c-divider)'
      }}>
        <span style={{ fontSize: '12px', color: 'var(--vp-c-text-2)', marginRight: '4px' }}>Handle Style:</span>
        <button onClick={() => setHandleType('default')} style={buttonStyle(handleType === 'default')}>
          Default
        </button>
        <button onClick={() => setHandleType('grip')} style={buttonStyle(handleType === 'grip')}>
          Grip Dots
        </button>
        <button onClick={() => setHandleType('gradient')} style={buttonStyle(handleType === 'gradient')}>
          Gradient
        </button>
        <button onClick={() => setHandleType('minimal')} style={buttonStyle(handleType === 'minimal')}>
          Minimal
        </button>
      </div>

      <div style={{
        height: '200px',
        border: '1px solid var(--vp-c-divider)',
        borderRadius: '6px',
        overflow: 'hidden',
      }}>
        <Split
          key={handleType}
          mode="horizontal"
          initialSizes={['33%', '34%', '33%']}
          minSizes={[15, 15, 15]}
          plugins={plugins}
        >
          <div style={{ ...paneStyle, background: 'var(--vp-c-bg)' }}>
            Panel A
          </div>
          <div style={{ ...paneStyle, background: 'var(--vp-c-bg-alt)' }}>
            Panel B
          </div>
          <div style={{ ...paneStyle, background: 'var(--vp-c-bg)' }}>
            Panel C
          </div>
        </Split>
      </div>

      <div style={{
        marginTop: '10px',
        padding: '10px',
        background: 'var(--vp-c-bg)',
        borderRadius: '6px',
        fontSize: '12px',
        color: 'var(--vp-c-text-2)',
      }}>
        <strong>Two ways to create custom handles:</strong>
        <ul style={{ margin: '8px 0 0 20px', padding: 0 }}>
          <li><code>customHandlePlugin(Component)</code> - Pass a React component</li>
          <li><code>customHandleRenderPlugin(renderFn)</code> - Pass a render function</li>
        </ul>
      </div>
    </div>
  );
}
