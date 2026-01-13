import React, { useRef } from 'react';
import { Split, SplitRef, useSplitActions, useSplitState } from '@a-multilayout-splitter/core';
import { SplitProvider } from '@a-multilayout-splitter/core';

// Example component showing how to use context
function PaneControls() {
  const { panes } = useSplitState();
  const { togglePane, setPaneSize } = useSplitActions();

  return (
    <div className="controls">
      <h4>Context API Example</h4>
      <p>Total panes: {panes.length}</p>
      <button onClick={() => togglePane(0)}>Toggle First Pane</button>
      <button onClick={() => setPaneSize(0, '70%', { animate: true, duration: 300 })}>
        Set First to 70%
      </button>
    </div>
  );
}

export default function App() {
  const splitRef = useRef<SplitRef>(null);

  // Example: Imperative API usage
  const handleAddPane = () => {
    splitRef.current?.addPane({
      size: '25%',
      content: <div className="pane pane-dynamic">New Pane!</div>,
    });
  };

  const handleRemovePane = () => {
    const state = splitRef.current?.getPaneState();
    if (state && state.length > 2) {
      splitRef.current?.removePane(state.length - 1);
    }
  };

  const handleToggleFirst = () => {
    splitRef.current?.togglePane(0);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🚀 A-MultiLayout-Splitter v6.0.0 (Alpha)</h1>
        <p>
          High-performance split pane with 60fps drag performance.
          Edit this file to see Hot Module Replacement in action!
        </p>
      </header>

      <div className="demo-container">
        <h2>Horizontal Split Demo (Imperative API)</h2>
        <div className="controls">
          <button onClick={handleAddPane}>➕ Add Pane</button>
          <button onClick={handleRemovePane}>➖ Remove Last Pane</button>
          <button onClick={handleToggleFirst}>🔄 Toggle First Pane</button>
        </div>

        <Split
          ref={splitRef}
          id="demo-split"
          mode="horizontal"
          initialSizes={['50%', '50%']}
          minSizes={[10, 10]}
          maxSizes={[90, 90]}
          lineBar
          enableSessionStorage={true}
          style={{ height: '400px', border: '2px solid #e0e0e0', borderRadius: '8px' }}
          onDragging={(prevSize, nextSize, paneIndex) => {
            console.log('Dragging:', { prevSize, nextSize, paneIndex });
          }}
          onDragEnd={(prevSize, nextSize, paneIndex) => {
            console.log('Drag end:', { prevSize, nextSize, paneIndex });
          }}
        >
          <div className="pane pane-1">
            <h3>📄 Pane 1</h3>
            <p>This is the first pane. Drag the handlebar to resize!</p>
            <ul>
              <li>✅ Direct DOM manipulation for 60fps</li>
              <li>✅ Supports px, %, and mixed units</li>
              <li>✅ Min/max size constraints</li>
              <li>✅ localStorage persistence</li>
            </ul>
          </div>

          <div className="pane pane-2">
            <h3>📋 Pane 2</h3>
            <p>This is the second pane. Try the buttons above!</p>
            <div className="feature-box">
              <strong>New in v6:</strong>
              <ul>
                <li>Functional components with hooks</li>
                <li>Reactive props (no provider needed)</li>
                <li>Imperative ref API</li>
                <li>TypeScript strict mode</li>
                <li>~4KB smaller bundle</li>
              </ul>
            </div>
          </div>
        </Split>

        <h2>Vertical Split with Context API</h2>
        <SplitProvider id="vertical-demo" mode="vertical">
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
              <PaneControls />
            </div>

            <div className="pane pane-4">
              <h3>🔽 Bottom Pane</h3>
              <p>Resize vertically by dragging the handlebar above.</p>
              <div className="code-box">
                <code>mode="vertical"</code>
              </div>
            </div>
          </Split>
        </SplitProvider>

        <h2>Three Panes Example</h2>
        <Split
          id="three-pane-demo"
          mode="horizontal"
          initialSizes={['33.33%', '33.33%', '33.34%']}
          lineBar={[1]}
          disable={[2]}
          style={{ height: '300px', border: '2px solid #e0e0e0', borderRadius: '8px' }}
        >
          <div className="pane pane-1">
            <h4>Left</h4>
            <p>First handlebar is line style</p>
          </div>

          <div className="pane pane-2">
            <h4>Center</h4>
            <p>Second handlebar is disabled</p>
          </div>

          <div className="pane pane-3">
            <h4>Right</h4>
            <p>Fixed position</p>
          </div>
        </Split>
      </div>

      <footer className="footer">
        <p>
          🎯 Phase 2: Core Refactoring Complete! |
          🔥 Clean Break - v6 is a fresh start |
          ⚡ Powered by Vite + React 18
        </p>
      </footer>
    </div>
  );
}
