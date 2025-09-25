// Browser-safe setup for Storybook tests
// No Node.js APIs like process.on() here
import { vi } from "vitest";

// Only browser-compatible polyfills and setup
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
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

// Touch events for mobile testing
class Touch {
  identifier: number;
  target: EventTarget;
  clientX: number;
  clientY: number;

  constructor(init: Partial<Touch>) {
    this.identifier = init.identifier ?? 0;
    this.target = init.target ?? new EventTarget();
    this.clientX = init.clientX ?? 0;
    this.clientY = init.clientY ?? 0;
  }
}

class TouchEvent extends UIEvent {
  touches: Touch[];
  targetTouches: Touch[];
  changedTouches: Touch[];

  constructor(type: string, init?: TouchEventInit) {
    super(type, init);
    this.touches = (init?.touches ?? []).map((t) => new Touch(t));
    this.targetTouches = (init?.targetTouches ?? []).map((t) => new Touch(t));
    this.changedTouches = (init?.changedTouches ?? []).map((t) => new Touch(t));
  }
}

Object.assign(globalThis, { Touch, TouchEvent });
