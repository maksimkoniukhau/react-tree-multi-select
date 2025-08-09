import '@testing-library/jest-dom';

Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
  configurable: true,
  writable: true,
  value: jest.fn(),
});

class ResizeObserver {
  callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }

  observe() {
  }

  unobserve() {
  }

  disconnect() {
  }
}

global.ResizeObserver = ResizeObserver;
