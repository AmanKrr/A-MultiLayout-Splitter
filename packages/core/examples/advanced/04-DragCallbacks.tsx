/**
 * Advanced Example 4: Drag Callbacks
 *
 * Demonstrates responding to drag events.
 * Useful for analytics, auto-save, or synchronization.
 */

import React, { useState } from 'react';
import { Split } from '../../src';

export default function DragCallbacksExample() {
  const [dragInfo, setDragInfo] = useState<string>('Not dragging');
  const [finalSizes, setFinalSizes] = useState<string>('');

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <div
        style={{
          position: 'fixed',
          top: 10,
          right: 10,
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '8px',
          zIndex: 1000,
          fontFamily: 'monospace',
          fontSize: '12px',
        }}
      >
        <div>{dragInfo}</div>
        {finalSizes && <div style={{ marginTop: '5px' }}>{finalSizes}</div>}
      </div>

      <Split
        mode="horizontal"
        initialSizes={['50%', '50%']}
        onDragging={(prevSize, nextSize, paneIndex) => {
          setDragInfo(`Dragging: Prev=${prevSize.toFixed(1)}% Next=${nextSize.toFixed(1)}%`);
        }}
        onDragEnd={(prevSize, nextSize, paneIndex) => {
          setDragInfo('Not dragging');
          setFinalSizes(`Final: Prev=${prevSize.toFixed(1)}% Next=${nextSize.toFixed(1)}%`);
        }}
      >
        <div style={{ padding: '20px', background: '#e3f2fd' }}>
          <h2>Left Pane</h2>
          <p>Try dragging the handlebar!</p>
          <p>Watch the top-right corner for real-time feedback.</p>
        </div>
        <div style={{ padding: '20px', background: '#fce4ec' }}>
          <h2>Right Pane</h2>
          <p>Drag events are useful for:</p>
          <ul>
            <li>Analytics tracking</li>
            <li>Auto-saving layouts</li>
            <li>Synchronizing with other components</li>
            <li>Validation logic</li>
          </ul>
        </div>
      </Split>
    </div>
  );
}
