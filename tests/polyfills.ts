import { vi } from "vitest";

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

Object.assign(global, { Touch, TouchEvent });

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

class ResizeObserver {
  callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }

  observe(): void {
    // no-op for tests
  }

  unobserve(): void {
    // no-op for tests
  }

  disconnect(): void {
    // no-op for tests
  }
}

Object.defineProperty(global, "ResizeObserver", {
  writable: true,
  value: ResizeObserver,
});
