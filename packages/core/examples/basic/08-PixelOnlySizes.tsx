/**
 * Example 8: Pixel-Only Sizes
 *
 * Demonstrates a layout where all panes use fixed pixel values.
 * Useful for precise control over exact dimensions.
 */

import React from 'react';
import { Split } from '../../src';

export default function PixelOnlySizesExample() {
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Split mode="horizontal" initialSizes={['250px', '400px', '200px', '150px']}>
        <div style={{ padding: '20px', background: '#e3f2fd', height: '100%', boxSizing: 'border-box' }}>
          <h2>Navigation</h2>
          <p><strong>250px</strong> fixed width</p>
          <ul style={{ padding: '0 0 0 20px', margin: '10px 0' }}>
            <li>Dashboard</li>
            <li>Projects</li>
            <li>Settings</li>
            <li>Users</li>
          </ul>
        </div>
        <div style={{ padding: '20px', background: '#fff3e0', height: '100%', boxSizing: 'border-box' }}>
          <h2>Main Content</h2>
          <p><strong>400px</strong> fixed width</p>
          <p>
            This layout uses exact pixel values for all panes.
            The total width is fixed at 1000px (250 + 400 + 200 + 150).
          </p>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Note: If the container is smaller than the total, panes will be constrained.
            If larger, extra space remains unused.
          </p>
        </div>
        <div style={{ padding: '20px', background: '#e8f5e9', height: '100%', boxSizing: 'border-box' }}>
          <h2>Details</h2>
          <p><strong>200px</strong> fixed width</p>
          <div style={{ marginTop: '10px' }}>
            <div style={{ marginBottom: '8px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#666' }}>Status</label>
              <span style={{ color: '#4caf50' }}>● Active</span>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#666' }}>Type</label>
              <span>Primary</span>
            </div>
          </div>
        </div>
        <div style={{ padding: '20px', background: '#fce4ec', height: '100%', boxSizing: 'border-box' }}>
          <h2>Actions</h2>
          <p><strong>150px</strong> fixed width</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
            <button style={{ padding: '8px', cursor: 'pointer' }}>Save</button>
            <button style={{ padding: '8px', cursor: 'pointer' }}>Export</button>
            <button style={{ padding: '8px', cursor: 'pointer' }}>Delete</button>
          </div>
        </div>
      </Split>
    </div>
  );
}
