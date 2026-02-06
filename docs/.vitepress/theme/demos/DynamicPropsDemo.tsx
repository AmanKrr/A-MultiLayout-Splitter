import { useState, useEffect } from 'react';
import { Split } from '@a-multilayout-splitter/core';

/**
 * A component that displays data passed via props.
 */
interface DataDisplayProps {
  title: string;
  count: number;
  items: string[];
  theme: 'light' | 'dark';
}

function DataDisplay({ title, count, items, theme }: DataDisplayProps) {
  const isDark = theme === 'dark';

  return (
    <div
      style={{
        padding: '15px',
        height: '100%',
        background: isDark ? '#1a1a2e' : 'var(--vp-c-bg-soft)',
        color: isDark ? '#eee' : 'var(--vp-c-text-1)',
        transition: 'background 0.3s, color 0.3s',
      }}
    >
      <h4 style={{ margin: '0 0 10px 0', color: isDark ? '#4da6ff' : 'var(--vp-c-brand)' }}>{title}</h4>

      <div style={{ marginBottom: '10px' }}>
        <strong>Count:</strong>{' '}
        <span
          style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: isDark ? '#66ff66' : 'var(--vp-c-green)',
          }}
        >
          {count}
        </span>
      </div>

      <div>
        <strong>Items:</strong>
        <ul style={{ margin: '5px 0', paddingLeft: '20px', fontSize: '13px' }}>
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/**
 * A live counter component
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
        padding: '15px',
        height: '100%',
        background: 'var(--vp-c-bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ fontSize: '11px', color: 'var(--vp-c-text-2)', marginBottom: '5px' }}>{label}</div>
      <div
        style={{
          fontSize: '32px',
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

export default function DynamicPropsDemo() {
  const [count, setCount] = useState(0);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [items, setItems] = useState<string[]>(['Item 1', 'Item 2', 'Item 3']);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  // Auto-increment counter every second
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ height: '350px', width: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Controls */}
      <div
        style={{
          padding: '10px',
          background: 'var(--vp-c-bg-soft)',
          borderBottom: '1px solid var(--vp-c-divider)',
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <span style={{ fontWeight: 'bold', fontSize: '12px', marginRight: '5px' }}>Controls:</span>
        <button
          onClick={() => setCount((prev) => prev + 1)}
          style={{
            padding: '5px 12px',
            background: 'var(--vp-c-green)',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          +1 Count
        </button>
        <button
          onClick={() => setItems((prev) => [...prev, `Item ${prev.length + 1}`])}
          style={{
            padding: '5px 12px',
            background: 'var(--vp-c-brand)',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          Add Item
        </button>
        <button
          onClick={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
          style={{
            padding: '5px 12px',
            background: theme === 'light' ? '#333' : '#ffc107',
            color: theme === 'light' ? '#fff' : '#333',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          {theme === 'light' ? 'Dark' : 'Light'}
        </button>
        <button
          onClick={() => {
            setItems(['Item 1', 'Item 2', 'Item 3']);
            setCount(0);
          }}
          style={{
            padding: '5px 12px',
            background: 'var(--vp-c-danger-1)',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          Reset
        </button>
      </div>

      {/* Split layout */}
      <div style={{ flex: 1 }}>
        <Split mode="horizontal" initialSizes={['55%', '45%']}>
          <Split mode="vertical" initialSizes={['65%', '35%']}>
            <DataDisplay title="Dynamic Data Panel" count={count} items={items} theme={theme} />
            <LiveCounter value={secondsElapsed} label="Auto Counter (seconds)" color="var(--vp-c-text-2)" />
          </Split>

          <Split mode="vertical" initialSizes={['50%', '50%']}>
            <LiveCounter value={count} label="Manual Count" color="var(--vp-c-green)" />
            <LiveCounter value={items.length} label="Total Items" color="var(--vp-c-brand)" />
          </Split>
        </Split>
      </div>
    </div>
  );
}
