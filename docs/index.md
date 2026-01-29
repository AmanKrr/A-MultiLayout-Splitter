---
layout: home

hero:
  name: "A-MultiLayout-Splitter"
  text: "High-Performance React Splitters"
  tagline: Zero-lag resizable layouts with a modern React-First architecture.
  image:
    src: /logo.svg
    alt: Splitter Logo
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/AmanKrr/A-MultiLayout-Splitter

features:
  - title: ⚡️ 60fps Performance
    details: Uses direct DOM manipulation during dragging to bypass React's render loop, ensuring silky smooth resizing.
  - title: 🧩 Plugin System
    details: Easily extend functionality with built-in or custom plugins for persistence, keyboard accessibility, and more.
  - title: 🌲 Deep Nesting
    details: Rock-solid support for complex, multi-level nested layouts without CSS layout thrashing.
  - title: 💾 Auto-Persistence
    details: Remember user layouts across sessions with zero-config localStorage/sessionStorage hooks.
  - title: ⌨️ Accessible
    details: Full keyboard navigation support and ARIA compliance built into the core handle logic.
  - title: 📦 Lightweight
    details: Zero dependencies (no lodash!), optimized for modern ESM ecosystems and small bundle sizes.
  - title: ⚛️ React 17, 18 & 19
    details: Compatible with React 17, 18, and 19. Works seamlessly with the latest React features.
---

<script setup>
import HomeDemo from './.vitepress/theme/demos/HomeDemo'
</script>

<div style="margin-top: 3rem; text-align: center;">
  <a href="https://github.com/AmanKrr/A-MultiLayout-Splitter" target="_blank" class="github-star-btn">
    <svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
    Star on GitHub
  </a>
</div>

<div class="demo-teaser" style="margin-top: 2rem; text-align: center;">
  <h2>Experience the Speed</h2>
  <p style="margin-bottom: 2rem;">Silky smooth 60fps resizing, even on mobile.</p>
  <ClientOnly>
    <ReactContainer :component="HomeDemo" style="min-height: 200px;" />
  </ClientOnly>
</div>
