import { useState, useEffect, useCallback } from 'react';
import { WalletState, ErrorCode, WidgetError } from '@/types';
import { getWeb3Provider, getWeb3ProviderAsync, requestAccounts, getChainId, onAccountsChanged, onChainChanged, switchNetwork } from '@/lib/web3/provider';

interface UseWalletOptions {
  network?: 'mainnet' | 'sepolia';
  autoConnect?: boolean;
}

interface UseWalletReturn extends WalletState {
  connect: () => Promise<void>;
  disconnect: () => void;
  switchToNetwork: (network: 'mainnet' | 'sepolia') => Promise<void>;
}

export function useWallet(options: UseWalletOptions = {}): UseWalletReturn {
  const { autoConnect = false } = options;

  const [state, setState] = useState<WalletState>({
    address: null,
    chainId: null,
    isConnected: false,
    isConnecting: false,
    error: null,
  });

  // Connect wallet
  const connect = useCallback(async () => {
    setState((prev) => ({ ...prev, isConnecting: true, error: null }));

    try {
      console.log('[VaporWidget] Starting wallet connection...');

      // Try to get provider, wait if needed
      let provider = getWeb3Provider();

      if (!provider) {
        console.log('[VaporWidget] Provider not immediately available, waiting...');
        // Wait for wallet extension to load
        await getWeb3ProviderAsync();
        provider = getWeb3Provider();
      }

      if (!provider) {
        const error = new Error('No Web3 wallet detected. Please install MetaMask or another Web3 wallet.') as any;
        error.code = ErrorCode.WALLET_NOT_CONNECTED;
        throw error;
      }

      console.log('[VaporWidget] Provider found, requesting accounts...');
      const accounts = await requestAccounts();

      console.log('[VaporWidget] Accounts received:', accounts.length);
      const chainId = await getChainId();
      console.log('[VaporWidget] Chain ID:', chainId);

      setState({
        address: accounts[0],
        chainId,
        isConnected: true,
        isConnecting: false,
        error: null,
      });

      console.log('[VaporWidget] Wallet connected successfully!');
    } catch (error: any) {
      console.error('[VaporWidget] Wallet connection failed:', error);

      let errorMessage = 'Failed to connect wallet';

      if (error.code === ErrorCode.WALLET_NOT_CONNECTED || error.message?.includes('No Web3 wallet')) {
        errorMessage = 'No Web3 wallet detected. Please install MetaMask or another Web3 wallet.';
      } else if (error.code === 4001) {
        errorMessage = 'Connection request rejected by user';
      } else if (error.message?.includes('User rejected')) {
        errorMessage = 'Connection request rejected by user';
      } else if (error.message) {
        errorMessage = error.message;
      }

      setState((prev) => ({
        ...prev,
        isConnecting: false,
        error: errorMessage,
      }));

      // Don't re-throw, just set error state
      // This prevents unhandled promise rejections
    }
  }, []);

  // Disconnect wallet
  const disconnect = useCallback(() => {
    setState({
      address: null,
      chainId: null,
      isConnected: false,
      isConnecting: false,
      error: null,
    });
  }, []);

  // Switch network
  const switchToNetwork = useCallback(async (targetNetwork: 'mainnet' | 'sepolia') => {
    try {
      await switchNetwork(targetNetwork);
      const chainId = await getChainId();
      setState((prev) => ({ ...prev, chainId }));
    } catch (error: any) {
      const widgetError: WidgetError = {
        code: ErrorCode.NETWORK_ERROR,
        message: `Failed to switch to ${targetNetwork}`,
      };
      throw widgetError;
    }
  }, []);

  // Listen for account changes
  useEffect(() => {
    const cleanup = onAccountsChanged((accounts) => {
      if (accounts.length === 0) {
        disconnect();
      } else {
        setState((prev) => ({ ...prev, address: accounts[0] }));
      }
    });

    return cleanup;
  }, [disconnect]);

  // Listen for chain changes
  useEffect(() => {
    const cleanup = onChainChanged((chainIdHex) => {
      const chainId = parseInt(chainIdHex, 16);
      setState((prev) => ({ ...prev, chainId }));
    });

    return cleanup;
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect) {
      connect().catch(() => {
        // Silently fail auto-connect
      });
    }
  }, [autoConnect, connect]);

  return {
    ...state,
    connect,
    disconnect,
    switchToNetwork,
  };
}
