import React from 'react';
import { useSplitController, Split } from '@a-multilayout-splitter/core';

export default function UseSplitControllerDemo() {
  const controller = useSplitController({
    mode: 'horizontal',
    initialPanes: [
      { id: 'sidebar', size: '25%', collapsed: false, minSize: 10, maxSize: 50, content: null },
      { id: 'main', size: '50%', collapsed: false, minSize: 20, maxSize: 80, content: null },
      { id: 'panel', size: '25%', collapsed: false, minSize: 10, maxSize: 50, content: null },
    ],
  });

  // Derive collapsed array from controller state to sync with Split
  const collapsedState = controller.panes.map((p) => p.collapsed);

  const buttonStyle = {
    padding: '8px 16px',
    background: 'var(--vp-c-brand)',
    color: 'white',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 'bold' as const,
    border: 'none',
    cursor: 'pointer',
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    background: 'var(--vp-c-brand-soft)',
    color: 'var(--vp-c-brand)',
  };

  const paneContentStyle = {
    height: '100%',
    display: 'flex',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    flexDirection: 'column' as const,
    gap: '8px',
  };

  return (
    <div style={{ padding: '20px', background: 'var(--vp-c-bg-soft)', borderRadius: '8px' }}>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
        <button onClick={() => controller.togglePane(0)} style={buttonStyle}>
          {controller.panes[0]?.collapsed ? 'Show' : 'Hide'} Sidebar
        </button>
        <button onClick={() => controller.togglePane(2)} style={secondaryButtonStyle}>
          {controller.panes[2]?.collapsed ? 'Show' : 'Hide'} Panel
        </button>
        <span
          style={{
            marginLeft: 'auto',
            fontSize: '14px',
            color: 'var(--vp-c-text-2)',
            fontFamily: 'monospace',
          }}
        >
          Panes: {controller.panes.length} | Collapsed: {controller.panes.filter((p) => p.collapsed).length}
        </span>
      </div>

      <div
        style={{
          height: '300px',
          border: '1px solid var(--vp-c-divider)',
          borderRadius: '6px',
          overflow: 'hidden',
        }}
      >
        <Split initialSizes={['25%', '50%', '25%']} collapsed={collapsedState} minSizes={[10, 20, 10]} maxSizes={[50, 80, 50]}>
          <div style={{ ...paneContentStyle, background: 'var(--vp-c-bg-alt)' }}>
            <strong>Sidebar</strong>
            <span style={{ fontSize: '12px', color: 'var(--vp-c-text-2)' }}>{controller.panes[0]?.collapsed ? 'Collapsed' : 'Expanded'}</span>
          </div>
          <div style={{ ...paneContentStyle, background: 'var(--vp-c-bg)' }}>
            <strong>Main</strong>
            <span style={{ fontSize: '12px', color: 'var(--vp-c-text-2)' }}>Drag handles to resize</span>
          </div>
          <div style={{ ...paneContentStyle, background: 'var(--vp-c-bg-alt)' }}>
            <strong>Panel</strong>
            <span style={{ fontSize: '12px', color: 'var(--vp-c-text-2)' }}>{controller.panes[2]?.collapsed ? 'Collapsed' : 'Expanded'}</span>
          </div>
        </Split>
      </div>
    </div>
  );
}
