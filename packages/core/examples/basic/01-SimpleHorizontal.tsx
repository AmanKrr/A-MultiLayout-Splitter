/**
 * Example 1: Simple Horizontal Split
 *
 * The most basic usage of the Split component with two panes
 * split horizontally (side by side).
 */

import React from 'react';
import { Split } from '../../src';

export default function SimpleHorizontalExample() {
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Split mode="horizontal" initialSizes={['50%', '50%']}>
        <div style={{ padding: '20px', background: '#f0f8ff' }}>
          <h2>Left Pane</h2>
          <p>This is the left pane. Drag the handlebar to resize.</p>
        </div>
        <div style={{ padding: '20px', background: '#fff0f5' }}>
          <h2>Right Pane</h2>
          <p>This is the right pane. Drag the handlebar to resize.</p>
        </div>
      </Split>
    </div>
  );
}
