import React, { useState, useRef, useMemo } from 'react';
import { Split, type SplitRef, keyboardPlugin } from '@a-multilayout-splitter/core';

export default function KeyboardPluginDemo() {
  const splitRef = useRef<SplitRef>(null);
  const [focusedPane, setFocusedPane] = useState<number | null>(null);
  const [lastAction, setLastAction] = useState<string>('Click on the split area to focus');

  // Memoize the plugin to prevent recreation on every render
  const plugins = useMemo(
    () => [
      keyboardPlugin({
        enableArrowKeys: true,
        enableNumberKeys: true,
        enableTabNavigation: true,
        stepSize: 5,
      }),
    ],
    []
  );

  const handleFocus = () => {
    setLastAction('Split focused - use keyboard now!');
  };

  const paneStyle = {
    height: '100%',
    display: 'flex',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    flexDirection: 'column' as const,
    gap: '4px',
    fontSize: '14px',
    transition: 'background 0.2s ease',
  };

  const keyStyle = {
    display: 'inline-block',
    padding: '2px 6px',
    background: 'var(--vp-c-bg-alt)',
    borderRadius: '4px',
    fontFamily: 'monospace',
    fontSize: '11px',
    border: '1px solid var(--vp-c-divider)',
  };

  return (
    <div style={{ padding: '20px', background: 'var(--vp-c-bg-soft)', borderRadius: '8px' }}>
      <div
        style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '15px',
          flexWrap: 'wrap',
          alignItems: 'center',
          padding: '12px',
          background: 'var(--vp-c-bg)',
          borderRadius: '6px',
          border: '1px solid var(--vp-c-divider)',
        }}
      >
        <div style={{ fontSize: '12px', color: 'var(--vp-c-text-2)' }}>
          <strong>Keyboard Controls:</strong>
        </div>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '12px' }}>
          <span>
            <span style={keyStyle}>←</span> <span style={keyStyle}>→</span> Resize
          </span>
          <span>
            <span style={keyStyle}>1</span>-<span style={keyStyle}>3</span> Focus pane
          </span>
          <span>
            <span style={keyStyle}>Tab</span> Cycle panes
          </span>
        </div>
      </div>

      <div
        style={{
          height: '200px',
          border: '2px solid var(--vp-c-divider)',
          borderRadius: '6px',
          overflow: 'hidden',
          outline: 'none',
        }}
        onFocus={handleFocus}
      >
        <Split ref={splitRef} mode="horizontal" initialSizes={['33%', '34%', '33%']} minSizes={[15, 15, 15]} plugins={plugins}>
          <div
            style={{
              ...paneStyle,
              background: focusedPane === 0 ? 'var(--vp-c-brand-soft)' : 'var(--vp-c-bg)',
            }}
            onFocus={() => setFocusedPane(0)}
            onBlur={() => setFocusedPane(null)}
          >
            <strong>Pane 1</strong>
            <span style={{ fontSize: '11px', opacity: 0.7 }}>
              Press <span style={keyStyle}>1</span> to focus
            </span>
          </div>
          <div
            style={{
              ...paneStyle,
              background: focusedPane === 1 ? 'var(--vp-c-brand-soft)' : 'var(--vp-c-bg-alt)',
            }}
            onFocus={() => setFocusedPane(1)}
            onBlur={() => setFocusedPane(null)}
          >
            <strong>Pane 2</strong>
            <span style={{ fontSize: '11px', opacity: 0.7 }}>
              Press <span style={keyStyle}>2</span> to focus
            </span>
          </div>
          <div
            style={{
              ...paneStyle,
              background: focusedPane === 2 ? 'var(--vp-c-brand-soft)' : 'var(--vp-c-bg)',
            }}
            onFocus={() => setFocusedPane(2)}
            onBlur={() => setFocusedPane(null)}
          >
            <strong>Pane 3</strong>
            <span style={{ fontSize: '11px', opacity: 0.7 }}>
              Press <span style={keyStyle}>3</span> to focus
            </span>
          </div>
        </Split>
      </div>

      <div
        style={{
          marginTop: '10px',
          padding: '10px',
          background: 'var(--vp-c-bg)',
          borderRadius: '6px',
          fontSize: '12px',
          color: 'var(--vp-c-text-2)',
          fontFamily: 'monospace',
          textAlign: 'center' as const,
        }}
      >
        {lastAction}
      </div>

      <div
        style={{
          marginTop: '10px',
          padding: '10px',
          background: 'var(--vp-c-bg)',
          borderRadius: '6px',
          fontSize: '12px',
          color: 'var(--vp-c-text-2)',
        }}
      >
        <strong>Accessibility Features:</strong>
        <ul style={{ margin: '8px 0 0 20px', padding: 0 }}>
          <li>
            <strong>Arrow Keys:</strong> Resize the focused pane
          </li>
          <li>
            <strong>Number Keys (1-9):</strong> Jump to specific pane
          </li>
          <li>
            <strong>Tab/Shift+Tab:</strong> Cycle through panes
          </li>
        </ul>
      </div>
    </div>
  );
}
