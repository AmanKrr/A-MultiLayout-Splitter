/**
 * Advanced Example 3: Custom Handlebar
 *
 * Demonstrates creating a custom handlebar with your own design.
 */

import React from 'react';
import { Split, HandleRenderProps } from '../../src';

export default function CustomHandlebarExample() {
  const renderCustomBar = (props: HandleRenderProps) => {
    return (
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '12px',
          cursor: 'col-resize',
          color: 'white',
          fontSize: '18px',
          fontWeight: 'bold',
          userSelect: 'none',
        }}
        onMouseDown={props.onMouseDown}
      >
        ⋮
      </div>
    );
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Split
        mode="horizontal"
        initialSizes={['50%', '50%']}
        renderBar={renderCustomBar}
      >
        <div style={{ padding: '20px', background: '#f0f8ff' }}>
          <h2>Left Pane</h2>
          <p>Custom gradient handlebar!</p>
          <p>You can design handlebars to match your brand.</p>
        </div>
        <div style={{ padding: '20px', background: '#fff0f5' }}>
          <h2>Right Pane</h2>
          <p>Complete control over appearance and behavior.</p>
        </div>
      </Split>
    </div>
  );
}
