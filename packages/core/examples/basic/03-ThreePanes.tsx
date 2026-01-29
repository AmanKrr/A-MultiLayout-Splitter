/**
 * Example 3: Three Panes
 *
 * Split with three panes demonstrating multiple handlebars.
 */

import React from 'react';
import { Split } from '../../src';

export default function ThreePanesExample() {
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Split mode="horizontal" initialSizes={['30%', '40%', '30%']}>
        <div style={{ padding: '20px', background: '#e8f5e9' }}>
          <h2>Left Pane</h2>
          <p>30% width</p>
        </div>
        <div style={{ padding: '20px', background: '#fff9c4' }}>
          <h2>Center Pane</h2>
          <p>40% width</p>
        </div>
        <div style={{ padding: '20px', background: '#f3e5f5' }}>
          <h2>Right Pane</h2>
          <p>30% width</p>
        </div>
      </Split>
    </div>
  );
}
