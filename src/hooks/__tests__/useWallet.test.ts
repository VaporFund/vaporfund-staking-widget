import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useWallet } from '../useWallet';
import { mockEthereum } from '@/test/mocks/ethereum';

// Mock window.ethereum
global.window.ethereum = mockEthereum;

describe('useWallet', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with disconnected state', () => {
    const { result } = renderHook(() => useWallet());

    expect(result.current.address).toBeNull();
    expect(result.current.chainId).toBeNull();
    expect(result.current.isConnected).toBe(false);
    expect(result.current.isConnecting).toBe(false);
  });

  it('should connect wallet successfully', async () => {
    const { result } = renderHook(() => useWallet());

    await act(async () => {
      await result.current.connect();
    });

    await waitFor(() => {
      expect(result.current.isConnected).toBe(true);
      expect(result.current.address).toBe('0x1234567890123456789012345678901234567890');
      expect(result.current.chainId).toBe(1); // Mainnet
    });
  });

  it('should handle connection error', async () => {
    const errorEthereum = {
      ...mockEthereum,
      request: vi.fn().mockRejectedValue(new Error('User rejected')),
    };
    global.window.ethereum = errorEthereum;

    const { result } = renderHook(() => useWallet());

    await act(async () => {
      try {
        await result.current.connect();
      } catch (error: any) {
        expect(error.message).toContain('User rejected');
      }
    });

    expect(result.current.isConnected).toBe(false);
  });

  it('should disconnect wallet', async () => {
    const { result } = renderHook(() => useWallet());

    // First connect
    await act(async () => {
      await result.current.connect();
    });

    await waitFor(() => {
      expect(result.current.isConnected).toBe(true);
    });

    // Then disconnect
    act(() => {
      result.current.disconnect();
    });

    expect(result.current.isConnected).toBe(false);
    expect(result.current.address).toBeNull();
    expect(result.current.chainId).toBeNull();
  });

  it('should auto-connect when enabled', async () => {
    const { result } = renderHook(() => useWallet({ autoConnect: true }));

    await waitFor(() => {
      expect(result.current.isConnected).toBe(true);
    }, { timeout: 2000 });
  });

  it('should handle network switching', async () => {
    // Mock successful network switch
    const switchEthereum = {
      ...mockEthereum,
      request: vi.fn().mockImplementation(async ({ method }) => {
        if (method === 'eth_requestAccounts') {
          return ['0x1234567890123456789012345678901234567890'];
        }
        if (method === 'eth_chainId') {
          return '0xaa36a7'; // Sepolia
        }
        if (method === 'wallet_switchEthereumChain') {
          return null;
        }
        return null;
      }),
    };
    global.window.ethereum = switchEthereum;

    const { result } = renderHook(() => useWallet());

    await act(async () => {
      await result.current.connect();
    });

    await act(async () => {
      await result.current.switchToNetwork('sepolia');
    });

    // Chain ID should be updated after switch
    await waitFor(() => {
      expect(result.current.chainId).toBe(11155111); // Sepolia chain ID
    });
  });
});
