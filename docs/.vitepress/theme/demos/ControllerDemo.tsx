import React from 'react';
import { useSplitController, Split } from '@a-multilayout-splitter/core';

export default function ControllerDemo() {
  const { panes, togglePane, addPane } = useSplitController({
    initialSizes: ['50%', '50%']
  });

  return (
    <div style={{ padding: '20px', background: 'var(--vp-c-bg-soft)', borderRadius: '8px' }}>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <button 
          onClick={() => togglePane(0)}
          style={{ 
            padding: '6px 12px', 
            background: 'var(--vp-c-brand)', 
            color: 'white', 
            borderRadius: '4px',
            fontSize: '14px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Toggle Sidebar
        </button>
        <button 
          onClick={() => addPane({ size: '30%', content: <div style={{ padding: '10px' }}>New Pane!</div> })}
          style={{ 
            padding: '6px 12px', 
            background: 'var(--vp-c-brand-soft)', 
            color: 'var(--vp-c-brand)', 
            borderRadius: '4px',
            fontSize: '14px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Add Pane
        </button>
      </div>

      <div style={{ height: '300px', border: '1px solid var(--vp-c-divider)', borderRadius: '4px', overflow: 'hidden' }}>
        <Split initialPanes={panes} />
      </div>
    </div>
  );
}
