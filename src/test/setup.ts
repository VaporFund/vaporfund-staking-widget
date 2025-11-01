import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.ethereum for testing
global.window.ethereum = {
  request: async ({ method }: { method: string }) => {
    if (method === 'eth_requestAccounts') {
      return ['0x1234567890123456789012345678901234567890'];
    }
    return null;
  },
  on: () => {},
  removeListener: () => {},
};
