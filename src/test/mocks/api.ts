import { Strategy, Token } from '@/types';

export const mockStrategies: Strategy[] = [
  {
    id: 'conservative',
    name: 'Conservative Yield',
    description: 'Low-risk strategy with stable returns',
    apy: '5.5',
    minStake: '10',
    maxStake: '100000',
    riskLevel: 'low',
  },
  {
    id: 'balanced',
    name: 'Balanced Growth',
    description: 'Moderate risk with balanced returns',
    apy: '8.5',
    minStake: '10',
    maxStake: '100000',
    riskLevel: 'medium',
  },
  {
    id: 'aggressive',
    name: 'High Yield',
    description: 'Higher risk for maximum returns',
    apy: '12.5',
    minStake: '10',
    maxStake: '100000',
    riskLevel: 'high',
  },
];

export const mockTokens: Token[] = [
  {
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    symbol: 'USDC',
    decimals: 6,
    minDeposit: '10',
    maxDeposit: '100000',
    isWhitelisted: true,
  },
];

export const mockApiClient = {
  getStrategies: async () => ({ strategies: mockStrategies }),
  getTokens: async () => ({ tokens: mockTokens }),
  prepareTransaction: async () => ({
    to: '0x089fa7705f6dea9ccc70c912029a0a442b2ced71',
    data: '0x',
    value: '0',
    gasLimit: '100000',
  }),
  trackReferral: async () => {},
};
