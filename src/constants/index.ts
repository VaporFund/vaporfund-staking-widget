// Network Configuration
export const SUPPORTED_NETWORKS = {
  mainnet: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/',
    blockExplorer: 'https://etherscan.io',
  },
  sepolia: {
    chainId: 11155111,
    name: 'Sepolia Testnet',
    rpcUrl: 'https://eth-sepolia.g.alchemy.com/v2/',
    blockExplorer: 'https://sepolia.etherscan.io',
  },
} as const;

// Contract Addresses
export const CONTRACT_ADDRESSES = {
  mainnet: '0x089fa7705f6dea9ccc70c912029a0a442b2ced71',
  sepolia: '0x508e7698c9fE9214b2aaF3Da5149849CbCBeE009',
} as const;

// API Configuration
export const API_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://staking-api.vaporfund.com/api/v1'
    : 'http://localhost:3001/api/v1';

export const API_ENDPOINTS = {
  STRATEGIES: '/strategies',
  TOKENS: '/tokens/whitelist',
  PREPARE_TRANSACTION: '/transactions/prepare',
  TRACK_REFERRAL: '/referrals/track',
} as const;

// Staking Configuration
export const STAKING_CONFIG = {
  MIN_STAKE_AMOUNT: '10', // $10 USD
  MAX_STAKE_AMOUNT: '100000', // $100,000 USD
  DEFAULT_TOKEN: 'USDC',
  GAS_LIMIT_BUFFER: 1.2, // 20% buffer on estimated gas
} as const;

// Theme Colors
export const DEFAULT_COLORS = {
  light: {
    primary: '#6366f1',
    background: '#ffffff',
    backgroundSecondary: '#f3f4f6',
    text: '#111827',
    textSecondary: '#6b7280',
    accent: '#8b5cf6',
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
  },
  dark: {
    primary: '#6366f1',
    background: '#1a1a1a',
    backgroundSecondary: '#2d2d2d',
    text: '#ffffff',
    textSecondary: '#a0a0a0',
    accent: '#8b5cf6',
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
  },
} as const;

// Timeouts and Delays
export const TIMEOUTS = {
  API_REQUEST: 10000, // 10 seconds
  TRANSACTION_CONFIRMATION: 300000, // 5 minutes
  WALLET_CONNECTION: 30000, // 30 seconds
} as const;

// Widget Version
export const WIDGET_VERSION = '0.1.0';

// Error Messages
export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: 'Please connect your wallet to continue',
  INSUFFICIENT_BALANCE: 'Insufficient token balance',
  AMOUNT_TOO_LOW: (min: string) => `Minimum stake amount is $${min}`,
  AMOUNT_TOO_HIGH: (max: string) => `Maximum stake amount is $${max}`,
  TRANSACTION_REJECTED: 'Transaction was rejected by user',
  NETWORK_ERROR: 'Network error. Please try again',
  INVALID_API_KEY: 'Invalid API key. Please check your configuration',
  INVALID_NETWORK: 'Please switch to the correct network',
  CONTRACT_ERROR: 'Smart contract error. Please try again',
  UNKNOWN_ERROR: 'An unexpected error occurred',
} as const;
