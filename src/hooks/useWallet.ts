import { useState, useEffect, useCallback } from 'react';
import { WalletState, ErrorCode, WidgetError } from '@/types';
import { getWeb3Provider, requestAccounts, getChainId, onAccountsChanged, onChainChanged, switchNetwork } from '@/lib/web3/provider';

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
  const { network = 'mainnet', autoConnect = false } = options;

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
      const provider = getWeb3Provider();
      if (!provider) {
        throw {
          code: ErrorCode.WALLET_NOT_CONNECTED,
          message: 'No Web3 wallet detected. Please install MetaMask or another Web3 wallet.',
        } as WidgetError;
      }

      const accounts = await requestAccounts();
      const chainId = await getChainId();

      setState({
        address: accounts[0],
        chainId,
        isConnected: true,
        isConnecting: false,
        error: null,
      });
    } catch (error: any) {
      const widgetError: WidgetError = {
        code: error.code || ErrorCode.UNKNOWN_ERROR,
        message: error.message || 'Failed to connect wallet',
      };

      setState((prev) => ({
        ...prev,
        isConnecting: false,
        error: widgetError.message,
      }));

      throw widgetError;
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
