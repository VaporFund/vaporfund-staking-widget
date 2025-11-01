import React, { useState, useEffect } from 'react';
import { VaporWidgetConfig, Strategy, Transaction } from '@/types';
import { useWallet } from '@/hooks/useWallet';
import { useStaking } from '@/hooks/useStaking';
import { useTheme } from '@/hooks/useTheme';
import { WalletButton } from './WalletConnect/WalletButton';
import { TokenInput } from './StakingForm/TokenInput';
import { StrategySelector } from './StakingForm/StrategySelector';
import { ConfirmationModal } from './TransactionModal/ConfirmationModal';
import { StatusModal } from './TransactionModal/StatusModal';
import ApiClient from '@/lib/api/client';
import '@/styles/index.css';

export function VaporStakingWidget(config: VaporWidgetConfig) {
  const {
    apiKey,
    referralCode,
    theme: themeProp,
    defaultToken = 'USDC',
    defaultStrategy,
    network = 'mainnet',
    compact = false,
    customColors,
    onSuccess,
    onError,
  } = config;

  // Hooks
  const { theme } = useTheme({ theme: themeProp, customColors });
  const wallet = useWallet({ network, autoConnect: false });
  const staking = useStaking({ network, apiKey, referralCode, onSuccess, onError });

  // State
  const [amount, setAmount] = useState('');
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<string>('');
  const [balance, setBalance] = useState('0');
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [completedTransaction, setCompletedTransaction] = useState<Transaction | null>(null);
  const [estimatedGas, setEstimatedGas] = useState('0.001');

  // API Client
  const [apiClient] = useState(() => new ApiClient(apiKey));

  // Load strategies on mount
  useEffect(() => {
    async function loadStrategies() {
      try {
        const data = await apiClient.getStrategies();
        setStrategies(data.strategies);

        // Set default strategy if provided or use first one
        if (defaultStrategy) {
          setSelectedStrategy(defaultStrategy);
        } else if (data.strategies.length > 0) {
          setSelectedStrategy(data.strategies[0].id);
        }
      } catch (err: any) {
        console.error('Failed to load strategies:', err);
        setError('Failed to load staking strategies');
      }
    }

    loadStrategies();
  }, [apiClient, defaultStrategy]);

  // Load balance when wallet connects
  useEffect(() => {
    if (wallet.isConnected && wallet.address) {
      // TODO: Get token address from API based on defaultToken
      const tokenAddress = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'; // USDC mainnet
      staking
        .getBalance(tokenAddress, wallet.address)
        .then(setBalance)
        .catch((err) => console.error('Failed to load balance:', err));
    }
  }, [wallet.isConnected, wallet.address, staking, defaultToken]);

  // Handlers
  const handleAmountChange = (value: string) => {
    setAmount(value);
    setError(null);
  };

  const handleMaxClick = () => {
    setAmount(balance);
    setError(null);
  };

  const handleStakeClick = () => {
    if (!amount || parseFloat(amount) === 0) {
      setError('Please enter an amount');
      return;
    }

    setShowConfirmation(true);
  };

  const handleConfirmStake = async () => {
    try {
      const tokenAddress = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'; // USDC
      const transaction = await staking.stake({
        tokenAddress,
        amount,
        strategy: selectedStrategy,
      });

      setShowConfirmation(false);
      setCompletedTransaction(transaction);
      setAmount(''); // Reset form
    } catch (err: any) {
      setError(err.message || 'Failed to stake tokens');
      setShowConfirmation(false);
    }
  };

  const selectedStrategyData = strategies.find((s) => s.id === selectedStrategy);

  return (
    <div className={`vapor-widget ${compact ? 'vapor-widget-compact' : ''}`} data-theme={theme}>
      <div className={`vapor-card ${compact ? 'vapor-card-compact' : 'vapor-card-default'}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-vapor-text">Stake {defaultToken}</h1>
          <WalletButton
            isConnected={wallet.isConnected}
            isConnecting={wallet.isConnecting}
            address={wallet.address}
            onConnect={wallet.connect}
            onDisconnect={wallet.disconnect}
          />
        </div>

        {/* About Vapor Staking */}
        <div className="mb-6 p-4 bg-vapor-background-secondary rounded-lg border border-vapor-primary/20">
          <div className="flex items-start justify-between mb-2">
            <h2 className="text-lg font-semibold text-vapor-text">About Vapor Staking</h2>
            <a
              href="https://staking.vaporfund.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-vapor-primary hover:underline font-medium"
            >
              Visit Platform →
            </a>
          </div>
          <p className="text-sm text-vapor-text-secondary leading-relaxed">
            Stake your tokens securely with VaporFund's decentralized platform. All deposits are automatically routed to a multi-signature wallet, ensuring maximum security for your assets. Choose from multiple strategies to optimize your staking rewards.
          </p>
        </div>

        {/* Wallet Not Connected State */}
        {!wallet.isConnected && (
          <div className="text-center py-8">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-vapor-text-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p className="text-vapor-text-secondary mb-4">
              Connect your wallet to start staking
            </p>
            <button onClick={wallet.connect} className="vapor-button vapor-button-primary">
              Connect Wallet
            </button>
          </div>
        )}

        {/* Staking Form */}
        {wallet.isConnected && (
          <div className="space-y-6">
            <TokenInput
              value={amount}
              balance={balance}
              tokenSymbol={defaultToken}
              error={error || undefined}
              onChange={handleAmountChange}
              onMaxClick={handleMaxClick}
            />

            {strategies.length > 0 && (
              <StrategySelector
                strategies={strategies}
                selected={selectedStrategy}
                onChange={setSelectedStrategy}
              />
            )}

            <button
              onClick={handleStakeClick}
              disabled={
                !amount ||
                parseFloat(amount) === 0 ||
                staking.isStaking ||
                staking.isApproving
              }
              className="w-full vapor-button vapor-button-primary text-lg py-3"
            >
              {staking.isApproving ? 'Approving...' : staking.isStaking ? 'Staking...' : 'Stake'}
            </button>
          </div>
        )}

        {/* Powered by VaporFund */}
        <div className="mt-6 pt-4 border-t border-vapor-background-secondary">
          <p className="text-xs text-vapor-text-secondary text-center">
            Powered by{' '}
            <a
              href="https://vaporfund.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-vapor-primary hover:underline"
            >
              VaporFund
            </a>
          </p>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && selectedStrategyData && (
        <ConfirmationModal
          amount={amount}
          tokenSymbol={defaultToken}
          strategy={selectedStrategyData}
          estimatedGas={estimatedGas}
          isApproving={staking.isApproving}
          isStaking={staking.isStaking}
          onConfirm={handleConfirmStake}
          onCancel={() => setShowConfirmation(false)}
        />
      )}

      {/* Success Modal */}
      {completedTransaction && (
        <StatusModal
          transaction={completedTransaction}
          network={network}
          onClose={() => setCompletedTransaction(null)}
        />
      )}
    </div>
  );
}
