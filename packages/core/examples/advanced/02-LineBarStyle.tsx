/**
 * Advanced Example 2: Line Bar Style
 *
 * Demonstrates minimal line-style handlebars without grip icons.
 * Perfect for clean, minimalist interfaces.
 */

import React from 'react';
import { Split } from '../../src';

export default function LineBarStyleExample() {
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Split
        mode="horizontal"
        initialSizes={['50%', '50%']}
        lineBar={true} // Minimal line style
      >
        <div style={{ padding: '20px', background: '#fafafa' }}>
          <h2>Left Pane</h2>
          <p>Notice the minimal line handlebar.</p>
          <p>No grip icon or collapse buttons - just a clean line.</p>
        </div>
        <div style={{ padding: '20px', background: '#ffffff' }}>
          <h2>Right Pane</h2>
          <p>Perfect for minimalist designs!</p>
        </div>
      </Split>
    </div>
  );
}
