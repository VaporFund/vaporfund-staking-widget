// Mock Ethereum provider for testing
export const mockEthereum = {
  request: async ({ method, params }: { method: string; params?: any[] }) => {
    switch (method) {
      case 'eth_requestAccounts':
        return ['0x1234567890123456789012345678901234567890'];
      case 'eth_accounts':
        return ['0x1234567890123456789012345678901234567890'];
      case 'eth_chainId':
        return '0x1'; // Mainnet
      case 'wallet_switchEthereumChain':
        return null;
      case 'eth_getBalance':
        return '0x1000000000000000000'; // 1 ETH
      default:
        throw new Error(`Unsupported method: ${method}`);
    }
  },
  on: (event: string, handler: Function) => {
    // Store event handlers if needed
  },
  removeListener: (event: string, handler: Function) => {
    // Remove event handlers if needed
  },
  isMetaMask: true,
  selectedAddress: '0x1234567890123456789012345678901234567890',
};

// Mock contract for testing
export const mockContract = {
  getWhitelistedTokens: async () => [
    '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
  ],
  depositToken: async () => ({
    wait: async () => ({
      hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      blockNumber: 12345678,
      confirmations: 1,
    }),
  }),
  balanceOf: async () => BigInt('1000000000'), // 1000 USDC
  decimals: async () => 6,
  symbol: async () => 'USDC',
  approve: async () => ({
    wait: async () => ({
      hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      blockNumber: 12345677,
      confirmations: 1,
    }),
  }),
  allowance: async () => BigInt('1000000000'), // 1000 USDC
};
