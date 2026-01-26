import { Split } from '@a-multilayout-splitter/core';

export default function NestedDemo() {
  return (
    <div style={{ height: '400px', width: '100%', background: '#1e1e1e', padding: '10px' }}>
      <Split mode="horizontal" initialSizes={['20%', '80%']}>
        <div style={{ 
          background: '#252526', 
          color: '#ccc',
          height: '100%', 
          padding: '10px',
          fontSize: '12px'
        }}>
          EXPLORER
          <div style={{ marginTop: '10px', opacity: 0.5 }}>- src</div>
          <div style={{ paddingLeft: '10px', opacity: 0.5 }}>- components</div>
          <div style={{ paddingLeft: '10px', opacity: 0.5 }}>- utils</div>
        </div>

        <Split mode="vertical" initialSizes={['70%', '30%']}>
          <div style={{ 
            background: '#1e1e1e', 
            color: '#858585',
            height: '100%', 
            padding: '20px'
          }}>
            // Editor content goes here
            <pre style={{ color: '#d4d4d4' }}>
              {`function App() {\n  return (\n    <Split>\n      <div>Hello</div>\n    </Split>\n  );\n}`}
            </pre>
          </div>
          
          <div style={{ 
            background: '#000', 
            color: '#0f0',
            height: '100%', 
            padding: '10px',
            fontFamily: 'monospace',
            fontSize: '12px'
          }}>
            TERMINAL
            <div style={{ marginTop: '5px' }}>$ pnpm run docs:dev</div>
            <div style={{ color: '#fff' }}>➜  Local:   http://localhost:5173/</div>
          </div>
        </Split>
      </Split>
    </div>
  );
}
