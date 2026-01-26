import { Split } from '@a-multilayout-splitter/core';

export default function BasicDemo() {
  return (
    <div style={{ height: '300px', width: '100%' }}>
      <Split initialSizes={['30%', '70%']}>
        <div style={{ 
          background: 'var(--vp-c-brand-soft)', 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          Sidebar Content
        </div>
        <div style={{ 
          background: 'var(--vp-c-bg)', 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          Main Content Area
        </div>
      </Split>
    </div>
  );
}
