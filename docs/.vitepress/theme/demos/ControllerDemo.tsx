import React, { useRef } from 'react';
import { Split, type SplitRef } from '@a-multilayout-splitter/core';

export default function ControllerDemo() {
  const splitRef = useRef<SplitRef>(null);

  const handleToggle = () => {
    splitRef.current?.togglePane(0);
  };

  const handleAdd = () => {
    splitRef.current?.addPane({
      size: '30%',
      content: <div style={{ padding: '20px', background: '#e1f5fe' }}>New Dynamic Pane!</div>,
    });
  };

  return (
    <div style={{ padding: '20px', background: 'var(--vp-c-bg-soft)', borderRadius: '8px' }}>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <button
          onClick={handleToggle}
          style={{
            padding: '8px 16px',
            background: 'var(--vp-c-brand)',
            color: 'white',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 'bold',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Toggle Sidebar (via Ref)
        </button>
        <button
          onClick={handleAdd}
          style={{
            padding: '8px 16px',
            background: 'var(--vp-c-brand-soft)',
            color: 'var(--vp-c-brand)',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 'bold',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Add Pane (via Ref)
        </button>
      </div>

      <div style={{ height: '300px', border: '1px solid var(--vp-c-divider)', borderRadius: '6px', overflow: 'hidden' }}>
        <Split ref={splitRef} initialSizes={['30%', '70%']}>
          <div style={{ background: 'var(--vp-c-bg-alt)', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Pane 1</div>
          <div style={{ background: 'var(--vp-c-bg)', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Pane 2</div>
        </Split>
      </div>
    </div>
  );
}
