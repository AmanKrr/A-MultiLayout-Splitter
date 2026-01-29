/**
 * Nested Example 1: Simple Nested Layout
 *
 * Demonstrates basic nesting: horizontal split containing a vertical split.
 * Common pattern for IDE-like layouts.
 */

import React from 'react';
import { Split } from '../../src';

export default function SimpleNestedExample() {
  return (
    <div style={{ height: '100%', width: '100%' }}>
      {/* Outer horizontal split */}
      <Split mode="horizontal" initialSizes={['30%', '70%']}>
        {/* Left sidebar */}
        <div style={{ padding: '20px', background: '#e3f2fd' }}>
          <h2>Sidebar</h2>
          <p>File Explorer</p>
          <ul>
            <li>📁 src/</li>
            <li>📁 components/</li>
            <li>📁 utils/</li>
            <li>📄 index.ts</li>
          </ul>
        </div>

        {/* Right side: vertical split for editor and terminal */}
        <Split mode="vertical" initialSizes={['70%', '30%']}>
          {/* Editor area */}
          <div style={{ padding: '20px', background: '#ffffff' }}>
            <h2>Editor</h2>
            <pre style={{ background: '#f5f5f5', padding: '10px' }}>
              {`function App() {
  return <div>Hello World</div>;
}`}
            </pre>
          </div>

          {/* Terminal area */}
          <div style={{ padding: '20px', background: '#263238', color: '#aed581' }}>
            <h3 style={{ color: '#aed581' }}>Terminal</h3>
            <pre>
              $ npm run dev
              <span style={{ color: '#80cbc4' }}>Server running on http://localhost:3000</span>
            </pre>
          </div>
        </Split>
      </Split>
    </div>
  );
}
