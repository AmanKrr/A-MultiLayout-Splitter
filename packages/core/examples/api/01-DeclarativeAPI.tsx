/**
 * API Example 1: Declarative API (Recommended)
 *
 * Control the split component through props and state.
 * React-friendly approach with predictable behavior.
 */

import React, { useState } from 'react';
import { Split } from '../../src';

export default function DeclarativeAPIExample() {
  const [sizes, setSizes] = useState(['33%', '33%', '34%']);
  const [collapsed, setCollapsed] = useState([false, false, false]);

  const resetLayout = () => {
    setSizes(['33%', '33%', '34%']);
    setCollapsed([false, false, false]);
  };

  const collapseMiddle = () => {
    setCollapsed([false, true, false]);
  };

  return (
    <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Control Panel */}
      <div style={{ padding: '10px', background: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
        <button onClick={resetLayout} style={{ marginRight: '10px' }}>
          Reset Layout
        </button>
        <button onClick={collapseMiddle} style={{ marginRight: '10px' }}>
          Collapse Middle
        </button>
        <button onClick={() => setSizes(['20%', '60%', '20%'])} style={{ marginRight: '10px' }}>
          Set Custom Sizes
        </button>
      </div>

      {/* Split Component */}
      <div style={{ flex: 1 }}>
        <Split
          mode="horizontal"
          initialSizes={sizes}
          collapsed={collapsed}
          onLayoutChange={(index, id, reason) => {
            console.log(`Pane ${index} (${id}): ${reason}`);
          }}
        >
          <div style={{ padding: '20px', background: '#e8f5e9' }}>
            <h2>Pane 1</h2>
            <p>Current size: {sizes[0]}</p>
            <p>Collapsed: {collapsed[0] ? 'Yes' : 'No'}</p>
          </div>
          <div style={{ padding: '20px', background: '#fff9c4' }}>
            <h2>Pane 2</h2>
            <p>Current size: {sizes[1]}</p>
            <p>Collapsed: {collapsed[1] ? 'Yes' : 'No'}</p>
          </div>
          <div style={{ padding: '20px', background: '#f3e5f5' }}>
            <h2>Pane 3</h2>
            <p>Current size: {sizes[2]}</p>
            <p>Collapsed: {collapsed[2] ? 'Yes' : 'No'}</p>
          </div>
        </Split>
      </div>
    </div>
  );
}
