import { Split } from '@a-multilayout-splitter/core';

export default function HomeDemo() {
  return (
    <div style={{ height: '200px', width: '100%', border: '1px solid var(--vp-c-divider)', borderRadius: '8px', overflow: 'hidden' }}>
      <Split initialSizes={['30%', '70%']}>
        <div style={{ background: 'var(--vp-c-brand-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>SIDEBAR</div>
        <div style={{ background: 'var(--vp-c-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>DRAG ME</div>
      </Split>
    </div>
  );
}
