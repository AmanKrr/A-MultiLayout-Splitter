import { defineConfig } from 'vitepress'
import react from '@vitejs/plugin-react'

export default defineConfig({
  vite: {
    plugins: [react()],
    resolve: {
      alias: {
        '@a-multilayout-splitter/core': '/Users/amankumar/Desktop/Projects/A-MultiLayout-Splitter/packages/core/src'
      }
    }
  },
  title: "A-MultiLayout-Splitter",
  description: "High-performance resizable split layouts for React",
  base: '/A-MultiLayout-Splitter/', // GitHub Pages base path

  themeConfig: {
    logo: '/logo.png', // Placeholder
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API', link: '/api/props' },
      { text: 'Examples', link: '/examples/basic' },
      { text: 'v6.0.0-alpha', items: [{ text: 'Changelog', link: 'https://github.com/AmanKrr/A-MultiLayout-Splitter/blob/v6/CHANGELOG.md' }] }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Architecture (React-First)', link: '/guide/architecture' },
            { text: 'Migration from v5', link: '/guide/migration' }
          ]
        },
        {
          text: 'Core Concepts',
          items: [
            { text: 'Nested Layouts', link: '/guide/nested' },
            { text: 'State Persistence', link: '/guide/persistence' },
            { text: 'Plugin System', link: '/guide/plugins' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Split Props', link: '/api/props' },
            { text: 'SplitRef API', link: '/api/ref' },
            { text: 'Hooks', link: '/api/hooks' },
            { text: 'Built-in Plugins', link: '/api/plugins' }
          ]
        }
      ],
      '/examples/': [
        {
          text: 'Demos',
          items: [
            { text: 'Basic Layout', link: '/examples/basic' },
            { text: 'Props Playground', link: '/examples/props-playground' },
            { text: 'Nested Sidebar', link: '/examples/nested' },
            { text: 'Custom Handles', link: '/examples/custom-handles' },
            { text: 'Interactive Controller', link: '/examples/controller' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/AmanKrr/A-MultiLayout-Splitter' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026-present Aman Kumar'
    },

    // Algolia Search placeholder
    search: {
      provider: 'local'
    }
  }
})
