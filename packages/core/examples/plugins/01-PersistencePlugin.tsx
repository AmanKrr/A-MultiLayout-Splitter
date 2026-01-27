/**
 * Plugin Example 1: Persistence Plugin
 *
 * Demonstrates the built-in persistence plugin for saving layouts
 * to localStorage with automatic serialization.
 */

import React from 'react';
import { Split, persistencePlugin } from '../../src';

// Configure persistence plugin
const myPersistencePlugin = persistencePlugin({
  storage: 'localStorage',  // 'localStorage' or 'sessionStorage'
  debounceDelay: 500,       // Save after 500ms of inactivity
});

export default function PersistencePluginExample() {
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <div style={{
        position: 'fixed',
        top: 10,
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#2196f3',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '8px',
        zIndex: 1000,
        textAlign: 'center'
      }}>
        💾 Persistence Plugin Active<br />
        <small>Resize and close the browser - layout persists!</small>
      </div>

      <Split
        id="persistent-example"
        mode="horizontal"
        initialSizes={['40%', '60%']}
        plugins={[myPersistencePlugin]}
      >
        <div style={{ padding: '20px', background: '#e8f5e9', paddingTop: '80px' }}>
          <h2>Left Pane</h2>
          <h3>Persistence Plugin Features:</h3>
          <ul>
            <li>✅ Automatic saving to storage</li>
            <li>✅ Debounced updates (performance)</li>
            <li>✅ Automatic restoration on mount</li>
            <li>✅ Preserves sizes and collapse states</li>
            <li>✅ Works with localStorage or sessionStorage</li>
          </ul>
          <h3>Try it:</h3>
          <ol>
            <li>Resize the panes</li>
            <li>Collapse/expand panes</li>
            <li>Close and reopen this page</li>
            <li>Your layout is restored! 🎉</li>
          </ol>
        </div>
        <div style={{ padding: '20px', background: '#f3e5f5', paddingTop: '80px' }}>
          <h2>Right Pane</h2>
          <h3>Configuration Options:</h3>
          <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px' }}>
{`const plugin = persistencePlugin({
  storage: 'localStorage',
  debounce: 500,
});`}
          </pre>
          <h3>Storage Key:</h3>
          <p>Data stored at:</p>
          <code style={{ background: '#000', color: '#0f0', padding: '5px 10px', borderRadius: '4px' }}>
            a-multilayout-splitter:persistent-example
          </code>
        </div>
      </Split>
    </div>
  );
}
