import React from 'react';
import { Split, customHandleRenderPlugin } from '@a-multilayout-splitter/core';

const MyHandle = (props: any) => (
  <div 
    onMouseDown={props.onMouseDown}
    style={{
      width: '12px',
      background: props.disabled ? 'var(--vp-c-divider)' : 'var(--vp-c-brand)',
      cursor: 'col-resize',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background 0.2s',
      zIndex: 10
    }}
  >
    <div style={{ 
      width: '2px', 
      height: '30px', 
      background: 'rgba(255,255,255,0.5)', 
      borderRadius: '1px' 
    }} />
  </div>
);

export default function CustomHandleDemo() {
  return (
    <div style={{ height: '300px', width: '100%', border: '1px solid var(--vp-c-divider)', borderRadius: '8px', overflow: 'hidden' }}>
      <Split 
        plugins={[customHandleRenderPlugin(MyHandle)]}
        initialSizes={['50%', '50%']}
      >
        <div style={{ background: 'var(--vp-c-bg-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          Custom Handle Left
        </div>
        <div style={{ background: 'var(--vp-c-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          Custom Handle Right
        </div>
      </Split>
    </div>
  );
}
