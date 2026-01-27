import React, { useState, useMemo } from 'react';
import { Split, persistencePlugin, clearPersistedState } from '@a-multilayout-splitter/core';

const SPLIT_ID = 'persistence-demo';

export default function PersistencePluginDemo() {
  const [key, setKey] = useState(0);

  // Memoize the plugin to prevent recreation on every render
  const plugins = useMemo(() => [
    persistencePlugin({
      storage: 'localStorage',
      key: `demo-${SPLIT_ID}`,
      debounceDelay: 300,
    })
  ], []);

  const handleClearAndReset = () => {
    clearPersistedState(SPLIT_ID, 'localStorage');
    setKey(prev => prev + 1);
  };

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
    gap: '8px',
    fontSize: '14px',
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
        <button onClick={handleClearAndReset} style={buttonStyle}>
          Clear Storage & Reset
        </button>
        <button onClick={() => window.location.reload()} style={secondaryStyle}>
          Reload Page
        </button>
        <span style={{
          marginLeft: 'auto',
          fontSize: '11px',
          color: 'var(--vp-c-text-3)',
          fontFamily: 'monospace'
        }}>
          Resize panes, then reload to see persistence
        </span>
      </div>

      <div style={{
        height: '200px',
        border: '1px solid var(--vp-c-divider)',
        borderRadius: '6px',
        overflow: 'hidden',
      }}>
        <Split
          key={key}
          id={SPLIT_ID}
          mode="horizontal"
          initialSizes={['30%', '40%', '30%']}
          minSizes={[15, 20, 15]}
          plugins={plugins}
        >
          <div style={{ ...paneStyle, background: 'var(--vp-c-bg)' }}>
            <strong>Panel A</strong>
            <span style={{ fontSize: '11px', opacity: 0.7 }}>30% initial</span>
          </div>
          <div style={{ ...paneStyle, background: 'var(--vp-c-bg-alt)' }}>
            <strong>Panel B</strong>
            <span style={{ fontSize: '11px', opacity: 0.7 }}>40% initial</span>
          </div>
          <div style={{ ...paneStyle, background: 'var(--vp-c-bg)' }}>
            <strong>Panel C</strong>
            <span style={{ fontSize: '11px', opacity: 0.7 }}>30% initial</span>
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
        <strong>How it works:</strong>
        <ul style={{ margin: '8px 0 0 20px', padding: 0 }}>
          <li>Drag to resize the panes</li>
          <li>Reload the page - your layout is preserved!</li>
          <li>Click "Clear Storage & Reset" to start fresh</li>
        </ul>
      </div>
    </div>
  );
}
