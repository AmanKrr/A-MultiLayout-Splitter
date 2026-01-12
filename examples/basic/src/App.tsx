import React from 'react';
import { Split, SplitStateProvider } from '@a-multilayout-splitter/core';

export default function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>🚀 A-MultiLayout-Splitter v6.0.0 (Alpha)</h1>
        <p>
          This is a live example with Hot Module Replacement (HMR).
          Try editing this file - changes will appear instantly!
        </p>
      </header>

      <div className="demo-container">
        <h2>Horizontal Split Demo</h2>
        <SplitStateProvider>
          <Split
            id="demo-split"
            mode="horizontal"
            initialSizes={['50%', '50%']}
            lineBar
            style={{ height: '400px', border: '2px solid #e0e0e0', borderRadius: '8px' }}
          >
            <div className="pane pane-1">
              <h3>📄 Pane 1</h3>
              <p>This is the first pane. Drag the handlebar to resize!</p>
              <ul>
                <li>✅ Direct DOM manipulation for 60fps performance</li>
                <li>✅ Supports px, %, and mixed units</li>
                <li>✅ Collapsible panes with arrow buttons</li>
              </ul>
            </div>

            <div className="pane pane-2">
              <h3>📋 Pane 2</h3>
              <p>This is the second pane. Click the arrows on the handlebar to collapse/expand.</p>
              <div className="feature-box">
                <strong>Try this:</strong> Edit this text and see HMR in action!
              </div>
            </div>
          </Split>
        </SplitStateProvider>

        <h2>Vertical Split Demo</h2>
        <SplitStateProvider>
          <Split
            id="vertical-demo"
            mode="vertical"
            initialSizes={['200px', '200px']}
            lineBar
            style={{ height: '400px', border: '2px solid #e0e0e0', borderRadius: '8px' }}
          >
            <div className="pane pane-3">
              <h3>🔝 Top Pane</h3>
              <p>Vertical layout works too! Drag the horizontal handlebar.</p>
            </div>

            <div className="pane pane-4">
              <h3>🔽 Bottom Pane</h3>
              <p>Resize vertically by dragging the handlebar above.</p>
              <div className="code-box">
                <code>mode="vertical"</code>
              </div>
            </div>
          </Split>
        </SplitStateProvider>
      </div>

      <footer className="footer">
        <p>
          🎯 Phase 1: Infrastructure Setup Complete! |
          🔥 Clean Break - v6 is a fresh start |
          ⚡ Powered by Vite
        </p>
      </footer>
    </div>
  );
}
