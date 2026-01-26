import React, { useRef } from 'react';
import { Split, type SplitRef } from '@a-multilayout-splitter/core';

export default function NestedRefDemo() {
  const outerRef = useRef<SplitRef>(null);
  const innerRef = useRef<SplitRef>(null);

  const buttonStyle = {
    padding: '6px 12px',
    background: 'var(--vp-c-brand)',
    color: 'white',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold' as const,
    border: 'none',
    cursor: 'pointer',
  };

  const secondaryStyle = {
    ...buttonStyle,
    background: 'var(--vp-c-brand-soft)',
    color: 'var(--vp-c-brand)',
  };

  const paneStyle = {
    height: '100%',
    display: 'flex',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    flexDirection: 'column' as const,
    gap: '4px',
    fontSize: '12px',
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
        <span style={{ fontSize: '11px', color: 'var(--vp-c-text-2)', marginRight: '4px' }}>Outer:</span>
        <button onClick={() => outerRef.current?.togglePane(0)} style={buttonStyle}>
          Toggle Sidebar
        </button>
        <button onClick={() => outerRef.current?.togglePane(2)} style={secondaryStyle}>
          Toggle Right
        </button>

        <span style={{
          width: '1px',
          height: '20px',
          background: 'var(--vp-c-divider)',
          margin: '0 8px'
        }} />

        <span style={{ fontSize: '11px', color: 'var(--vp-c-text-2)', marginRight: '4px' }}>Inner:</span>
        <button onClick={() => innerRef.current?.togglePane(1)} style={secondaryStyle}>
          Toggle Terminal
        </button>
      </div>

      <div style={{
        height: '300px',
        border: '1px solid var(--vp-c-divider)',
        borderRadius: '6px',
        overflow: 'hidden',
      }}>
        <Split
          ref={outerRef}
          mode="horizontal"
          initialSizes={['20%', '50%', '30%']}
          minSizes={[10, 30, 15]}
        >
          <div style={{ ...paneStyle, background: '#252526', color: '#ccc' }}>
            <strong>Sidebar</strong>
            <span style={{ opacity: 0.6 }}>outerRef[0]</span>
          </div>

          <Split
            ref={innerRef}
            mode="vertical"
            initialSizes={['70%', '30%']}
            minSizes={[30, 15]}
          >
            <div style={{ ...paneStyle, background: '#1e1e1e', color: '#d4d4d4' }}>
              <strong>Editor</strong>
              <span style={{ opacity: 0.6 }}>innerRef[0]</span>
            </div>
            <div style={{ ...paneStyle, background: '#0d0d0d', color: '#0f0', fontFamily: 'monospace' }}>
              <strong>Terminal</strong>
              <span style={{ opacity: 0.6 }}>innerRef[1]</span>
            </div>
          </Split>

          <div style={{ ...paneStyle, background: 'var(--vp-c-bg-alt)', color: 'var(--vp-c-text-1)' }}>
            <strong>Right Panel</strong>
            <span style={{ opacity: 0.6 }}>outerRef[2]</span>
          </div>
        </Split>
      </div>
    </div>
  );
}
