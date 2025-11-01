// Widget Configuration Types
export interface VaporWidgetConfig {
  apiKey: string;
  referralCode?: string;
  theme?: 'light' | 'dark' | 'auto';
  defaultToken?: string;
  defaultStrategy?: string;
  network?: 'mainnet' | 'sepolia';
  compact?: boolean;
  customColors?: CustomColors;
  locale?: string;
  onSuccess?: (transaction: Transaction) => void;
  onError?: (error: WidgetError) => void;
}

export interface CustomColors {
  primary?: string;
  background?: string;
  backgroundSecondary?: string;
  text?: string;
  textSecondary?: string;
  accent?: string;
  success?: string;
  error?: string;
  warning?: string;
}

// Transaction Types
export interface Transaction {
  hash: string;
  amount: string;
  token: string;
  strategy: string;
  timestamp: number;
  referralFee: string;
}

export interface PreparedTransaction {
  to: string;
  data: string;
  value: string;
  gasLimit?: string;
}

// Strategy Types
export interface Strategy {
  id: string;
  name: string;
  description: string;
  apy: string;
  minStake: string;
  maxStake: string;
  riskLevel: 'low' | 'medium' | 'high';
}

// Token Types
export interface Token {
  address: string;
  symbol: string;
  decimals: number;
  minDeposit: string;
  maxDeposit: string;
  isWhitelisted: boolean;
}

// Error Types
export interface WidgetError {
  code: ErrorCode;
  message: string;
  details?: unknown;
}

export enum ErrorCode {
  WALLET_NOT_CONNECTED = 'WALLET_NOT_CONNECTED',
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  AMOUNT_TOO_LOW = 'AMOUNT_TOO_LOW',
  AMOUNT_TOO_HIGH = 'AMOUNT_TOO_HIGH',
  TRANSACTION_REJECTED = 'TRANSACTION_REJECTED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  INVALID_API_KEY = 'INVALID_API_KEY',
  INVALID_NETWORK = 'INVALID_NETWORK',
  CONTRACT_ERROR = 'CONTRACT_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface StrategiesResponse {
  strategies: Strategy[];
}

export interface TokensResponse {
  tokens: Token[];
}

export interface ReferralTrackingRequest {
  referralCode: string;
  txHash: string;
  amount: string;
  fee: string;
}

// Wallet Types
export interface WalletState {
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

// Theme Types
export type ThemeMode = 'light' | 'dark';

export interface ThemeConfig {
  mode: ThemeMode;
  colors: Required<CustomColors>;
}
