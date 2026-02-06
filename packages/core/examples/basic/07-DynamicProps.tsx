/**
 * Example 7: Dynamic Props Update
 *
 * Demonstrates that props updated externally are correctly
 * propagated to components inside panes. This is a common
 * pattern when integrating with larger applications where
 * state is managed at a higher level.
 */

import React, { useState, useEffect } from 'react';
import { Split } from '../../src';

/**
 * A component that displays data passed via props.
 * This simulates a real-world component that receives
 * dynamic data from a parent component.
 */
interface DataDisplayProps {
  title: string;
  count: number;
  items: string[];
  lastUpdated: Date;
  theme: 'light' | 'dark';
}

function DataDisplay({ title, count, items, lastUpdated, theme }: DataDisplayProps) {
  const isDark = theme === 'dark';

  return (
    <div
      style={{
        padding: '20px',
        height: '100%',
        background: isDark ? '#1a1a2e' : '#f8f9fa',
        color: isDark ? '#eee' : '#333',
        transition: 'background 0.3s, color 0.3s',
      }}
    >
      <h3 style={{ margin: '0 0 15px 0', color: isDark ? '#4da6ff' : '#0066cc' }}>{title}</h3>

      <div style={{ marginBottom: '15px' }}>
        <strong>Count:</strong>{' '}
        <span
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: isDark ? '#66ff66' : '#28a745',
          }}
        >
          {count}
        </span>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <strong>Items:</strong>
        <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
          {items.map((item, i) => (
            <li key={i} style={{ marginBottom: '3px' }}>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ fontSize: '12px', color: isDark ? '#888' : '#666' }}>Last updated: {lastUpdated.toLocaleTimeString()}</div>
    </div>
  );
}

/**
 * A live counter component that receives its value via props
 */
interface LiveCounterProps {
  value: number;
  label: string;
  color: string;
}

function LiveCounter({ value, label, color }: LiveCounterProps) {
  return (
    <div
      style={{
        padding: '20px',
        height: '100%',
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>{label}</div>
      <div
        style={{
          fontSize: '48px',
          fontWeight: 'bold',
          color: color,
          fontFamily: 'monospace',
        }}
      >
        {value}
      </div>
    </div>
  );
}

export default function DynamicPropsExample() {
  // State that will be updated and passed to child components
  const [count, setCount] = useState(0);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [items, setItems] = useState<string[]>(['Item 1', 'Item 2', 'Item 3']);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  // Auto-increment counter every second
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
      setLastUpdated(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Increment count handler
  const handleIncrement = () => {
    setCount((prev) => prev + 1);
    setLastUpdated(new Date());
  };

  // Add item handler
  const handleAddItem = () => {
    setItems((prev) => [...prev, `Item ${prev.length + 1}`]);
    setLastUpdated(new Date());
  };

  // Toggle theme handler
  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Controls */}
      <div
        style={{
          padding: '15px',
          background: '#f5f5f5',
          borderBottom: '1px solid #ddd',
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <span style={{ fontWeight: 'bold', marginRight: '10px' }}>External Controls:</span>
        <button
          onClick={handleIncrement}
          style={{
            padding: '8px 16px',
            background: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Increment Count (+1)
        </button>
        <button
          onClick={handleAddItem}
          style={{
            padding: '8px 16px',
            background: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Add Item
        </button>
        <button
          onClick={handleToggleTheme}
          style={{
            padding: '8px 16px',
            background: theme === 'light' ? '#333' : '#ffc107',
            color: theme === 'light' ? '#fff' : '#333',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Toggle Theme ({theme})
        </button>
        <button
          onClick={() => {
            setItems(['Item 1', 'Item 2', 'Item 3']);
            setCount(0);
          }}
          style={{
            padding: '8px 16px',
            background: '#dc3545',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Reset
        </button>
      </div>

      {/* Info banner */}
      <div
        style={{
          padding: '10px 15px',
          background: '#e7f3ff',
          borderBottom: '1px solid #b8daff',
          fontSize: '13px',
          color: '#004085',
        }}
      >
        <strong>How it works:</strong> Props are updated in the parent component and passed down to children inside panes. The components re-render with new values without losing their position in the split layout.
      </div>

      {/* Split layout with dynamic props */}
      <div style={{ flex: 1 }}>
        <Split mode="horizontal" initialSizes={['60%', '40%']}>
          {/* Left pane with nested vertical split */}
          <Split mode="vertical" initialSizes={['70%', '30%']}>
            {/* Data display component receiving multiple props */}
            <DataDisplay title="Dynamic Data Panel" count={count} items={items} lastUpdated={lastUpdated} theme={theme} />

            {/* Live counter showing seconds elapsed */}
            <LiveCounter value={secondsElapsed} label="Seconds Elapsed (auto-updating)" color="#6c757d" />
          </Split>

          {/* Right pane with another nested split */}
          <Split mode="vertical" initialSizes={['50%', '50%']}>
            {/* Counter receiving count prop */}
            <LiveCounter value={count} label="Manual Count (click button)" color="#28a745" />

            {/* Items count */}
            <LiveCounter value={items.length} label="Total Items" color="#007bff" />
          </Split>
        </Split>
      </div>
    </div>
  );
}
