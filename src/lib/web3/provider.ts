import { ethers } from 'ethers';
import { SUPPORTED_NETWORKS } from '@/constants';

/**
 * Wait for window.ethereum to be available
 * MetaMask and other extensions inject ethereum object asynchronously
 */
async function waitForEthereum(timeout: number = 3000): Promise<any> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Not in browser environment'));
      return;
    }

    // Check if already available
    if (window.ethereum) {
      console.log('[VaporWidget] window.ethereum already available');
      resolve(window.ethereum);
      return;
    }

    console.log('[VaporWidget] Waiting for window.ethereum...');

    let attempts = 0;
    const maxAttempts = timeout / 100;

    const interval = setInterval(() => {
      attempts++;

      if (window.ethereum) {
        console.log('[VaporWidget] window.ethereum detected after', attempts * 100, 'ms');
        clearInterval(interval);
        resolve(window.ethereum);
      } else if (attempts >= maxAttempts) {
        console.error('[VaporWidget] window.ethereum not found after', timeout, 'ms');
        clearInterval(interval);
        reject(new Error('No Web3 wallet detected'));
      }
    }, 100);

    // Also listen for ethereum#initialized event (EIP-1193)
    window.addEventListener('ethereum#initialized', () => {
      console.log('[VaporWidget] ethereum#initialized event fired');
      if (window.ethereum) {
        clearInterval(interval);
        resolve(window.ethereum);
      }
    }, { once: true });
  });
}

/**
 * Get Web3 provider from window.ethereum
 */
export function getWeb3Provider(): ethers.BrowserProvider | null {
  if (typeof window !== 'undefined' && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum);
  }
  return null;
}

/**
 * Get Web3 provider with retry logic
 * Waits for wallet extension to be ready
 */
export async function getWeb3ProviderAsync(): Promise<ethers.BrowserProvider> {
  const ethereum = await waitForEthereum();
  return new ethers.BrowserProvider(ethereum);
}

/**
 * Get RPC provider for a specific network
 */
export function getRpcProvider(network: 'mainnet' | 'sepolia'): ethers.JsonRpcProvider {
  const config = SUPPORTED_NETWORKS[network];
  return new ethers.JsonRpcProvider(config.rpcUrl);
}

/**
 * Request account access from wallet
 */
export async function requestAccounts(): Promise<string[]> {
  const provider = getWeb3Provider();
  if (!provider) {
    throw new Error('No Web3 provider found');
  }

  return await provider.send('eth_requestAccounts', []);
}

/**
 * Get current chain ID
 */
export async function getChainId(): Promise<number> {
  const provider = getWeb3Provider();
  if (!provider) {
    throw new Error('No Web3 provider found');
  }

  const network = await provider.getNetwork();
  return Number(network.chainId);
}

/**
 * Switch to specific network
 */
export async function switchNetwork(network: 'mainnet' | 'sepolia'): Promise<void> {
  const provider = getWeb3Provider();
  if (!provider) {
    throw new Error('No Web3 provider found');
  }

  const config = SUPPORTED_NETWORKS[network];
  const chainIdHex = `0x${config.chainId.toString(16)}`;

  try {
    await provider.send('wallet_switchEthereumChain', [{ chainId: chainIdHex }]);
  } catch (error: any) {
    // If network not added, try to add it
    if (error.code === 4902) {
      await provider.send('wallet_addEthereumChain', [
        {
          chainId: chainIdHex,
          chainName: config.name,
          rpcUrls: [config.rpcUrl],
          blockExplorerUrls: [config.blockExplorer],
        },
      ]);
    } else {
      throw error;
    }
  }
}

/**
 * Listen for account changes
 */
export function onAccountsChanged(callback: (accounts: string[]) => void): () => void {
  if (typeof window !== 'undefined' && window.ethereum) {
    window.ethereum.on('accountsChanged', callback);
    return () => window.ethereum?.removeListener('accountsChanged', callback);
  }
  return () => {};
}

/**
 * Listen for chain changes
 */
export function onChainChanged(callback: (chainId: string) => void): () => void {
  if (typeof window !== 'undefined' && window.ethereum) {
    window.ethereum.on('chainChanged', callback);
    return () => window.ethereum?.removeListener('chainChanged', callback);
  }
  return () => {};
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}
