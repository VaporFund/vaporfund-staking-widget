import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES } from '@/constants';

// VaporFund Staking Contract ABI (minimal - only functions we need)
export const STAKING_CONTRACT_ABI = [
  // Read functions
  'function getWhitelistedTokens() view returns (address[])',
  'function tokenMinDeposit(address) view returns (uint256)',
  'function tokenMaxDeposit(address) view returns (uint256)',
  'function deposits(address, address) view returns (uint256)',

  // Write functions
  'function depositToken(address token, uint256 amount)',
  'function depositETH() payable',

  // Events
  'event TokenDeposited(address indexed user, address indexed token, uint256 amount, uint256 timestamp)',
] as const;

// ERC20 ABI (minimal)
export const ERC20_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
] as const;

/**
 * Get staking contract instance
 */
export function getStakingContract(
  network: 'mainnet' | 'sepolia',
  signerOrProvider: ethers.Signer | ethers.Provider
): ethers.Contract {
  const address = CONTRACT_ADDRESSES[network];
  return new ethers.Contract(address, STAKING_CONTRACT_ABI, signerOrProvider);
}

/**
 * Get ERC20 token contract instance
 */
export function getTokenContract(
  tokenAddress: string,
  signerOrProvider: ethers.Signer | ethers.Provider
): ethers.Contract {
  return new ethers.Contract(tokenAddress, ERC20_ABI, signerOrProvider);
}

/**
 * Check if token is whitelisted
 */
export async function isTokenWhitelisted(
  tokenAddress: string,
  network: 'mainnet' | 'sepolia',
  provider: ethers.Provider
): Promise<boolean> {
  const contract = getStakingContract(network, provider);
  const whitelisted = await contract.getWhitelistedTokens();
  return whitelisted.map((addr: string) => addr.toLowerCase()).includes(tokenAddress.toLowerCase());
}

/**
 * Get token balance
 */
export async function getTokenBalance(
  tokenAddress: string,
  userAddress: string,
  provider: ethers.Provider
): Promise<string> {
  const contract = getTokenContract(tokenAddress, provider);
  const balance = await contract.balanceOf(userAddress);
  const decimals = await contract.decimals();
  return ethers.formatUnits(balance, decimals);
}

/**
 * Get token allowance
 */
export async function getTokenAllowance(
  tokenAddress: string,
  userAddress: string,
  spenderAddress: string,
  provider: ethers.Provider
): Promise<string> {
  const contract = getTokenContract(tokenAddress, provider);
  const allowance = await contract.allowance(userAddress, spenderAddress);
  const decimals = await contract.decimals();
  return ethers.formatUnits(allowance, decimals);
}

/**
 * Approve token spending
 */
export async function approveToken(
  tokenAddress: string,
  spenderAddress: string,
  amount: string,
  signer: ethers.Signer
): Promise<ethers.TransactionReceipt> {
  const contract = getTokenContract(tokenAddress, signer);
  const decimals = await contract.decimals();
  const amountWei = ethers.parseUnits(amount, decimals);

  const tx = await contract.approve(spenderAddress, amountWei);
  return await tx.wait();
}

/**
 * Stake tokens
 */
export async function stakeTokens(
  tokenAddress: string,
  amount: string,
  network: 'mainnet' | 'sepolia',
  signer: ethers.Signer
): Promise<ethers.TransactionReceipt> {
  const contract = getStakingContract(network, signer);
  const tokenContract = getTokenContract(tokenAddress, signer);
  const decimals = await tokenContract.decimals();
  const amountWei = ethers.parseUnits(amount, decimals);

  const tx = await contract.depositToken(tokenAddress, amountWei);
  return await tx.wait();
}

/**
 * Estimate gas for staking
 */
export async function estimateStakeGas(
  tokenAddress: string,
  amount: string,
  network: 'mainnet' | 'sepolia',
  signer: ethers.Signer
): Promise<bigint> {
  const contract = getStakingContract(network, signer);
  const tokenContract = getTokenContract(tokenAddress, signer);
  const decimals = await tokenContract.decimals();
  const amountWei = ethers.parseUnits(amount, decimals);

  return await contract.depositToken.estimateGas(tokenAddress, amountWei);
}
