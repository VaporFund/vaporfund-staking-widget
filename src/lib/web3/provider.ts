import { ethers } from 'ethers';
import { SUPPORTED_NETWORKS } from '@/constants';

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
