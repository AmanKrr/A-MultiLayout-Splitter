/**
 * Example 9: Percentage-Only Sizes
 *
 * Demonstrates a layout where all panes use percentage values.
 * Panes scale proportionally with the container size.
 */

import React from 'react';
import { Split } from '../../src';

export default function PercentageSizesExample() {
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Split mode="horizontal" initialSizes={['20%', '50%', '30%']}>
        <div style={{ padding: '20px', background: '#e3f2fd', height: '100%', boxSizing: 'border-box' }}>
          <h2>Sidebar</h2>
          <p><strong>20%</strong> of container width</p>
          <p style={{ fontSize: '14px', color: '#666' }}>
            This pane always takes 20% of the available width, regardless of container size.
          </p>
          <ul style={{ padding: '0 0 0 20px', margin: '10px 0' }}>
            <li>Home</li>
            <li>Analytics</li>
            <li>Reports</li>
            <li>Settings</li>
          </ul>
        </div>
        <div style={{ padding: '20px', background: '#fff8e1', height: '100%', boxSizing: 'border-box' }}>
          <h2>Main Content Area</h2>
          <p><strong>50%</strong> of container width</p>
          <p>
            Percentage-based layouts are fully responsive. When the browser window
            resizes, all panes maintain their proportional sizes.
          </p>
          <div style={{ marginTop: '20px', padding: '15px', background: '#fff', borderRadius: '4px', border: '1px solid #ddd' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>Proportional Scaling</h3>
            <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
              Total percentages should add up to 100% for predictable behavior.
              In this example: 20% + 50% + 30% = 100%
            </p>
          </div>
        </div>
        <div style={{ padding: '20px', background: '#f3e5f5', height: '100%', boxSizing: 'border-box' }}>
          <h2>Inspector</h2>
          <p><strong>30%</strong> of container width</p>
          <div style={{ marginTop: '15px' }}>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '4px' }}>Name</label>
              <input type="text" placeholder="Enter name..." style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '4px' }}>Category</label>
              <select style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}>
                <option>Category A</option>
                <option>Category B</option>
                <option>Category C</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '4px' }}>Notes</label>
              <textarea rows={3} placeholder="Add notes..." style={{ width: '100%', padding: '8px', boxSizing: 'border-box', resize: 'none' }} />
            </div>
          </div>
        </div>
      </Split>
    </div>
  );
}
