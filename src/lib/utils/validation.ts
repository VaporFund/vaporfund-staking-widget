import { STAKING_CONFIG } from '@/constants';
import { ErrorCode, WidgetError } from '@/types';

/**
 * Validates stake amount
 */
export function validateStakeAmount(amount: string, balance: string): WidgetError | null {
  const numAmount = parseFloat(amount);
  const numBalance = parseFloat(balance);
  const min = parseFloat(STAKING_CONFIG.MIN_STAKE_AMOUNT);
  const max = parseFloat(STAKING_CONFIG.MAX_STAKE_AMOUNT);

  if (isNaN(numAmount) || numAmount <= 0) {
    return {
      code: ErrorCode.AMOUNT_TOO_LOW,
      message: 'Please enter a valid amount',
    };
  }

  if (numAmount < min) {
    return {
      code: ErrorCode.AMOUNT_TOO_LOW,
      message: `Minimum stake amount is $${min}`,
    };
  }

  if (numAmount > max) {
    return {
      code: ErrorCode.AMOUNT_TOO_HIGH,
      message: `Maximum stake amount is $${max}`,
    };
  }

  if (numAmount > numBalance) {
    return {
      code: ErrorCode.INSUFFICIENT_BALANCE,
      message: 'Insufficient balance',
    };
  }

  return null;
}

/**
 * Validates Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validates API key format
 */
export function isValidApiKey(apiKey: string): boolean {
  return /^pk_(live|test)_[a-zA-Z0-9]{32}$/.test(apiKey);
}

/**
 * Validates transaction hash
 */
export function isValidTxHash(hash: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(hash);
}

/**
 * Sanitizes user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}
