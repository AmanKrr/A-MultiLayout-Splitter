/**
 * Vitest Test Setup
 *
 * Global test configuration and setup for the test suite.
 * This file is automatically loaded before each test file.
 */

import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';

// Mock localStorage and sessionStorage
const createStorageMock = () => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    },
  };
};

global.localStorage = createStorageMock() as Storage;
global.sessionStorage = createStorageMock() as Storage;

// Cleanup after each test
afterEach(() => {
  cleanup();
  localStorage.clear();
  sessionStorage.clear();
});

// Mock requestAnimationFrame and cancelAnimationFrame
beforeEach(() => {
  let rafId = 0;
  const callbacks = new Map<number, FrameRequestCallback>();

  global.requestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
    const id = ++rafId;
    callbacks.set(id, callback);
    setTimeout(() => {
      const cb = callbacks.get(id);
      if (cb) {
        cb(performance.now());
        callbacks.delete(id);
      }
    }, 0);
    return id;
  });

  global.cancelAnimationFrame = vi.fn((id: number) => {
    callbacks.delete(id);
  });
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
  readonly root: Element | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
};
