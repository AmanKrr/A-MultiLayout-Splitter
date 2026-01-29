/**
 * Plugin Example 2: Keyboard Navigation Plugin
 *
 * Demonstrates the keyboard plugin for accessibility.
 * Allows resizing panes using keyboard shortcuts.
 */

import React from 'react';
import { Split, keyboardPlugin } from '../../src';

// Configure keyboard plugin
const myKeyboardPlugin = keyboardPlugin({
  stepSize: 5, // Resize by 5% per keystroke
  enableArrowKeys: true,
  enableTabNavigation: true,
});

export default function KeyboardPluginExample() {
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <div
        style={{
          position: 'fixed',
          top: 10,
          left: 10,
          background: '#9c27b0',
          color: 'white',
          padding: '15px 20px',
          borderRadius: '8px',
          zIndex: 1000,
          fontSize: '14px',
        }}
      >
        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>⌨️ Keyboard Plugin Active</div>
        <div style={{ fontSize: '12px' }}>
          <div>Tab: Focus handlebars</div>
          <div>←/→: Resize horizontal</div>
          <div>↑/↓: Resize vertical</div>
          <div>Space: Collapse/Expand</div>
        </div>
      </div>

      <Split id="keyboard-example" mode="horizontal" initialSizes={['50%', '50%']} plugins={[myKeyboardPlugin]}>
        <div style={{ padding: '20px', background: '#e8f5e9', paddingTop: '120px' }}>
          <h2>Left Pane</h2>
          <h3>Keyboard Shortcuts:</h3>
          <table style={{ width: '100%', fontSize: '14px', marginTop: '10px' }}>
            <tbody>
              <tr>
                <td style={{ padding: '5px', fontWeight: 'bold' }}>Tab</td>
                <td style={{ padding: '5px' }}>Focus next handlebar</td>
              </tr>
              <tr>
                <td style={{ padding: '5px', fontWeight: 'bold' }}>Shift + Tab</td>
                <td style={{ padding: '5px' }}>Focus previous handlebar</td>
              </tr>
              <tr>
                <td style={{ padding: '5px', fontWeight: 'bold' }}>Arrow Left/Right</td>
                <td style={{ padding: '5px' }}>Resize horizontal split</td>
              </tr>
              <tr>
                <td style={{ padding: '5px', fontWeight: 'bold' }}>Arrow Up/Down</td>
                <td style={{ padding: '5px' }}>Resize vertical split</td>
              </tr>
              <tr>
                <td style={{ padding: '5px', fontWeight: 'bold' }}>Space / Enter</td>
                <td style={{ padding: '5px' }}>Toggle collapse/expand</td>
              </tr>
            </tbody>
          </table>
          <h3 style={{ marginTop: '20px' }}>Accessibility Features:</h3>
          <ul>
            <li>Full keyboard navigation</li>
            <li>Focus indicators</li>
            <li>Screen reader friendly</li>
            <li>WCAG 2.1 compliant</li>
          </ul>
        </div>
        <div style={{ padding: '20px', background: '#f3e5f5', paddingTop: '120px' }}>
          <h2>Right Pane</h2>
          <h3>Try It Now:</h3>
          <ol style={{ lineHeight: '1.8' }}>
            <li>
              Press <kbd style={{ background: '#fff', padding: '2px 8px', border: '1px solid #ccc', borderRadius: '3px' }}>Tab</kbd> to focus the handlebar
            </li>
            <li>Notice the focus indicator (blue outline)</li>
            <li>
              Use <kbd style={{ background: '#fff', padding: '2px 8px', border: '1px solid #ccc', borderRadius: '3px' }}>←</kbd>{' '}
              <kbd style={{ background: '#fff', padding: '2px 8px', border: '1px solid #ccc', borderRadius: '3px' }}>→</kbd> to resize
            </li>
            <li>
              Press <kbd style={{ background: '#fff', padding: '2px 8px', border: '1px solid #ccc', borderRadius: '3px' }}>Space</kbd> to collapse this pane
            </li>
          </ol>
          <h3>Configuration:</h3>
          <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', fontSize: '13px' }}>
            {`const plugin = keyboardPlugin({
  resizeStep: 5,
  enableFocusIndicator: true,
});`}
          </pre>
        </div>
      </Split>
    </div>
  );
}
