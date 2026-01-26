import React from 'react';
import { Split, useSplitController } from '@a-multilayout-splitter/core';

export default function NestedHookDemo() {
  const outerController = useSplitController({
    mode: 'horizontal',
    initialPanes: [
      { id: 'sidebar', size: '20%', collapsed: false, minSize: 10, maxSize: 40, content: null },
      { id: 'center', size: '50%', collapsed: false, minSize: 30, maxSize: 70, content: null },
      { id: 'right', size: '30%', collapsed: false, minSize: 15, maxSize: 50, content: null },
    ],
  });

  const innerController = useSplitController({
    mode: 'vertical',
    initialPanes: [
      { id: 'editor', size: '70%', collapsed: false, minSize: 30, maxSize: 85, content: null },
      { id: 'terminal', size: '30%', collapsed: false, minSize: 15, maxSize: 50, content: null },
    ],
  });

  const outerCollapsed = outerController.panes.map(p => p.collapsed);
  const innerCollapsed = innerController.panes.map(p => p.collapsed);

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
        <button onClick={() => outerController.togglePane(0)} style={buttonStyle}>
          {outerController.panes[0]?.collapsed ? 'Show' : 'Hide'} Sidebar
        </button>
        <button onClick={() => outerController.togglePane(2)} style={secondaryStyle}>
          {outerController.panes[2]?.collapsed ? 'Show' : 'Hide'} Right
        </button>

        <span style={{
          width: '1px',
          height: '20px',
          background: 'var(--vp-c-divider)',
          margin: '0 8px'
        }} />

        <span style={{ fontSize: '11px', color: 'var(--vp-c-text-2)', marginRight: '4px' }}>Inner:</span>
        <button onClick={() => innerController.togglePane(1)} style={secondaryStyle}>
          {innerController.panes[1]?.collapsed ? 'Show' : 'Hide'} Terminal
        </button>

        <span style={{
          marginLeft: 'auto',
          fontSize: '11px',
          color: 'var(--vp-c-text-3)',
          fontFamily: 'monospace'
        }}>
          Sidebar: {outerController.panes[0]?.collapsed ? 'closed' : 'open'} |
          Terminal: {innerController.panes[1]?.collapsed ? 'closed' : 'open'}
        </span>
      </div>

      <div style={{
        height: '300px',
        border: '1px solid var(--vp-c-divider)',
        borderRadius: '6px',
        overflow: 'hidden',
      }}>
        <Split
          mode="horizontal"
          initialSizes={['20%', '50%', '30%']}
          collapsed={outerCollapsed}
          minSizes={[10, 30, 15]}
        >
          <div style={{ ...paneStyle, background: '#252526', color: '#ccc' }}>
            <strong>Sidebar</strong>
            <span style={{ opacity: 0.6 }}>
              {outerController.panes[0]?.collapsed ? 'collapsed' : 'expanded'}
            </span>
          </div>

          <Split
            mode="vertical"
            initialSizes={['70%', '30%']}
            collapsed={innerCollapsed}
            minSizes={[30, 15]}
          >
            <div style={{ ...paneStyle, background: '#1e1e1e', color: '#d4d4d4' }}>
              <strong>Editor</strong>
              <span style={{ opacity: 0.6 }}>
                {innerController.panes[0]?.collapsed ? 'collapsed' : 'expanded'}
              </span>
            </div>
            <div style={{ ...paneStyle, background: '#0d0d0d', color: '#0f0', fontFamily: 'monospace' }}>
              <strong>Terminal</strong>
              <span style={{ opacity: 0.6 }}>
                {innerController.panes[1]?.collapsed ? 'collapsed' : 'expanded'}
              </span>
            </div>
          </Split>

          <div style={{ ...paneStyle, background: 'var(--vp-c-bg-alt)', color: 'var(--vp-c-text-1)' }}>
            <strong>Right Panel</strong>
            <span style={{ opacity: 0.6 }}>
              {outerController.panes[2]?.collapsed ? 'collapsed' : 'expanded'}
            </span>
          </div>
        </Split>
      </div>
    </div>
  );
}
