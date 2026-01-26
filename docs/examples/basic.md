<script setup>
import BasicDemo from '../.vitepress/theme/demos/BasicDemo'
</script>

# Basic Layout Demo

A standard horizontal split with two panes. This example demonstrates percentage-based initial sizes and minimum constraints.

<ReactContainer :component="BasicDemo" />

## Features shown:
- **`mode="horizontal"`**: Side-by-side layout.
- **`initialSizes`**: Setting a percentage-based starting ratio.
- **`minSizes`**: Ensuring neither pane can be collapsed smaller than 20%.
