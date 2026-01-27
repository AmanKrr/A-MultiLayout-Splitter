/**
 * Plugin Example 3: Custom Plugin
 *
 * Demonstrates creating a custom plugin with lifecycle hooks.
 * This example creates an analytics plugin that tracks user interactions.
 */

import React, { useState } from 'react';
import { Split, createPlugin, PluginContext, DragStartEvent, DragMoveEvent, DragEndEvent, PaneAddEvent, PaneRemoveEvent } from '../../src';

// Custom Analytics Plugin
const analyticsPlugin = createPlugin({
  name: 'analytics-plugin',
  version: '1.0.0',

  onInit(context: PluginContext) {
    console.log('✅ Analytics plugin initialized for:', context.splitId);
  },

  onDragStart(event: DragStartEvent, context: PluginContext) {
    console.log('🎯 Drag started:', {
      paneIndex: event.paneIndex,
      splitId: context.splitId,
    });
  },

  onDragMove(event: DragMoveEvent, _context: PluginContext) {
    // Track drag movements (debounce in production!)
    console.log('↔️  Dragging:', {
      prevSize: event.prevSize.toFixed(1),
      nextSize: event.nextSize.toFixed(1),
    });
  },

  onDragEnd(event: DragEndEvent, _context: PluginContext) {
    console.log('✋ Drag ended:', {
      paneIndex: event.paneIndex,
      finalSizes: {
        prev: event.prevSize.toFixed(1) + '%',
        next: event.nextSize.toFixed(1) + '%',
      },
    });

    // Send to analytics service
    // analytics.track('split_resized', { ... });
  },

  onPaneAdd(event: PaneAddEvent, _context: PluginContext) {
    console.log('➕ Pane added:', event.pane.id);
  },

  onPaneRemove(event: PaneRemoveEvent, _context: PluginContext) {
    console.log('➖ Pane removed:', event.pane.id);
  },

  onDestroy(_context: PluginContext) {
    console.log('🔌 Analytics plugin destroyed');
  },
});

export default function CustomPluginExample() {
  const [events, setEvents] = useState<string[]>([]);

  // Create a logging plugin that updates UI
  const loggingPlugin = createPlugin({
    name: 'ui-logger',
    version: '1.0.0',

    onDragEnd(event: DragEndEvent) {
      setEvents(prev => [
        `Resized: ${event.prevSize.toFixed(1)}% / ${event.nextSize.toFixed(1)}%`,
        ...prev.slice(0, 4),
      ]);
    },

    onPaneAdd(event: PaneAddEvent) {
      setEvents(prev => [
        `Pane added: ${event.pane.id}`,
        ...prev.slice(0, 4),
      ]);
    },

    onPaneRemove(event: PaneRemoveEvent) {
      setEvents(prev => [
        `Pane removed: ${event.pane.id}`,
        ...prev.slice(0, 4),
      ]);
    },
  });

  return (
    <div style={{ height: '100%', width: '100%' }}>
      {/* Event Log */}
      <div style={{
        position: 'fixed',
        top: 10,
        right: 10,
        background: 'rgba(0,0,0,0.9)',
        color: '#0f0',
        padding: '15px',
        borderRadius: '8px',
        zIndex: 1000,
        fontFamily: 'monospace',
        fontSize: '12px',
        minWidth: '300px'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '10px', color: '#fff' }}>
          📊 Event Log (Check Console)
        </div>
        {events.length === 0 ? (
          <div style={{ opacity: 0.5 }}>No events yet...</div>
        ) : (
          events.map((event, i) => (
            <div key={i} style={{ padding: '3px 0' }}>
              {event}
            </div>
          ))
        )}
      </div>

      <Split
        id="custom-plugin-example"
        mode="horizontal"
        initialSizes={['50%', '50%']}
        plugins={[analyticsPlugin, loggingPlugin]}
      >
        <div style={{ padding: '20px', background: '#e8f5e9' }}>
          <h2>Left Pane</h2>
          <h3>Creating Custom Plugins:</h3>
          <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', fontSize: '12px', overflow: 'auto' }}>
{`const myPlugin = createPlugin({
  name: 'my-plugin',
  version: '1.0.0',

  // Lifecycle hooks:
  onInit(context) { },
  onDragStart(event, context) { },
  onDragMove(event, context) { },
  onDragEnd(event, context) { },
  onPaneAdd(event, context) { },
  onPaneRemove(event, context) { },
  onPaneCollapse(event, context) { },
  onPaneExpand(event, context) { },
  onDestroy(context) { },
});`}
          </pre>
          <h3>Available Context:</h3>
          <ul style={{ fontSize: '14px' }}>
            <li><code>context.splitId</code> - Split identifier</li>
            <li><code>context.getState()</code> - Current state</li>
            <li><code>context.dispatch()</code> - Dispatch actions</li>
            <li><code>context.containerRef</code> - DOM reference</li>
          </ul>
        </div>
        <div style={{ padding: '20px', background: '#f3e5f5' }}>
          <h2>Right Pane</h2>
          <h3>Use Cases for Custom Plugins:</h3>
          <ul style={{ lineHeight: '1.8' }}>
            <li><strong>Analytics:</strong> Track user interactions</li>
            <li><strong>Persistence:</strong> Custom save/load logic</li>
            <li><strong>Validation:</strong> Enforce layout rules</li>
            <li><strong>Automation:</strong> Auto-resize based on content</li>
            <li><strong>Integration:</strong> Sync with external state</li>
            <li><strong>Accessibility:</strong> Custom a11y features</li>
            <li><strong>Animations:</strong> Custom transition effects</li>
          </ul>
          <h3>Try It:</h3>
          <p>Resize or collapse panes and watch the event log!</p>
          <p style={{ fontSize: '12px', opacity: 0.7 }}>
            Open browser console for detailed logs from analytics plugin.
          </p>
        </div>
      </Split>
    </div>
  );
}
