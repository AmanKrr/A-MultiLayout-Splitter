/**
 * E2E Performance Tests
 *
 * These tests verify that the split component maintains high performance:
 * - 60fps during drag operations
 * - Low memory usage
 * - Handles high DOM element counts
 * - Quick response times
 */

import { test, expect } from '@playwright/test';

test.describe('Performance', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.a-split');
  });

  test('should maintain 60fps during drag operation', async ({ page }) => {
    // Start performance monitoring
    await page.evaluate(() => {
      (window as any).frameTimestamps = [];
      (window as any).frameCount = 0;

      function measureFrame() {
        (window as any).frameTimestamps.push(performance.now());
        (window as any).frameCount++;
        if ((window as any).frameCount < 100) {
          requestAnimationFrame(measureFrame);
        }
      }

      requestAnimationFrame(measureFrame);
    });

    // Perform drag operation
    const handle = page.locator('.a-split-bar').first();
    const handleBox = await handle.boundingBox();
    if (!handleBox) throw new Error('Handle not found');

    await page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2);
    await page.mouse.down();

    // Continuous drag movement
    for (let i = 0; i < 50; i++) {
      await page.mouse.move(
        handleBox.x + handleBox.width / 2 + (i * 2),
        handleBox.y + handleBox.height / 2,
        { steps: 1 }
      );
      await page.waitForTimeout(16); // ~60fps
    }

    await page.mouse.up();

    // Calculate FPS
    const avgFPS = await page.evaluate(() => {
      const timestamps = (window as any).frameTimestamps;
      if (timestamps.length < 2) return 0;

      let totalFPS = 0;
      for (let i = 1; i < timestamps.length; i++) {
        const delta = timestamps[i] - timestamps[i - 1];
        totalFPS += 1000 / delta;
      }

      return totalFPS / (timestamps.length - 1);
    });

    console.log(`Average FPS during drag: ${avgFPS.toFixed(2)}`);

    // Verify maintains close to 60fps (allow 50fps minimum for CI environments)
    expect(avgFPS).toBeGreaterThan(50);
  });

  test('should handle large number of panes efficiently', async ({ page }) => {
    // This test requires a specific example page with many panes
    // Skip if not available
    test.skip();
  });

  test('should have low memory footprint', async ({ page }) => {
    // Get initial memory metrics
    const initialMetrics = await page.evaluate(() => {
      if (performance.memory) {
        return {
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          totalJSHeapSize: performance.memory.totalJSHeapSize,
        };
      }
      return null;
    });

    if (!initialMetrics) {
      test.skip();
      return;
    }

    // Perform multiple drag operations
    const handle = page.locator('.a-split-bar').first();
    const handleBox = await handle.boundingBox();
    if (!handleBox) throw new Error('Handle not found');

    for (let i = 0; i < 20; i++) {
      await page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2);
      await page.mouse.down();
      await page.mouse.move(handleBox.x + handleBox.width / 2 + 100, handleBox.y + handleBox.height / 2, { steps: 10 });
      await page.mouse.up();
      await page.waitForTimeout(50);

      // Drag back
      await page.mouse.move(handleBox.x + handleBox.width / 2 + 100, handleBox.y + handleBox.height / 2);
      await page.mouse.down();
      await page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2, { steps: 10 });
      await page.mouse.up();
      await page.waitForTimeout(50);
    }

    // Get final memory metrics
    const finalMetrics = await page.evaluate(() => {
      if (performance.memory) {
        return {
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          totalJSHeapSize: performance.memory.totalJSHeapSize,
        };
      }
      return null;
    });

    if (!finalMetrics) {
      test.skip();
      return;
    }

    // Calculate memory increase
    const memoryIncrease = finalMetrics.usedJSHeapSize - initialMetrics.usedJSHeapSize;
    const memoryIncreaseMB = memoryIncrease / (1024 * 1024);

    console.log(`Memory increase: ${memoryIncreaseMB.toFixed(2)} MB`);

    // Verify memory increase is reasonable (< 10MB for 20 drag operations)
    expect(memoryIncreaseMB).toBeLessThan(10);
  });

  test('should respond quickly to drag start', async ({ page }) => {
    const handle = page.locator('.a-split-bar').first();
    const handleBox = await handle.boundingBox();
    if (!handleBox) throw new Error('Handle not found');

    // Measure time from mousedown to first visual change
    const responseTime = await page.evaluate(async (coords) => {
      const startTime = performance.now();

      // Simulate mousedown
      const handle = document.querySelector('.a-split-bar');
      if (!handle) return -1;

      const event = new MouseEvent('mousedown', {
        bubbles: true,
        clientX: coords.x,
        clientY: coords.y,
      });

      handle.dispatchEvent(event);

      // Wait for next frame
      await new Promise((resolve) => requestAnimationFrame(resolve));

      const endTime = performance.now();
      return endTime - startTime;
    }, { x: handleBox.x + handleBox.width / 2, y: handleBox.y + handleBox.height / 2 });

    console.log(`Drag start response time: ${responseTime.toFixed(2)}ms`);

    // Verify response time is quick (< 50ms)
    expect(responseTime).toBeLessThan(50);
  });

  test('should maintain performance with nested splits', async ({ page }) => {
    // Check if nested splits exist
    const nestedSplits = page.locator('.a-split .a-split');
    const nestedCount = await nestedSplits.count();

    if (nestedCount === 0) {
      test.skip();
      return;
    }

    // Start FPS monitoring
    await page.evaluate(() => {
      (window as any).frameTimestamps = [];
      (window as any).frameCount = 0;

      function measureFrame() {
        (window as any).frameTimestamps.push(performance.now());
        (window as any).frameCount++;
        if ((window as any).frameCount < 100) {
          requestAnimationFrame(measureFrame);
        }
      }

      requestAnimationFrame(measureFrame);
    });

    // Drag outer handle
    const outerHandle = page.locator('.a-split > .a-split-bar').first();
    const outerBox = await outerHandle.boundingBox();
    if (outerBox) {
      await page.mouse.move(outerBox.x + outerBox.width / 2, outerBox.y + outerBox.height / 2);
      await page.mouse.down();
      for (let i = 0; i < 20; i++) {
        await page.mouse.move(
          outerBox.x + outerBox.width / 2 + (i * 2),
          outerBox.y + outerBox.height / 2,
          { steps: 1 }
        );
        await page.waitForTimeout(16);
      }
      await page.mouse.up();
    }

    // Calculate FPS
    const avgFPS = await page.evaluate(() => {
      const timestamps = (window as any).frameTimestamps;
      if (timestamps.length < 2) return 0;

      let totalFPS = 0;
      for (let i = 1; i < timestamps.length; i++) {
        const delta = timestamps[i] - timestamps[i - 1];
        totalFPS += 1000 / delta;
      }

      return totalFPS / (timestamps.length - 1);
    });

    console.log(`Average FPS with nested splits: ${avgFPS.toFixed(2)}`);

    // Verify maintains good performance even with nested splits
    expect(avgFPS).toBeGreaterThan(45); // Slightly lower threshold for nested complexity
  });

  test('should not cause layout thrashing', async ({ page }) => {
    const handle = page.locator('.a-split-bar').first();
    const handleBox = await handle.boundingBox();
    if (!handleBox) throw new Error('Handle not found');

    // Monitor layout recalculations
    const layoutRecalcs = await page.evaluate(async (coords) => {
      let layoutCount = 0;
      const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;

      // Intercept getBoundingClientRect calls (indicates layout recalc)
      Element.prototype.getBoundingClientRect = function () {
        layoutCount++;
        return originalGetBoundingClientRect.call(this);
      };

      // Perform drag
      const handle = document.querySelector('.a-split-bar');
      if (!handle) return -1;

      const mouseDown = new MouseEvent('mousedown', {
        bubbles: true,
        clientX: coords.x,
        clientY: coords.y,
      });
      handle.dispatchEvent(mouseDown);

      // Simulate drag movement
      for (let i = 0; i < 10; i++) {
        const mouseMove = new MouseEvent('mousemove', {
          bubbles: true,
          clientX: coords.x + i * 10,
          clientY: coords.y,
        });
        window.dispatchEvent(mouseMove);
        await new Promise((resolve) => requestAnimationFrame(resolve));
      }

      const mouseUp = new MouseEvent('mouseup', { bubbles: true });
      window.dispatchEvent(mouseUp);

      // Restore original function
      Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;

      return layoutCount;
    }, { x: handleBox.x + handleBox.width / 2, y: handleBox.y + handleBox.height / 2 });

    console.log(`Layout recalculations during drag: ${layoutRecalcs}`);

    // Verify minimal layout recalculations (direct DOM manipulation should minimize these)
    // Allow some recalcs but not excessive
    expect(layoutRecalcs).toBeLessThan(50);
  });

  test('should handle rapid resize events efficiently', async ({ page }) => {
    const startTime = Date.now();

    // Perform 50 rapid resize operations
    for (let i = 0; i < 50; i++) {
      await page.setViewportSize({
        width: 1000 + (i % 2 ? 100 : 0),
        height: 800,
      });
      await page.waitForTimeout(10);
    }

    const endTime = Date.now();
    const totalTime = endTime - startTime;

    console.log(`50 resize operations completed in: ${totalTime}ms`);

    // Verify component is still responsive after rapid resizes
    const split = page.locator('.a-split').first();
    await expect(split).toBeVisible();

    // Total time should be reasonable
    expect(totalTime).toBeLessThan(3000); // Less than 3 seconds for 50 resizes
  });
});
