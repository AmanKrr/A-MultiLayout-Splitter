/**
 * API Example 3: Hook-Based API (useSplitController)
 *
 * Manage split state with a custom hook.
 * Best for complex state management scenarios.
 */

import React from 'react';
import { useSplitController } from '../../src';

export default function HookBasedAPIExample() {
  const controller = useSplitController({
    mode: 'horizontal',
    initialPanes: [
      {
        id: 'pane-1',
        size: '33%',
        content: null, // Will be set below
        collapsed: false,
        minSize: 10,
        maxSize: 80,
      },
      {
        id: 'pane-2',
        size: '33%',
        content: null,
        collapsed: false,
        minSize: 10,
        maxSize: 80,
      },
      {
        id: 'pane-3',
        size: '34%',
        content: null,
        collapsed: false,
        minSize: 10,
        maxSize: 80,
      },
    ],
  });

  return (
    <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Control Panel */}
      <div style={{ padding: '10px', background: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
        <button onClick={() => controller.addPane({
          position: 1,
          size: '200px',
          content: <div style={{ padding: '20px' }}>New Pane</div>,
        })} style={{ marginRight: '10px' }}>
          Add Pane
        </button>
        <button onClick={() => controller.removePane(0)} style={{ marginRight: '10px' }}>
          Remove First
        </button>
        <button onClick={() => controller.togglePane(0)} style={{ marginRight: '10px' }}>
          Toggle First
        </button>
        <button onClick={() => controller.swapPanes(0, 1)} style={{ marginRight: '10px' }}>
          Swap 0 & 1
        </button>
        <span style={{ marginLeft: '20px' }}>
          Total Panes: {controller.panes.length}
        </span>
      </div>

      {/* Manual Rendering */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'row' }}>
        {controller.panes.map((pane, index) => (
          <div
            key={pane.id}
            style={{
              flex: pane.collapsed ? '0 0 0' : `0 0 ${pane.size}`,
              background: ['#e3f2fd', '#fff9c4', '#f3e5f5', '#e8f5e9'][index % 4],
              padding: '20px',
              overflow: 'auto',
              display: pane.collapsed ? 'none' : 'block',
            }}
          >
            <h2>Pane {index + 1}</h2>
            <p>ID: {pane.id}</p>
            <p>Size: {pane.size}</p>
            <p>Collapsed: {pane.collapsed ? 'Yes' : 'No'}</p>

            {index === 0 && (
              <div style={{ marginTop: '20px' }}>
                <h3>Hook-Based API Benefits:</h3>
                <ul>
                  <li>Full state access</li>
                  <li>Custom rendering logic</li>
                  <li>Easy integration with other hooks</li>
                  <li>No ref required</li>
                  <li>React-friendly patterns</li>
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
