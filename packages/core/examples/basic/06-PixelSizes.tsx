/**
 * Example 6: Pixel-Based Sizes
 *
 * Demonstrates using pixel values instead of percentages.
 * Useful for fixed-width sidebars or toolbars.
 */

import React from 'react';
import { Split } from '../../src';

export default function PixelSizesExample() {
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Split
        mode="horizontal"
        initialSizes={['200px', '1fr', '300px']}
      >
        <div style={{ padding: '20px', background: '#e3f2fd' }}>
          <h2>Fixed Sidebar</h2>
          <p>200px width</p>
          <ul>
            <li>Nav Item 1</li>
            <li>Nav Item 2</li>
            <li>Nav Item 3</li>
          </ul>
        </div>
        <div style={{ padding: '20px', background: '#ffffff' }}>
          <h2>Main Content</h2>
          <p>Flexible width (1fr)</p>
          <p>This pane takes up remaining space.</p>
        </div>
        <div style={{ padding: '20px', background: '#f3e5f5' }}>
          <h2>Properties Panel</h2>
          <p>300px width</p>
          <div>
            <label>Property 1:</label>
            <input type="text" />
          </div>
          <div>
            <label>Property 2:</label>
            <input type="text" />
          </div>
        </div>
      </Split>
    </div>
  );
}
