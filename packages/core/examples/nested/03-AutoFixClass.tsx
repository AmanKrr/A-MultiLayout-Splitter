/**
 * Nested Example 3: Auto Fix Class for Deep Nesting
 *
 * Demonstrates automatic application of position:absolute fix
 * for deeply nested layouts (>2 levels).
 */

import React from 'react';
import { Split } from '../../src';

export default function AutoFixClassExample() {
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <div
        style={{
          position: 'fixed',
          top: 10,
          left: 10,
          background: '#ff9800',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '8px',
          zIndex: 1000,
          fontSize: '14px',
        }}
      >
        🔧 Auto Fix Class enabled for deep nesting
      </div>

      {/* Level 1 */}
      <Split mode="horizontal" initialSizes={['50%', '50%']}>
        <div style={{ padding: '20px', background: '#e8f5e9' }}>
          <h3>Level 1 - Left</h3>
          <p>No fix class needed at this level</p>
        </div>

        {/* Level 2 */}
        <Split mode="vertical" initialSizes={['50%', '50%']}>
          <div style={{ padding: '20px', background: '#fff9c4' }}>
            <h3>Level 2 - Top</h3>
            <p>Still no fix class needed</p>
          </div>

          {/* Level 3 */}
          <Split mode="horizontal" initialSizes={['50%', '50%']}>
            <div style={{ padding: '20px', background: '#f3e5f5' }}>
              <h3>Level 3 - Left</h3>
              <p>⚠️ Auto fix class applied!</p>
              <p>This prevents layout collapse in deep nesting</p>
              <p style={{ fontSize: '12px', marginTop: '10px', opacity: 0.7 }}>
                When nesting level {'>'} 2, the component automatically applies
                <code style={{ background: '#000', color: '#0f0', padding: '2px 5px' }}>.a-split-fix</code> class
              </p>
            </div>

            {/* Level 4 */}
            <Split mode="vertical" initialSizes={['50%', '50%']}>
              <div style={{ padding: '20px', background: '#e1f5fe' }}>
                <h3>Level 4 - Top</h3>
                <p>✅ Fix class active</p>
                <p>Layout remains stable</p>
              </div>
              <div style={{ padding: '20px', background: '#fce4ec' }}>
                <h3>Level 4 - Bottom</h3>
                <p>✅ Fix class active</p>
                <p>Even at 4 levels deep!</p>
              </div>
            </Split>
          </Split>
        </Split>
      </Split>
    </div>
  );
}
