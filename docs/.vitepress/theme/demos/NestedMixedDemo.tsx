import React, { useRef } from 'react';
import { Split, type SplitRef, useSplitController } from '@a-multilayout-splitter/core';

export default function NestedMixedDemo() {
  // Ref for outer split (simple toggle, no state needed)
  const outerRef = useRef<SplitRef>(null);

  // Ref for center split (simple toggle)
  const centerRef = useRef<SplitRef>(null);

  // Hook for right panel (need reactive state for dynamic UI)
  const rightPanelController = useSplitController({
    mode: 'vertical',
    initialPanes: [
      { id: 'preview', size: '60%', collapsed: false, minSize: 20, maxSize: 80, content: null },
      { id: 'console', size: '40%', collapsed: false, minSize: 15, maxSize: 60, content: null },
    ],
  });

  const rightPanelCollapsed = rightPanelController.panes.map((p) => p.collapsed);

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

  const hookStyle = {
    ...buttonStyle,
    background: '#22c55e22',
    color: '#22c55e',
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
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '15px',
          flexWrap: 'wrap',
          alignItems: 'center',
          padding: '10px',
          background: 'var(--vp-c-bg)',
          borderRadius: '6px',
          border: '1px solid var(--vp-c-divider)',
        }}
      >
        <span style={{ fontSize: '11px', color: 'var(--vp-c-text-2)', marginRight: '4px' }}>Outer (Ref):</span>
        <button onClick={() => outerRef.current?.togglePane(0)} style={buttonStyle}>
          Toggle Sidebar
        </button>
        <button onClick={() => outerRef.current?.togglePane(2)} style={secondaryStyle}>
          Toggle Right
        </button>

        <span
          style={{
            width: '1px',
            height: '20px',
            background: 'var(--vp-c-divider)',
            margin: '0 8px',
          }}
        />

        <span style={{ fontSize: '11px', color: 'var(--vp-c-text-2)', marginRight: '4px' }}>Center (Ref):</span>
        <button onClick={() => centerRef.current?.togglePane(1)} style={secondaryStyle}>
          Toggle Terminal
        </button>

        <span
          style={{
            width: '1px',
            height: '20px',
            background: 'var(--vp-c-divider)',
            margin: '0 8px',
          }}
        />

        <span style={{ fontSize: '11px', color: 'var(--vp-c-text-2)', marginRight: '4px' }}>Right (Hook):</span>
        <button onClick={() => rightPanelController.togglePane(1)} style={hookStyle}>
          {rightPanelController.panes[1]?.collapsed ? 'Show' : 'Hide'} Console
        </button>
      </div>

      <div
        style={{
          height: '300px',
          border: '1px solid var(--vp-c-divider)',
          borderRadius: '6px',
          overflow: 'hidden',
        }}
      >
        <Split ref={outerRef} mode="horizontal" initialSizes={['20%', '50%', '30%']} minSizes={[10, 30, 15]}>
          <div style={{ ...paneStyle, background: '#252526', color: '#ccc' }}>
            <strong>Sidebar</strong>
            <span style={{ opacity: 0.6, fontSize: '10px' }}>Ref API</span>
          </div>

          <Split ref={centerRef} mode="vertical" initialSizes={['70%', '30%']} minSizes={[30, 15]}>
            <div style={{ ...paneStyle, background: '#1e1e1e', color: '#d4d4d4' }}>
              <strong>Editor</strong>
              <span style={{ opacity: 0.6, fontSize: '10px' }}>Ref API</span>
            </div>
            <div style={{ ...paneStyle, background: '#0d0d0d', color: '#0f0', fontFamily: 'monospace' }}>
              <strong>Terminal</strong>
              <span style={{ opacity: 0.6, fontSize: '10px' }}>Ref API</span>
            </div>
          </Split>

          <Split mode="vertical" initialSizes={['60%', '40%']} collapsed={rightPanelCollapsed} minSizes={[20, 15]}>
            <div style={{ ...paneStyle, background: 'var(--vp-c-bg)', color: 'var(--vp-c-text-1)' }}>
              <strong>Preview</strong>
              <span style={{ opacity: 0.6, fontSize: '10px', color: '#22c55e' }}>Hook API</span>
            </div>
            <div style={{ ...paneStyle, background: 'var(--vp-c-bg-alt)', color: 'var(--vp-c-text-2)' }}>
              <strong>Console</strong>
              <span style={{ opacity: 0.6, fontSize: '10px', color: '#22c55e' }}>Hook API</span>
              <span style={{ fontSize: '10px', color: 'var(--vp-c-text-3)' }}>({rightPanelController.panes[1]?.collapsed ? 'collapsed' : 'expanded'})</span>
            </div>
          </Split>
        </Split>
      </div>

      <div
        style={{
          marginTop: '10px',
          fontSize: '11px',
          color: 'var(--vp-c-text-3)',
          fontFamily: 'monospace',
        }}
      >
        Console state: {rightPanelController.panes[1]?.collapsed ? 'collapsed' : 'expanded'} (reactive via Hook)
      </div>
    </div>
  );
}
