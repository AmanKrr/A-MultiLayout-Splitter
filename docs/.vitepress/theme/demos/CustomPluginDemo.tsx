import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Split, createPlugin, SplitPlugin } from '@a-multilayout-splitter/core';

// Custom analytics plugin that tracks drag events
// Uses a callback ref pattern to avoid recreating the plugin on every render
function createAnalyticsPlugin(onEventRef: React.MutableRefObject<(event: string, data: any) => void>): SplitPlugin {
  return createPlugin({
    name: 'analytics',
    version: '1.0.0',

    onInit(context) {
      onEventRef.current('init', { splitId: context.splitId });
    },

    onDragStart(event, context) {
      onEventRef.current('drag_start', {
        paneIndex: event.paneIndex,
        splitId: context.splitId,
      });
    },

    onDragEnd(event, context) {
      onEventRef.current('drag_end', {
        paneIndex: event.paneIndex,
        prevSize: event.prevSize.toFixed(1),
        nextSize: event.nextSize.toFixed(1),
        splitId: context.splitId,
      });
    },

    onDestroy(context) {
      onEventRef.current('destroy', { splitId: context.splitId });
    },
  });
}

// Custom resize limiter plugin that prevents resizing beyond certain thresholds
function createResizeLimiterPlugin(minTotal: number = 50): SplitPlugin {
  return createPlugin({
    name: 'resize-limiter',
    version: '1.0.0',

    onDragMove(event) {
      // Return false to cancel the drag if combined size is too small
      const combinedSize = event.prevSize + event.nextSize;
      if (combinedSize < minTotal) {
        return false; // Cancel this drag movement
      }
      return true; // Allow the drag
    },
  });
}

interface LogEntry {
  id: number;
  timestamp: string;
  event: string;
  data: any;
}

export default function CustomPluginDemo() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logIdRef = useRef(0);
  const logsContainerRef = useRef<HTMLDivElement>(null);

  // Use a ref for the callback to avoid recreating plugins on every render
  const handleEventRef = useRef((event: string, data: any) => {
    const newLog: LogEntry = {
      id: logIdRef.current++,
      timestamp: new Date().toLocaleTimeString(),
      event,
      data,
    };
    setLogs(prev => [...prev.slice(-9), newLog]); // Keep last 10 logs
  });

  // Memoize plugins to prevent infinite re-renders
  // Plugins are only created once and use refs internally for callbacks
  const plugins = useMemo(() => [
    createAnalyticsPlugin(handleEventRef),
    createResizeLimiterPlugin(60),
  ], []);

  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const clearLogs = () => {
    setLogs([]);
  };

  const buttonStyle = {
    padding: '6px 12px',
    background: 'var(--vp-c-brand)',
    color: 'white',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold' as const,
    border: 'none',
    cursor: 'pointer',
  };

  const paneStyle = {
    height: '100%',
    display: 'flex',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    fontSize: '14px',
    fontWeight: 'bold' as const,
  };

  const getEventColor = (event: string) => {
    switch (event) {
      case 'init': return '#22c55e';
      case 'drag_start': return '#3b82f6';
      case 'drag_end': return '#8b5cf6';
      case 'destroy': return '#ef4444';
      default: return 'var(--vp-c-text-2)';
    }
  };

  return (
    <div style={{ padding: '20px', background: 'var(--vp-c-bg-soft)', borderRadius: '8px' }}>
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '15px',
        alignItems: 'center',
        padding: '10px',
        background: 'var(--vp-c-bg)',
        borderRadius: '6px',
        border: '1px solid var(--vp-c-divider)'
      }}>
        <span style={{ fontSize: '12px', color: 'var(--vp-c-text-2)' }}>
          Active Plugins: <code>analyticsPlugin</code> + <code>resizeLimiterPlugin</code>
        </span>
        <button onClick={clearLogs} style={{ ...buttonStyle, marginLeft: 'auto' }}>
          Clear Logs
        </button>
      </div>

      <div style={{ display: 'flex', gap: '15px' }}>
        <div style={{ flex: 1 }}>
          <div style={{
            height: '200px',
            border: '1px solid var(--vp-c-divider)',
            borderRadius: '6px',
            overflow: 'hidden',
          }}>
            <Split
              mode="horizontal"
              initialSizes={['50%', '50%']}
              minSizes={[20, 20]}
              plugins={plugins}
            >
              <div style={{ ...paneStyle, background: 'var(--vp-c-bg)' }}>
                Panel A
              </div>
              <div style={{ ...paneStyle, background: 'var(--vp-c-bg-alt)' }}>
                Panel B
              </div>
            </Split>
          </div>
        </div>

        <div style={{
          width: '280px',
          background: '#1e1e1e',
          borderRadius: '6px',
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '8px 12px',
            background: '#2d2d2d',
            fontSize: '11px',
            fontWeight: 'bold',
            color: '#ccc',
            borderBottom: '1px solid #3d3d3d',
          }}>
            Event Log
          </div>
          <div
            ref={logsContainerRef}
            style={{
              height: '164px',
              overflow: 'auto',
              padding: '8px',
              fontFamily: 'monospace',
              fontSize: '11px',
            }}
          >
            {logs.length === 0 ? (
              <div style={{ color: '#666', fontStyle: 'italic' }}>
                Drag the split handle to see events...
              </div>
            ) : (
              logs.map(log => (
                <div key={log.id} style={{ marginBottom: '6px' }}>
                  <span style={{ color: '#666' }}>[{log.timestamp}]</span>{' '}
                  <span style={{ color: getEventColor(log.event), fontWeight: 'bold' }}>
                    {log.event}
                  </span>
                  <div style={{ color: '#888', marginLeft: '12px', fontSize: '10px' }}>
                    {JSON.stringify(log.data)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div style={{
        marginTop: '15px',
        padding: '12px',
        background: 'var(--vp-c-bg)',
        borderRadius: '6px',
        fontSize: '12px',
        color: 'var(--vp-c-text-2)',
      }}>
        <strong>This demo shows two custom plugins:</strong>
        <ul style={{ margin: '8px 0 0 20px', padding: 0 }}>
          <li><strong>analyticsPlugin:</strong> Logs all lifecycle events (init, drag start/end, destroy)</li>
          <li><strong>resizeLimiterPlugin:</strong> Prevents combined pane size from going below 60% (returns <code>false</code> from <code>onDragMove</code> to cancel)</li>
        </ul>
      </div>
    </div>
  );
}
