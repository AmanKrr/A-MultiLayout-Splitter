/**
 * API Example 2: Imperative API
 *
 * Control the split component through ref methods.
 * Useful for programmatic control and complex operations.
 */

import React, { useRef } from 'react';
import { Split, SplitRef } from '../../src';

export default function ImperativeAPIExample() {
  const splitRef = useRef<SplitRef>(null);

  const addPane = () => {
    splitRef.current?.addPane({
      position: 1,
      size: '200px',
      content: (
        <div style={{ padding: '20px', background: '#ffecb3' }}>
          <h3>New Pane</h3>
          <p>Added programmatically!</p>
        </div>
      ),
    });
  };

  const removeFirstPane = () => {
    splitRef.current?.removePane(0);
  };

  const toggleFirstPane = () => {
    splitRef.current?.togglePane(0);
  };

  const resizeFirstPane = () => {
    splitRef.current?.setPaneSize(0, '30%');
  };

  const swapPanes = () => {
    splitRef.current?.swapPanes(0, 1);
  };

  const getSnapshot = () => {
    const snapshot = splitRef.current?.getSnapshot();
    console.log('Current Layout Snapshot:', snapshot);
    alert('Check console for snapshot data!');
  };

  return (
    <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Control Panel */}
      <div style={{ padding: '10px', background: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
        <button onClick={addPane} style={{ marginRight: '10px' }}>
          Add Pane at Position 1
        </button>
        <button onClick={removeFirstPane} style={{ marginRight: '10px' }}>
          Remove First Pane
        </button>
        <button onClick={toggleFirstPane} style={{ marginRight: '10px' }}>
          Toggle First Pane
        </button>
        <button onClick={resizeFirstPane} style={{ marginRight: '10px' }}>
          Resize First to 30%
        </button>
        <button onClick={swapPanes} style={{ marginRight: '10px' }}>
          Swap First Two Panes
        </button>
        <button onClick={getSnapshot} style={{ marginRight: '10px' }}>
          Get Snapshot
        </button>
      </div>

      {/* Split Component */}
      <div style={{ flex: 1 }}>
        <Split ref={splitRef} mode="horizontal" initialSizes={['50%', '50%']}>
          <div style={{ padding: '20px', background: '#e3f2fd' }}>
            <h2>Pane 1</h2>
            <p>Use the buttons above to manipulate me!</p>
            <h3>Available Methods:</h3>
            <ul>
              <li>
                <code>addPane(config)</code>
              </li>
              <li>
                <code>removePane(index)</code>
              </li>
              <li>
                <code>togglePane(index)</code>
              </li>
              <li>
                <code>setPaneSize(index, size)</code>
              </li>
              <li>
                <code>swapPanes(a, b)</code>
              </li>
              <li>
                <code>collapsePane(index)</code>
              </li>
              <li>
                <code>expandPane(index)</code>
              </li>
              <li>
                <code>resizePane(index, size, options)</code>
              </li>
              <li>
                <code>getSnapshot()</code>
              </li>
              <li>
                <code>restore(snapshot)</code>
              </li>
            </ul>
          </div>
          <div style={{ padding: '20px', background: '#fce4ec' }}>
            <h2>Pane 2</h2>
            <p>Imperative API provides full control over the split component.</p>
            <p>Perfect for:</p>
            <ul>
              <li>Complex UI interactions</li>
              <li>Programmatic layout changes</li>
              <li>Integration with state management</li>
              <li>Advanced animations</li>
            </ul>
          </div>
        </Split>
      </div>
    </div>
  );
}
