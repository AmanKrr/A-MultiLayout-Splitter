/**
 * Example 10: Mixed Sizes (Pixels, Percentages, and Fractions)
 *
 * Demonstrates combining different unit types in a single layout.
 * - Pixels (px): Fixed size, useful for sidebars/toolbars
 * - Percentages (%): Proportional to container
 * - Fractions (fr): Distributes remaining space
 */

import React from 'react';
import { Split } from '../../src';

export default function MixedSizesExample() {
  return (
    <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Horizontal Split with Mixed Units */}
      <div style={{ flex: 1 }}>
        <Split mode="horizontal" initialSizes={['200px', '1fr', '25%', '150px']}>
          <div style={{ padding: '20px', background: '#e3f2fd', height: '100%', boxSizing: 'border-box' }}>
            <h2>Fixed Nav</h2>
            <p><strong>200px</strong> (pixel)</p>
            <p style={{ fontSize: '13px', color: '#666' }}>
              Fixed pixel width. Stays constant regardless of container size.
            </p>
            <ul style={{ padding: '0 0 0 20px', margin: '10px 0', fontSize: '14px' }}>
              <li>Dashboard</li>
              <li>Projects</li>
              <li>Team</li>
              <li>Calendar</li>
            </ul>
          </div>

          <div style={{ padding: '20px', background: '#ffffff', height: '100%', boxSizing: 'border-box' }}>
            <h2>Flexible Content</h2>
            <p><strong>1fr</strong> (fraction)</p>
            <div style={{ padding: '15px', background: '#f5f5f5', borderRadius: '4px', marginTop: '10px' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>How Mixed Units Work</h3>
              <ol style={{ margin: 0, padding: '0 0 0 20px', fontSize: '14px', lineHeight: '1.6' }}>
                <li><strong>Pixels</strong> are allocated first (200px + 150px = 350px)</li>
                <li><strong>Percentages</strong> are calculated from remaining space (25% of remaining)</li>
                <li><strong>Fractions</strong> divide whatever space is left</li>
              </ol>
            </div>
            <p style={{ fontSize: '13px', color: '#666', marginTop: '15px' }}>
              The <code>1fr</code> pane expands to fill all remaining space after
              fixed and percentage allocations.
            </p>
          </div>

          <div style={{ padding: '20px', background: '#fff3e0', height: '100%', boxSizing: 'border-box' }}>
            <h2>Proportional</h2>
            <p><strong>25%</strong> (percentage)</p>
            <p style={{ fontSize: '13px', color: '#666' }}>
              Takes 25% of the space remaining after fixed pixels are allocated.
            </p>
            <div style={{ marginTop: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Progress</span>
                <span>75%</span>
              </div>
              <div style={{ height: '8px', background: '#ddd', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '75%', height: '100%', background: '#ff9800' }} />
              </div>
            </div>
          </div>

          <div style={{ padding: '20px', background: '#e8f5e9', height: '100%', boxSizing: 'border-box' }}>
            <h2>Toolbar</h2>
            <p><strong>150px</strong> (pixel)</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '15px' }}>
              <button style={{ padding: '10px', cursor: 'pointer', background: '#4caf50', color: 'white', border: 'none', borderRadius: '4px' }}>
                Save
              </button>
              <button style={{ padding: '10px', cursor: 'pointer', background: '#2196f3', color: 'white', border: 'none', borderRadius: '4px' }}>
                Preview
              </button>
              <button style={{ padding: '10px', cursor: 'pointer', background: '#ff5722', color: 'white', border: 'none', borderRadius: '4px' }}>
                Delete
              </button>
            </div>
          </div>
        </Split>
      </div>

      {/* Info Bar */}
      <div style={{
        padding: '12px 20px',
        background: '#f5f5f5',
        borderTop: '1px solid #ddd',
        fontSize: '13px',
        color: '#666'
      }}>
        <strong>Layout:</strong> 200px (fixed) + 1fr (flexible) + 25% (proportional) + 150px (fixed)
        <span style={{ float: 'right' }}>
          Resize the window to see how each unit type behaves differently
        </span>
      </div>
    </div>
  );
}
