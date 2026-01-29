/**
 * A-MultiLayout-Splitter v6 - Examples Index
 *
 * Comprehensive showcase of all features and capabilities.
 */

import React, { useState } from 'react';

// Basic Examples
import SimpleHorizontal from './basic/01-SimpleHorizontal';
import SimpleVertical from './basic/02-SimpleVertical';
import ThreePanes from './basic/03-ThreePanes';
import MinMaxSizes from './basic/04-MinMaxSizes';
import InitialCollapsed from './basic/05-InitialCollapsed';
import PixelSizes from './basic/06-PixelSizes';

// Advanced Examples
import DisabledHandlebars from './advanced/01-DisabledHandlebars';
import LineBarStyle from './advanced/02-LineBarStyle';
import CustomHandlebar from './advanced/03-CustomHandlebar';
import DragCallbacks from './advanced/04-DragCallbacks';
import SessionStorage from './advanced/05-SessionStorage';

// API Examples
import DeclarativeAPI from './api/01-DeclarativeAPI';
import ImperativeAPI from './api/02-ImperativeAPI';
import HookBasedAPI from './api/03-HookBasedAPI';

// Nested Examples
import SimpleNested from './nested/01-SimpleNested';
import ComplexNested from './nested/02-ComplexNested';
import AutoFixClass from './nested/03-AutoFixClass';

// Plugin Examples
import PersistencePlugin from './plugins/01-PersistencePlugin';
import KeyboardPlugin from './plugins/02-KeyboardPlugin';
import CustomPlugin from './plugins/03-CustomPlugin';

interface Example {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType;
  category: 'basic' | 'advanced' | 'api' | 'nested' | 'plugins';
}

const EXAMPLES: Example[] = [
  // Basic
  {
    id: 'simple-horizontal',
    title: '01. Simple Horizontal Split',
    description: 'Two panes split horizontally (side by side)',
    component: SimpleHorizontal,
    category: 'basic',
  },
  {
    id: 'simple-vertical',
    title: '02. Simple Vertical Split',
    description: 'Two panes split vertically (top and bottom)',
    component: SimpleVertical,
    category: 'basic',
  },
  {
    id: 'three-panes',
    title: '03. Three Panes',
    description: 'Multiple panes with multiple handlebars',
    component: ThreePanes,
    category: 'basic',
  },
  {
    id: 'min-max-sizes',
    title: '04. Min/Max Sizes',
    description: 'Constraining pane sizes with boundaries',
    component: MinMaxSizes,
    category: 'basic',
  },
  {
    id: 'initial-collapsed',
    title: '05. Initial Collapsed State',
    description: 'Starting with collapsed panes',
    component: InitialCollapsed,
    category: 'basic',
  },
  {
    id: 'pixel-sizes',
    title: '06. Pixel-Based Sizes',
    description: 'Using fixed pixel values instead of percentages',
    component: PixelSizes,
    category: 'basic',
  },

  // Advanced
  {
    id: 'disabled-handlebars',
    title: '01. Disabled Handlebars',
    description: 'Preventing resize on specific handlebars',
    component: DisabledHandlebars,
    category: 'advanced',
  },
  {
    id: 'line-bar-style',
    title: '02. Line Bar Style',
    description: 'Minimal line-style handlebars',
    component: LineBarStyle,
    category: 'advanced',
  },
  {
    id: 'custom-handlebar',
    title: '03. Custom Handlebar',
    description: 'Creating custom handlebar designs',
    component: CustomHandlebar,
    category: 'advanced',
  },
  {
    id: 'drag-callbacks',
    title: '04. Drag Callbacks',
    description: 'Responding to drag events',
    component: DragCallbacks,
    category: 'advanced',
  },
  {
    id: 'session-storage',
    title: '05. Session Storage',
    description: 'Automatic layout persistence',
    component: SessionStorage,
    category: 'advanced',
  },

  // API
  {
    id: 'declarative-api',
    title: '01. Declarative API',
    description: 'Control via props and state (recommended)',
    component: DeclarativeAPI,
    category: 'api',
  },
  {
    id: 'imperative-api',
    title: '02. Imperative API',
    description: 'Control via ref methods',
    component: ImperativeAPI,
    category: 'api',
  },
  {
    id: 'hook-based-api',
    title: '03. Hook-Based API',
    description: 'useSplitController hook',
    component: HookBasedAPI,
    category: 'api',
  },

  // Nested
  {
    id: 'simple-nested',
    title: '01. Simple Nested Layout',
    description: 'Basic nested splits (IDE-like)',
    component: SimpleNested,
    category: 'nested',
  },
  {
    id: 'complex-nested',
    title: '02. Complex Nested Layout',
    description: 'Deep nesting with multiple levels',
    component: ComplexNested,
    category: 'nested',
  },
  {
    id: 'auto-fix-class',
    title: '03. Auto Fix Class',
    description: 'Automatic positioning fix for deep nesting',
    component: AutoFixClass,
    category: 'nested',
  },

  // Plugins
  {
    id: 'persistence-plugin',
    title: '01. Persistence Plugin',
    description: 'Automatic localStorage persistence',
    component: PersistencePlugin,
    category: 'plugins',
  },
  {
    id: 'keyboard-plugin',
    title: '02. Keyboard Plugin',
    description: 'Keyboard navigation and accessibility',
    component: KeyboardPlugin,
    category: 'plugins',
  },
  {
    id: 'custom-plugin',
    title: '03. Custom Plugin',
    description: 'Creating your own plugins',
    component: CustomPlugin,
    category: 'plugins',
  },
];

export default function ExamplesIndex() {
  const [selectedExample, setSelectedExample] = useState<Example>(EXAMPLES[0]);
  const [category, setCategory] = useState<string>('basic');

  const filteredExamples = EXAMPLES.filter((ex) => ex.category === category);
  const SelectedComponent = selectedExample.component;

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', flexDirection: 'column' }}>
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '24px' }}>A-MultiLayout-Splitter v6</h1>
        <p style={{ margin: '5px 0 0 0', opacity: 0.9 }}>Comprehensive Examples Showcase - {EXAMPLES.length} Examples</p>
      </div>

      {/* Category Tabs */}
      <div style={{ background: '#f5f5f5', borderBottom: '1px solid #ddd', padding: '10px 20px' }}>
        {['basic', 'advanced', 'api', 'nested', 'plugins'].map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setCategory(cat);
              const firstExample = EXAMPLES.find((ex) => ex.category === cat);
              if (firstExample) setSelectedExample(firstExample);
            }}
            style={{
              marginRight: '10px',
              padding: '8px 16px',
              border: 'none',
              background: category === cat ? '#667eea' : '#fff',
              color: category === cat ? '#fff' : '#333',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: category === cat ? 'bold' : 'normal',
              textTransform: 'capitalize',
            }}
          >
            {cat} ({EXAMPLES.filter((ex) => ex.category === cat).length})
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar - Example List */}
        <div
          style={{
            width: '300px',
            background: '#fafafa',
            borderRight: '1px solid #ddd',
            overflowY: 'auto',
          }}
        >
          {filteredExamples.map((example) => (
            <div
              key={example.id}
              onClick={() => setSelectedExample(example)}
              style={{
                padding: '15px',
                borderBottom: '1px solid #eee',
                cursor: 'pointer',
                background: selectedExample.id === example.id ? '#fff' : 'transparent',
                borderLeft: selectedExample.id === example.id ? '3px solid #667eea' : '3px solid transparent',
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{example.title}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>{example.description}</div>
            </div>
          ))}
        </div>

        {/* Example Display Area */}
        <div style={{ flex: 1, position: 'relative' }}>
          <SelectedComponent />
        </div>
      </div>

      {/* Footer Info */}
      <div
        style={{
          background: '#f5f5f5',
          padding: '10px 20px',
          borderTop: '1px solid #ddd',
          fontSize: '12px',
          color: '#666',
        }}
      >
        <strong>{selectedExample.title}</strong> - {selectedExample.description}
      </div>
    </div>
  );
}
