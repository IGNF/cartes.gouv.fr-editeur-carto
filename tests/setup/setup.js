

import { createCanvas } from 'canvas';
import { vi } from 'vitest';

globalThis.HTMLCanvasElement = class {};
globalThis.CanvasRenderingContext2D = createCanvas(1, 1).getContext('2d').constructor;

// Object.defineProperty(window, 'matchMedia', {
//   writable: true,
//   value: vi.fn().mockImplementation(query => ({
//     matches: false,
//     media: query,
//     onchange: null,
//     addListener: vi.fn(),
//     removeListener: vi.fn(),
//     addEventListener: vi.fn(),
//     removeEventListener: vi.fn(),
//     dispatchEvent: vi.fn(),
//   })),
// });

globalThis.fetch = async (url) => {
  throw new Error(`Network access disabled in tests. Tried to fetch: ${url}`);
};

// Mock la fonction d'import
// (Empêche d'avoir l'erreur "Error: connect ECONNREFUSED 127.0.0.1:3000")
vi.mock('mcutils/config/import', () => ({
  default: vi.fn(() => { /* no-op */ })
}))

// Mock geoimport before every test
vi.mock('geoimport', () => {
  return {
    default: {
      init: vi.fn().mockResolvedValue(true),
    }
  };
});

// Mock ResizeObserver
globalThis.ResizeObserver = class {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {
    // Optionally call callback immediately
    this.callback([]);
  }
  unobserve() {}
  disconnect() {}
};
