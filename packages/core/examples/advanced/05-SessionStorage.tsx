/**
 * Advanced Example 5: Persistence
 *
 * Demonstrates automatic persistence to localStorage.
 * Resize the panes, then refresh the page - your layout is saved!
 */

import React from 'react';
import { Split } from '../../src';

export default function PersistenceExample() {
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <div
        style={{
          position: 'fixed',
          top: 10,
          left: 10,
          background: '#4caf50',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '8px',
          zIndex: 1000,
        }}
      >
        💾 Persistence Enabled - Try refreshing!
      </div>

      <Split id="persistent-split" mode="horizontal" initialSizes={['40%', '60%']} enablePersistence={true}>
        <div style={{ padding: '20px', background: '#e8f5e9', paddingTop: '60px' }}>
          <h2>Left Pane</h2>
          <p>1. Resize the panes by dragging</p>
          <p>2. Refresh the page (F5 or Cmd+R)</p>
          <p>3. Your layout is preserved!</p>
          <p style={{ marginTop: '20px', fontSize: '14px', opacity: 0.7 }}>* Uses localStorage (persists across sessions)</p>
        </div>
        <div style={{ padding: '20px', background: '#f3e5f5', paddingTop: '60px' }}>
          <h2>Right Pane</h2>
          <p>The layout is automatically saved to localStorage.</p>
          <p>Perfect for maintaining user preferences across sessions.</p>
          <h3>How it works:</h3>
          <ul>
            <li>Size changes are automatically saved</li>
            <li>Collapse/expand states are preserved</li>
            <li>Unique split ID required for storage key</li>
            <li>Data persists until manually cleared</li>
          </ul>
        </div>
      </Split>
    </div>
  );
}
