<script setup>
import { onMounted, onBeforeUnmount, ref, h } from 'vue'
import { createRoot } from 'react-dom/client'
import React from 'react'

const props = defineProps({
  component: {
    type: [Object, Function],
    required: true
  }
})

const rootRef = ref(null)
let reactRoot = null

onMounted(() => {
  if (rootRef.value) {
    reactRoot = createRoot(rootRef.value)
    reactRoot.render(React.createElement(props.component))
  }
})

onBeforeUnmount(() => {
  if (reactRoot) {
    reactRoot.unmount()
  }
})
</script>

<template>
  <div class="react-container" ref="rootRef"></div>
</template>

<style scoped>
.react-container {
  width: 100%;
  height: 100%;
  min-height: 300px;
  border-radius: 8px;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  margin: 1rem 0;
}
</style>
