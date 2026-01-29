/**
 * Example demonstrating plugin system usage
 * This is not a test file, but an example for documentation purposes
 */

import React from 'react';
import { Split, createPlugin, persistencePlugin, keyboardPlugin, customHandlePlugin } from '../index';

// Example 1: Simple analytics plugin
const analyticsPlugin = createPlugin({
  name: 'analytics',
  version: '1.0.0',

  onInit(context) {
    console.log('Analytics plugin initialized for split:', context.splitId);
  },

  onDragEnd(event, context) {
    console.log('User resized pane:', {
      paneIndex: event.paneIndex,
      prevSize: event.prevSize,
      nextSize: event.nextSize,
    });

    // In real app, send to analytics service
    // analytics.track('pane_resized', { ... });
  },

  onPaneAdd(event, context) {
    console.log('Pane added:', event.pane.id);
  },

  onDestroy(context) {
    console.log('Analytics plugin cleaned up');
  },
});

// Example 2: Custom handle component
const CustomHandle = ({ index, disabled, onMouseDown }: any) => (
  <div
    style={{
      width: '10px',
      background: disabled ? '#ccc' : '#007bff',
      cursor: disabled ? 'not-allowed' : 'col-resize',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      userSelect: 'none',
    }}
    onMouseDown={disabled ? undefined : onMouseDown}
  >
    <span style={{ color: 'white', fontSize: '12px' }}>⋮</span>
  </div>
);

// Example usage component
export function PluginExample() {
  return (
    <div>
      <h1>Plugin System Examples</h1>

      {/* Example 1: Basic split with built-in plugins */}
      <section>
        <h2>1. Built-in Plugins (Persistence + Keyboard)</h2>
        <Split
          id="example-1"
          mode="horizontal"
          initialSizes={['50%', '50%']}
          plugins={[
            persistencePlugin({
              storage: 'localStorage',
              debounceDelay: 300,
            }),
            keyboardPlugin({
              stepSize: 10,
              enableArrowKeys: true,
            }),
          ]}
        >
          <div style={{ background: '#f0f0f0', padding: '20px' }}>Pane 1 - State persisted to localStorage</div>
          <div style={{ background: '#e0e0e0', padding: '20px' }}>Pane 2 - Use arrow keys to resize</div>
        </Split>
      </section>

      {/* Example 2: Custom analytics plugin */}
      <section>
        <h2>2. Custom Analytics Plugin</h2>
        <Split id="example-2" mode="horizontal" initialSizes={['40%', '60%']} plugins={[analyticsPlugin]}>
          <div style={{ background: '#e8f4f8', padding: '20px' }}>Pane 1 - Check console for analytics</div>
          <div style={{ background: '#d4e9f2', padding: '20px' }}>Pane 2 - Drag to trigger analytics</div>
        </Split>
      </section>

      {/* Example 3: Custom handle plugin */}
      <section>
        <h2>3. Custom Handle Component</h2>
        <Split id="example-3" mode="horizontal" initialSizes={['50%', '50%']} plugins={[customHandlePlugin(CustomHandle)]}>
          <div style={{ background: '#fff3cd', padding: '20px' }}>Pane 1 - Custom handle</div>
          <div style={{ background: '#ffe69c', padding: '20px' }}>Pane 2 - Custom styled</div>
        </Split>
      </section>

      {/* Example 4: Multiple plugins combined */}
      <section>
        <h2>4. Multiple Plugins Combined</h2>
        <Split
          id="example-4"
          mode="vertical"
          initialSizes={['33%', '33%', '34%']}
          plugins={[persistencePlugin(), keyboardPlugin(), analyticsPlugin, customHandlePlugin(CustomHandle)]}
        >
          <div style={{ background: '#d1ecf1', padding: '20px' }}>Pane 1 - All features enabled</div>
          <div style={{ background: '#bee5eb', padding: '20px' }}>Pane 2 - Persistence + Keyboard + Analytics</div>
          <div style={{ background: '#9fcddc', padding: '20px' }}>Pane 3 - Custom handle styling</div>
        </Split>
      </section>
    </div>
  );
}

// Example 5: Creating a complex plugin with state
const counterPlugin = createPlugin({
  name: 'drag-counter',
  version: '1.0.0',

  onInit(context) {
    // Initialize counter state
    (context as any).dragCount = 0;
    (context as any).addCount = 0;

    console.log('Counter plugin initialized');
  },

  onDragEnd(event, context) {
    (context as any).dragCount++;
    console.log(`Total drags: ${(context as any).dragCount}`);
  },

  onPaneAdd(event, context) {
    (context as any).addCount++;
    console.log(`Total panes added: ${(context as any).addCount}`);
  },

  onDestroy(context) {
    console.log('Final stats:', {
      totalDrags: (context as any).dragCount,
      totalAdded: (context as any).addCount,
    });
  },
});

export { counterPlugin };
