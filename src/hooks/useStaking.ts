import { useState, useCallback } from 'react';
import { Transaction, ErrorCode, WidgetError } from '@/types';
import { getWeb3Provider } from '@/lib/web3/provider';
import { getTokenBalance, getTokenAllowance, approveToken, stakeTokens, getTokenContract } from '@/lib/web3/contracts';
import { CONTRACT_ADDRESSES } from '@/constants';
import { validateStakeAmount } from '@/lib/utils/validation';
import ApiClient from '@/lib/api/client';

interface UseStakingOptions {
  network: 'mainnet' | 'sepolia';
  apiKey: string;
  referralCode?: string;
  onSuccess?: (tx: Transaction) => void;
  onError?: (error: WidgetError) => void;
}

interface StakeParams {
  tokenAddress: string;
  amount: string;
  strategy: string;
}

interface UseStakingReturn {
  isStaking: boolean;
  isApproving: boolean;
  needsApproval: (tokenAddress: string, amount: string, userAddress: string) => Promise<boolean>;
  approve: (tokenAddress: string, amount: string) => Promise<void>;
  stake: (params: StakeParams) => Promise<Transaction>;
  getBalance: (tokenAddress: string, userAddress: string) => Promise<string>;
}

export function useStaking(options: UseStakingOptions): UseStakingReturn {
  const { network, apiKey, referralCode, onSuccess, onError } = options;

  const [isStaking, setIsStaking] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [apiClient] = useState(() => new ApiClient(apiKey));

  // Get user's token balance
  const getBalance = useCallback(
    async (tokenAddress: string, userAddress: string): Promise<string> => {
      try {
        const provider = getWeb3Provider();
        if (!provider) {
          throw {
            code: ErrorCode.WALLET_NOT_CONNECTED,
            message: 'Wallet not connected',
          } as WidgetError;
        }

        return await getTokenBalance(tokenAddress, userAddress, provider, network);
      } catch (error: any) {
        const widgetError: WidgetError = {
          code: ErrorCode.CONTRACT_ERROR,
          message: error.message || 'Failed to fetch balance',
        };
        onError?.(widgetError);
        throw widgetError;
      }
    },
    [network, onError]
  );

  // Check if approval is needed
  const needsApproval = useCallback(
    async (tokenAddress: string, amount: string, userAddress: string): Promise<boolean> => {
      try {
        const provider = getWeb3Provider();
        if (!provider) return true;

        const spenderAddress = CONTRACT_ADDRESSES[network];
        const allowance = await getTokenAllowance(
          tokenAddress,
          userAddress,
          spenderAddress,
          provider,
          network
        );

        return parseFloat(allowance) < parseFloat(amount);
      } catch (error) {
        // If we can't check, assume approval is needed
        return true;
      }
    },
    [network]
  );

  // Approve token spending
  const approve = useCallback(
    async (tokenAddress: string, amount: string): Promise<void> => {
      setIsApproving(true);

      try {
        const provider = getWeb3Provider();
        if (!provider) {
          throw {
            code: ErrorCode.WALLET_NOT_CONNECTED,
            message: 'Wallet not connected',
          } as WidgetError;
        }

        const signer = await provider.getSigner();
        const spenderAddress = CONTRACT_ADDRESSES[network];

        await approveToken(tokenAddress, spenderAddress, amount, signer);
      } catch (error: any) {
        const widgetError: WidgetError = {
          code: error.code === 'ACTION_REJECTED' ? ErrorCode.TRANSACTION_REJECTED : ErrorCode.CONTRACT_ERROR,
          message: error.message || 'Failed to approve token',
        };
        onError?.(widgetError);
        throw widgetError;
      } finally {
        setIsApproving(false);
      }
    },
    [network, onError]
  );

  // Stake tokens
  const stake = useCallback(
    async (params: StakeParams): Promise<Transaction> => {
      const { tokenAddress, amount, strategy } = params;
      setIsStaking(true);

      try {
        const provider = getWeb3Provider();
        if (!provider) {
          throw {
            code: ErrorCode.WALLET_NOT_CONNECTED,
            message: 'Wallet not connected',
          } as WidgetError;
        }

        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();

        // Validate amount
        const balance = await getBalance(tokenAddress, userAddress);
        const validationError = validateStakeAmount(amount, balance);
        if (validationError) {
          throw validationError;
        }

        // Check and request approval if needed
        const needsApprovalCheck = await needsApproval(tokenAddress, amount, userAddress);
        if (needsApprovalCheck) {
          await approve(tokenAddress, amount);
        }

        // Execute stake transaction
        const receipt = await stakeTokens(tokenAddress, amount, network, signer);

        // Create transaction object
        const transaction: Transaction = {
          hash: receipt.hash,
          amount,
          token: await (await getTokenContract(tokenAddress, provider)).symbol(),
          strategy,
          timestamp: Math.floor(Date.now() / 1000),
          referralFee: '0', // Will be calculated by backend
        };

        // Track referral if provided
        if (referralCode) {
          try {
            await apiClient.trackReferral({
              referralCode,
              txHash: receipt.hash,
              amount,
              fee: '0', // Backend will calculate the actual fee
            });
            console.log('Referral tracked successfully:', referralCode);
          } catch (error) {
            // Log error but don't fail the transaction
            console.warn('Failed to track referral:', error);
          }
        }

        onSuccess?.(transaction);
        return transaction;
      } catch (error: any) {
        const widgetError: WidgetError = {
          code: error.code || ErrorCode.CONTRACT_ERROR,
          message: error.message || 'Failed to stake tokens',
          details: error,
        };
        onError?.(widgetError);
        throw widgetError;
      } finally {
        setIsStaking(false);
      }
    },
    [network, apiKey, referralCode, onSuccess, onError, getBalance, needsApproval, approve, apiClient]
  );

  return {
    isStaking,
    isApproving,
    needsApproval,
    approve,
    stake,
    getBalance,
  };
}
