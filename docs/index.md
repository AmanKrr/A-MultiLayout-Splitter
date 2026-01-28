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
---

<script setup>
import HomeDemo from './.vitepress/theme/demos/HomeDemo'
</script>

<div class="demo-teaser" style="margin-top: 4rem; text-align: center;">
  <h2>Experience the Speed</h2>
  <p style="margin-bottom: 2rem;">Silky smooth 60fps resizing, even on mobile.</p>
  <ClientOnly>
    <ReactContainer :component="HomeDemo" style="min-height: 200px;" />
  </ClientOnly>
</div>
