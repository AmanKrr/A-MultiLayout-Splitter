/**
 * Advanced Example 4: Drag Callbacks
 *
 * Demonstrates responding to drag events and layout changes.
 * Useful for analytics, auto-save, or synchronization.
 */

import React, { useState } from 'react';
import { Split, type PaneStatus, type Direction } from '../../src';

export default function DragCallbacksExample() {
  const [dragInfo, setDragInfo] = useState<string>('Not dragging');
  const [finalSizes, setFinalSizes] = useState<string>('');
  const [layoutEvents, setLayoutEvents] = useState<string[]>([]);

  const addLayoutEvent = (event: string) => {
    setLayoutEvents((prev) => [...prev.slice(-4), event]); // Keep last 5 events
  };

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
          maxWidth: '300px',
        }}
      >
        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Drag Info:</div>
        <div>{dragInfo}</div>
        {finalSizes && <div style={{ marginTop: '5px' }}>{finalSizes}</div>}

        <div style={{ fontWeight: 'bold', marginTop: '10px', marginBottom: '5px' }}>Layout Events:</div>
        {layoutEvents.length === 0 ? (
          <div style={{ color: '#888' }}>No events yet</div>
        ) : (
          layoutEvents.map((event, i) => (
            <div key={i} style={{ fontSize: '11px', color: '#aaa' }}>
              {event}
            </div>
          ))
        )}
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
        onLayoutChange={(sectionNumber: number, paneId: string, status: PaneStatus, direction: Direction | null) => {
          const event = `[${status}] Pane ${sectionNumber} (${paneId})${direction ? ` dir: ${direction}` : ''}`;
          addLayoutEvent(event);
        }}
      >
        <div style={{ padding: '20px', background: '#e3f2fd' }}>
          <h2>Left Pane</h2>
          <p>Try dragging the handlebar!</p>
          <p>Watch the top-right corner for real-time feedback.</p>
        </div>
        <div style={{ padding: '20px', background: '#fce4ec' }}>
          <h2>Right Pane</h2>
          <p>Callbacks available:</p>
          <ul>
            <li>
              <code>onDragging</code> - During resize
            </li>
            <li>
              <code>onDragEnd</code> - After resize
            </li>
            <li>
              <code>onLayoutChange</code> - Any layout change
            </li>
          </ul>
        </div>
      </Split>
    </div>
  );
}
