<script setup>
import NestedDemo from '../.vitepress/theme/demos/NestedDemo'
</script>

# Nested Layout Demo

This advanced demo reproduces a common IDE structure: a horizontal sidebar with a vertical split for the editor and terminal.

<ReactContainer :component="NestedDemo" />

## How it works:
1. The **Outer Split** creates two columns.
2. The second column contains another **Inner Split**.
3. The Inner Split automatically increments its "nesting level" to manage Z-index and event handling correctly.
