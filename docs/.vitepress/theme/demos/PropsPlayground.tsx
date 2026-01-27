import React, { useState } from 'react';
import { Split } from '@a-multilayout-splitter/core';

export default function PropsPlayground() {
  const [mode, setMode] = useState<'horizontal' | 'vertical'>('horizontal');
  const [lineBar, setLineBar] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [paneCount, setPaneCount] = useState(3);
  const [minSize, setMinSize] = useState(10);

  const panes = Array.from({ length: paneCount }).map((_, i) => (
    <div key={i} style={{ 
      background: i % 2 === 0 ? 'var(--vp-c-bg-alt)' : 'var(--vp-c-bg-soft)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      fontSize: '14px',
      color: 'var(--vp-c-text-2)'
    }}>
      Pane {i + 1}
    </div>
  ));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', border: '1px solid var(--vp-c-divider)', borderRadius: '12px', padding: '20px', background: 'var(--vp-c-bg)' }}>
      {/* Control Panel */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
        gap: '15px',
        paddingBottom: '20px',
        borderBottom: '1px solid var(--vp-c-divider)',
        fontSize: '13px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label>Mode</label>
          <select value={mode} onChange={(e) => setMode(e.target.value as any)} style={{ padding: '4px', borderRadius: '4px', border: '1px solid var(--vp-c-divider)', background: 'var(--vp-c-bg-alt)' }}>
            <option value="horizontal">Horizontal</option>
            <option value="vertical">Vertical</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input type="checkbox" id="lineBar" checked={lineBar} onChange={(e) => setLineBar(e.target.checked)} />
          <label htmlFor="lineBar">Thin Line Handle (lineBar)</label>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input type="checkbox" id="disabled" checked={disabled} onChange={(e) => setDisabled(e.target.checked)} />
          <label htmlFor="disabled">Disable Resizing (disable)</label>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input type="checkbox" id="visible" checked={visible} onChange={(e) => setVisible(e.target.checked)} />
          <label htmlFor="visible">Visible Handles (visible)</label>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label>Pane Count: {paneCount}</label>
          <input type="range" min="2" max="6" value={paneCount} onChange={(e) => setPaneCount(parseInt(e.target.value))} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label>Min Pane Size (%): {minSize}</label>
          <input type="range" min="0" max="40" value={minSize} onChange={(e) => setMinSize(parseInt(e.target.value))} />
        </div>
      </div>

      {/* Live Demo */}
      <div style={{ 
        height: '400px', 
        width: '100%', 
        border: '1px solid var(--vp-c-divider)', 
        borderRadius: '8px', 
        overflow: 'hidden',
        position: 'relative'
      }}>
        <Split 
          key={`${mode}-${paneCount}-${minSize}`} // Re-mount when structural props change for clean demo
          mode={mode}
          lineBar={lineBar}
          disable={disabled}
          visible={visible}
          minSizes={Array(paneCount).fill(minSize)}
          initialSizes={Array(paneCount).fill(`${100/paneCount}%`)}
        >
          {panes}
        </Split>
      </div>

      <div style={{ fontSize: '12px', color: 'var(--vp-c-text-3)', fontStyle: 'italic' }}>
        Tip: Change the Mode or LineBar to see the instant visual feedback.
      </div>
    </div>
  );
}
