/**
 * Advanced Example 1: Disabled Handlebars
 *
 * Demonstrates disabling specific handlebars to prevent resizing.
 * Useful for fixed layouts with some resizable sections.
 */

import React from 'react';
import { Split } from '../../src';

export default function DisabledHandlebarsExample() {
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Split
        mode="horizontal"
        initialSizes={['25%', '50%', '25%']}
        disable={[false, true]}  // Second handlebar is disabled
      >
        <div style={{ padding: '20px', background: '#e8f5e9' }}>
          <h2>Left Pane</h2>
          <p>✅ Resizable (first handlebar is enabled)</p>
        </div>
        <div style={{ padding: '20px', background: '#fff9c4' }}>
          <h2>Center Pane (Fixed)</h2>
          <p>🚫 Second handlebar is disabled</p>
          <p>You cannot resize the right side of this pane.</p>
        </div>
        <div style={{ padding: '20px', background: '#f3e5f5' }}>
          <h2>Right Pane</h2>
          <p>Fixed size due to disabled handlebar</p>
        </div>
      </Split>
    </div>
  );
}
