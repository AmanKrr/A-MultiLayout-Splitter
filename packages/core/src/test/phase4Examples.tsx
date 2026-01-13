/**
 * Phase 4 API Examples
 *
 * This file demonstrates all three API patterns introduced in Phase 4:
 * 1. Declarative API (enhanced)
 * 2. Imperative API (enhanced with new methods)
 * 3. Hook-based API (useSplitController)
 */

import React, { useRef, useState, useEffect } from 'react';
import { Split, SplitRef, useSplitController } from '../index';

// ===========================================
// Example 1: Declarative API (Enhanced)
// ===========================================

export function DeclarativeExample() {
  const [sizes, setSizes] = useState(['50%', '50%']);
  const [collapsed, setCollapsed] = useState([false, false]);

  return (
    <Split
      mode="horizontal"
      initialSizes={sizes}
      collapsed={collapsed}
      onLayoutChange={(index, id, reason) => {
        console.log(`Pane ${id} at ${index} changed: ${reason}`);
      }}
    >
      <div>Pane 1 Content</div>
      <div>Pane 2 Content</div>
    </Split>
  );
}

// ===========================================
// Example 2: Enhanced Imperative API
// ===========================================

export function ImperativeExample() {
  const splitRef = useRef<SplitRef>(null);

  const handleAddPane = () => {
    splitRef.current?.addPane({
      position: 1,
      size: '200px',
      content: <div>New Pane</div>,
    });
  };

  const handleRemoveMultiple = () => {
    // NEW: Remove multiple panes at once
    splitRef.current?.removePanes([1, 3]);
  };

  const handleSwapPanes = () => {
    // NEW: Swap two panes
    splitRef.current?.swapPanes(0, 2);
  };

  const handleCollapseFirst = () => {
    // NEW: Collapse specific pane
    splitRef.current?.collapsePane(0);
  };

  const handleExpandFirst = () => {
    // NEW: Expand specific pane
    splitRef.current?.expandPane(0);
  };

  const handleResizePane = () => {
    // NEW: Resize pane by delta
    splitRef.current?.resizePane(1, 10); // +10%
  };

  const handleSaveLayout = () => {
    // NEW: Get snapshot
    const snapshot = splitRef.current?.getSnapshot();
    if (snapshot) {
      localStorage.setItem('layout', JSON.stringify(snapshot));
      console.log('Layout saved!', snapshot);
    }
  };

  const handleRestoreLayout = () => {
    // NEW: Restore from snapshot
    const saved = localStorage.getItem('layout');
    if (saved) {
      const snapshot = JSON.parse(saved);
      splitRef.current?.restore(snapshot);
      console.log('Layout restored!');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={handleAddPane}>Add Pane</button>
        <button onClick={handleRemoveMultiple}>Remove Multiple</button>
        <button onClick={handleSwapPanes}>Swap Panes</button>
        <button onClick={handleCollapseFirst}>Collapse First</button>
        <button onClick={handleExpandFirst}>Expand First</button>
        <button onClick={handleResizePane}>Resize Pane</button>
        <button onClick={handleSaveLayout}>Save Layout</button>
        <button onClick={handleRestoreLayout}>Restore Layout</button>
      </div>

      <Split ref={splitRef} mode="horizontal">
        <div>Pane 1</div>
        <div>Pane 2</div>
        <div>Pane 3</div>
      </Split>
    </div>
  );
}

// ===========================================
// Example 3: Hook-based API (NEW)
// ===========================================

export function HookBasedExample() {
  const {
    panes,
    mode,
    addPane,
    removePane,
    togglePane,
    swapPanes,
    getSnapshot,
    restore,
  } = useSplitController({
    mode: 'horizontal',
    initialPanes: [
      {
        id: 'pane-1',
        size: '33.33%',
        collapsed: false,
        content: <div>Pane 1</div>,
      },
      {
        id: 'pane-2',
        size: '33.33%',
        collapsed: false,
        content: <div>Pane 2</div>,
      },
      {
        id: 'pane-3',
        size: '33.34%',
        collapsed: false,
        content: <div>Pane 3</div>,
      },
    ],
    onPaneChange: (updatedPanes) => {
      console.log('Panes changed:', updatedPanes);
    },
  });

  // Auto-save on change
  useEffect(() => {
    const snapshot = getSnapshot();
    localStorage.setItem('hook-layout', JSON.stringify(snapshot));
  }, [panes, getSnapshot]);

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <button
          onClick={() =>
            addPane({
              size: '200px',
              content: <div>New Pane {panes.length + 1}</div>,
            })
          }
        >
          Add Pane
        </button>
        <button onClick={() => removePane(panes.length - 1)}>Remove Last</button>
        <button onClick={() => togglePane(0)}>Toggle First</button>
        <button onClick={() => swapPanes(0, panes.length - 1)}>
          Swap First & Last
        </button>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <strong>Pane Count:</strong> {panes.length} | <strong>Mode:</strong> {mode}
      </div>

      <Split mode={mode} panes={panes}>
        {panes.map((pane) => (
          <div key={pane.id} style={{ padding: '10px' }}>
            {pane.content}
          </div>
        ))}
      </Split>
    </div>
  );
}

// ===========================================
// Example 4: IDE Layout (Real-world)
// ===========================================

export function IDELayoutExample() {
  const controller = useSplitController({
    mode: 'horizontal',
    initialPanes: [
      {
        id: 'sidebar',
        size: '250px',
        collapsed: false,
        minSize: 10,
        maxSize: 50,
        content: (
          <div style={{ padding: '10px', background: '#f0f0f0' }}>
            <h3>Sidebar</h3>
            <ul>
              <li>File Explorer</li>
              <li>Search</li>
              <li>Source Control</li>
            </ul>
          </div>
        ),
      },
      {
        id: 'editor',
        size: '1fr',
        collapsed: false,
        content: (
          <div style={{ padding: '10px' }}>
            <h3>Editor</h3>
            <textarea
              style={{ width: '100%', height: '300px' }}
              defaultValue="// Your code here..."
            />
          </div>
        ),
      },
      {
        id: 'terminal',
        size: '200px',
        collapsed: false,
        minSize: 15,
        content: (
          <div style={{ padding: '10px', background: '#1e1e1e', color: '#fff' }}>
            <h3>Terminal</h3>
            <div>$ npm run dev</div>
            <div>Server running on http://localhost:3000</div>
          </div>
        ),
      },
    ],
  });

  return (
    <div style={{ height: '600px' }}>
      <div style={{ padding: '10px', background: '#333', color: '#fff' }}>
        <button onClick={() => controller.togglePane(0)}>Toggle Sidebar</button>
        <button onClick={() => controller.togglePane(2)}>Toggle Terminal</button>
        <button
          onClick={() => {
            controller.setPaneSize(0, '250px');
            controller.setPaneSize(1, '1fr');
            controller.setPaneSize(2, '200px');
          }}
        >
          Reset Layout
        </button>
      </div>

      <Split mode="horizontal" panes={controller.panes} style={{ height: '550px' }}>
        {controller.panes.map((pane) => (
          <div key={pane.id}>{pane.content}</div>
        ))}
      </Split>
    </div>
  );
}

// ===========================================
// Example 5: Layout Presets
// ===========================================

export function LayoutPresetsExample() {
  const splitRef = useRef<SplitRef>(null);

  const presets = {
    twoColumn: {
      panes: [
        { id: '1', size: '50%', collapsed: false, content: null },
        { id: '2', size: '50%', collapsed: false, content: null },
      ],
      totalSize: 1000,
      mode: 'horizontal' as const,
      timestamp: Date.now(),
    },
    threeColumn: {
      panes: [
        { id: '1', size: '33%', collapsed: false, content: null },
        { id: '2', size: '34%', collapsed: false, content: null },
        { id: '3', size: '33%', collapsed: false, content: null },
      ],
      totalSize: 1000,
      mode: 'horizontal' as const,
      timestamp: Date.now(),
    },
    sidebarLayout: {
      panes: [
        { id: '1', size: '250px', collapsed: false, content: null },
        { id: '2', size: '1fr', collapsed: false, content: null },
      ],
      totalSize: 1000,
      mode: 'horizontal' as const,
      timestamp: Date.now(),
    },
  };

  const applyPreset = (presetName: keyof typeof presets) => {
    splitRef.current?.restore(presets[presetName]);
  };

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <h3>Layout Presets</h3>
        <button onClick={() => applyPreset('twoColumn')}>2 Column</button>
        <button onClick={() => applyPreset('threeColumn')}>3 Column</button>
        <button onClick={() => applyPreset('sidebarLayout')}>Sidebar</button>
      </div>

      <Split ref={splitRef} mode="horizontal">
        <div style={{ padding: '20px', background: '#e3f2fd' }}>Column 1</div>
        <div style={{ padding: '20px', background: '#fff3e0' }}>Column 2</div>
        <div style={{ padding: '20px', background: '#f3e5f5' }}>Column 3</div>
      </Split>
    </div>
  );
}

// ===========================================
// Example 6: Combining All APIs
// ===========================================

export function CombinedAPIsExample() {
  // Use hook for state management
  const controller = useSplitController({
    mode: 'horizontal',
    initialSizes: ['50%', '50%'],
  });

  // Also use ref for imperative operations
  const splitRef = useRef<SplitRef>(null);

  // Also use declarative props
  const [collapsed, setCollapsed] = useState([false, false]);

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <h3>Combined APIs</h3>
        {/* Hook-based controls */}
        <button onClick={() => controller.addPane({ size: '200px', content: <div>New</div> })}>
          Add (Hook)
        </button>
        {/* Imperative controls */}
        <button onClick={() => splitRef.current?.swapPanes(0, 1)}>Swap (Ref)</button>
        {/* Declarative controls */}
        <button onClick={() => setCollapsed([!collapsed[0], collapsed[1]])}>
          Toggle (State)
        </button>
      </div>

      <Split
        ref={splitRef}
        mode={controller.mode}
        panes={controller.panes}
        collapsed={collapsed}
        onLayoutChange={(idx, id, reason) => {
          console.log(`API: Pane ${id} changed: ${reason}`);
        }}
      >
        {controller.panes.map((pane) => (
          <div key={pane.id}>{pane.content || `Pane ${pane.id}`}</div>
        ))}
      </Split>
    </div>
  );
}

// Export all examples
export const Phase4Examples = {
  DeclarativeExample,
  ImperativeExample,
  HookBasedExample,
  IDELayoutExample,
  LayoutPresetsExample,
  CombinedAPIsExample,
};
