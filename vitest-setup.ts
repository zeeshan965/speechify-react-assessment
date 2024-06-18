import '@testing-library/jest-dom/vitest';

import { expect } from 'vitest';

type Matcher = {
  tagName: string;
  textContent: string;
};

expect.extend({
  toBeExpectedElement(received: HTMLElement, expected: Matcher) {
    return {
      pass:
        received.tagName === expected.tagName &&
        received.innerText.trim() === expected.textContent.trim(),
      message: () =>
        `Expected ${expected.tagName} with text content ${expected.textContent}, but received ${received.tagName} with text content ${received.textContent}`,
    };
  },
  toBeExpectedElements(received: HTMLElement[], expected: Matcher[]) {
    return {
      pass: received.every((el, index) => {
        const expectedElement = expected[index];
        return (
          el.tagName === expectedElement.tagName &&
          el.innerText.trim() === expectedElement.textContent.trim()
        );
      }),
      message: () =>
        `Expected ${expected
          .map((el) => `${el.tagName} with text content ${el.textContent}`)
          .join(", ")}, but received ${received
          .map((el) => `${el.tagName} with text content ${el.textContent}`)
          .join(", ")}`,
    };
  },
});

interface CustomMatchers<R = unknown> {
  toBeExpectedElement: (matcher: Matcher) => R;
  toBeExpectedElements: (matcher: Matcher[]) => R;
}

declare module "vitest" {
  interface Assertion<T = any> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
