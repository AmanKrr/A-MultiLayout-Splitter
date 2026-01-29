/**
 * Nested Example 2: Complex Nested Layout
 *
 * Demonstrates deep nesting with multiple levels.
 * Similar to VS Code or advanced IDE layouts.
 */

import React from 'react';
import { Split } from '../../src';

export default function ComplexNestedExample() {
  return (
    <div style={{ height: '100%', width: '100%' }}>
      {/* Level 1: Main horizontal split (sidebar | main) */}
      <Split mode="horizontal" initialSizes={['20%', '80%']}>
        {/* Left: File Explorer */}
        <div style={{ padding: '15px', background: '#2d2d2d', color: '#fff' }}>
          <h3>EXPLORER</h3>
          <div style={{ marginTop: '10px', fontSize: '13px' }}>
            <div>📁 project/</div>
            <div style={{ marginLeft: '15px' }}>📁 src/</div>
            <div style={{ marginLeft: '30px' }}>📄 App.tsx</div>
            <div style={{ marginLeft: '30px' }}>📄 index.ts</div>
          </div>
        </div>

        {/* Right: Editor + Panels */}
        <Split mode="horizontal" initialSizes={['75%', '25%']}>
          {/* Middle: Editor + Terminal */}
          <Split mode="vertical" initialSizes={['70%', '30%']}>
            {/* Editor with tabs */}
            <div style={{ background: '#1e1e1e', color: '#d4d4d4' }}>
              <div style={{ background: '#2d2d2d', padding: '8px', borderBottom: '1px solid #3d3d3d' }}>
                <span style={{ padding: '8px 16px', background: '#1e1e1e' }}>App.tsx</span>
                <span style={{ padding: '8px 16px' }}>index.ts</span>
              </div>
              <div style={{ padding: '20px' }}>
                <pre style={{ margin: 0, fontSize: '14px' }}>
                  {`import React from 'react';

export function App() {
  return (
    <div className="app">
      <h1>Hello World</h1>
    </div>
  );
}`}
                </pre>
              </div>
            </div>

            {/* Terminal */}
            <div style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '15px' }}>
              <div style={{ color: '#4ec9b0' }}>TERMINAL</div>
              <pre style={{ margin: '10px 0 0 0', fontSize: '13px' }}>
                $ npm run dev
                <span style={{ color: '#89d185' }}>✓ Ready in 450ms</span>
              </pre>
            </div>
          </Split>

          {/* Right: Properties/Info Panel */}
          <Split mode="vertical" initialSizes={['60%', '40%']}>
            {/* Outline */}
            <div style={{ background: '#252526', color: '#cccccc', padding: '15px' }}>
              <h4 style={{ margin: '0 0 10px 0' }}>OUTLINE</h4>
              <div style={{ fontSize: '13px' }}>
                <div>⚡ App()</div>
                <div style={{ marginLeft: '15px', marginTop: '5px' }}>↳ return</div>
              </div>
            </div>

            {/* Properties */}
            <div style={{ background: '#252526', color: '#cccccc', padding: '15px' }}>
              <h4 style={{ margin: '0 0 10px 0' }}>PROPERTIES</h4>
              <div style={{ fontSize: '12px' }}>
                <div>Lines: 8</div>
                <div>Size: 156 bytes</div>
                <div>Language: TypeScript</div>
              </div>
            </div>
          </Split>
        </Split>
      </Split>
    </div>
  );
}
