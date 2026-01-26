/**
 * Example 4: Min/Max Sizes
 *
 * Demonstrates setting minimum and maximum sizes for panes.
 * Try to resize - the panes won't go below/above the constraints.
 */

import React from 'react';
import { Split } from '../../src';

export default function MinMaxSizesExample() {
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Split
        mode="horizontal"
        initialSizes={['30%', '70%']}
        minSizes={[20, 30]}  // Left: min 20%, Right: min 30%
        maxSizes={[50, 80]}  // Left: max 50%, Right: max 80%
      >
        <div style={{ padding: '20px', background: '#e3f2fd' }}>
          <h2>Left Pane</h2>
          <p><strong>Min:</strong> 20% width</p>
          <p><strong>Max:</strong> 50% width</p>
          <p>Try resizing - it won't go beyond these limits!</p>
        </div>
        <div style={{ padding: '20px', background: '#fce4ec' }}>
          <h2>Right Pane</h2>
          <p><strong>Min:</strong> 30% width</p>
          <p><strong>Max:</strong> 80% width</p>
          <p>The constraints ensure usability.</p>
        </div>
      </Split>
    </div>
  );
}
