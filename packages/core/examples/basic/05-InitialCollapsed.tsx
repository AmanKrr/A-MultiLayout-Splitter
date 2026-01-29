/**
 * Example 5: Initial Collapsed State
 *
 * Demonstrates starting with some panes collapsed.
 * Click the collapse buttons on the handlebar to expand/collapse.
 */

import React, { useState } from 'react';
import { Split } from '../../src';

export default function InitialCollapsedExample() {
  const [collapsed, setCollapsed] = useState([false, true, false]);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Split
        mode="horizontal"
        initialSizes={['33%', '34%', '33%']}
        collapsed={collapsed}
        onLayoutChange={(index, id, reason) => {
          if (reason === 'close' || reason === 'open') {
            setCollapsed((prev) => {
              const newCollapsed = [...prev];
              newCollapsed[index] = reason === 'close';
              return newCollapsed;
            });
          }
        }}
      >
        <div style={{ padding: '20px', background: '#e8f5e9' }}>
          <h2>Left Pane</h2>
          <p>Initially expanded</p>
        </div>
        <div style={{ padding: '20px', background: '#fff9c4' }}>
          <h2>Center Pane</h2>
          <p>Initially collapsed</p>
          <p>Click the arrow buttons on the handlebars to expand!</p>
        </div>
        <div style={{ padding: '20px', background: '#f3e5f5' }}>
          <h2>Right Pane</h2>
          <p>Initially expanded</p>
        </div>
      </Split>
    </div>
  );
}
