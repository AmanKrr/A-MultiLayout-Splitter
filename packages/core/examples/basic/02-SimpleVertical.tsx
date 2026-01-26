/**
 * Example 2: Simple Vertical Split
 *
 * Basic usage with two panes split vertically (top and bottom).
 */

import React from 'react';
import { Split } from '../../src';

export default function SimpleVerticalExample() {
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Split
        mode="vertical"
        initialSizes={['50%', '50%']}
      >
        <div style={{ padding: '20px', background: '#e6f3ff' }}>
          <h2>Top Pane</h2>
          <p>This is the top pane. Drag the handlebar to resize.</p>
        </div>
        <div style={{ padding: '20px', background: '#ffe6f0' }}>
          <h2>Bottom Pane</h2>
          <p>This is the bottom pane. Drag the handlebar to resize.</p>
        </div>
      </Split>
    </div>
  );
}
