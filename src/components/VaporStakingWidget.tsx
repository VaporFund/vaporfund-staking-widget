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
  const [targetAPY, setTargetAPY] = useState(0);
  const [stakingDays, setStakingDays] = useState<number | null>(null);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<string>('');
  const [balance, setBalance] = useState('0');
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [completedTransaction, setCompletedTransaction] = useState<Transaction | null>(null);
  const [estimatedGas, setEstimatedGas] = useState('0.001');
  const [isAboutExpanded, setIsAboutExpanded] = useState(true);

  const maxAPY = 20; // Cap at 20% - matching frontend

  // API Client
  const [apiClient] = useState(() => new ApiClient(apiKey));

  // Load strategies on mount (optional - for future use)
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
        // Don't show error to user since strategies are not currently used in the UI
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

  // Calculate minimum lock days based on APY
  const getMinimumLockDays = (apy: number): number => {
    if (apy >= 30) return 365;  // 1 year for extreme APY (30%+)
    if (apy >= 25) return 180;  // 6 months for very high APY (25-30%)
    if (apy >= 20) return 90;   // 3 months for high APY (20-25%)
    if (apy >= 15) return 30;   // 1 month for medium-high APY (15-20%)
    if (apy >= 10) return 14;   // 2 weeks for medium APY (10-15%)
    if (apy >= 8) return 7;     // 1 week for low-medium APY (8-10%)
    return 1; // 1 day minimum for low APY (< 8%)
  };

  const minimumLockDays = getMinimumLockDays(targetAPY);

  // Auto-fill staking days when APY changes
  useEffect(() => {
    if (targetAPY > 0) {
      setStakingDays(minimumLockDays);
    } else {
      setStakingDays(null);
    }
  }, [targetAPY, minimumLockDays]);

  const calculateEarnings = () => {
    if (!amount || !stakingDays) return 0;
    return (parseFloat(amount) * targetAPY * stakingDays) / (365 * 100);
  };

  // Handlers
  const handleAmountChange = (value: string) => {
    const regex = /^\d*\.?\d*$/;
    if (regex.test(value) || value === '') {
      if (value !== '' && parseFloat(value) > 10000) {
        setAmount('10000');
        return;
      }
      setAmount(value);
    }
    setError(null);
  };

  const handleMaxClick = () => {
    const maxValue = parseFloat(balance) > 10000 ? '10000' : balance;
    setAmount(maxValue);
    setError(null);
  };

  const handleStakeClick = () => {
    if (!amount || parseFloat(amount) === 0) {
      setError('Please enter an amount');
      return;
    }

    if (parseFloat(amount) < 101) {
      setError('Minimum deposit is 101 ' + defaultToken);
      return;
    }

    if (parseFloat(amount) > 10000) {
      setError('Maximum deposit is 10,000 ' + defaultToken);
      return;
    }

    if (!targetAPY || targetAPY <= 0) {
      setError('Please enter target APY');
      return;
    }

    if (!stakingDays) {
      setError('Please enter staking period');
      return;
    }

    if (stakingDays < minimumLockDays) {
      setError(`Minimum staking period is ${minimumLockDays} days for ${targetAPY}% APY`);
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

        {/* About Vapor Staking - Collapsible */}
        <div className="mb-6 rounded-lg border border-vapor-primary/20 bg-vapor-background-secondary overflow-hidden">
          <button
            onClick={() => setIsAboutExpanded(!isAboutExpanded)}
            className="w-full p-4 flex items-center justify-between hover:bg-vapor-primary/5 transition-colors"
          >
            <h2 className="text-lg font-semibold text-vapor-text">About Vapor Staking</h2>
            <div className="flex items-center gap-2">
              <a
                href="https://staking.vaporfund.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-vapor-primary hover:underline font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                Visit Platform →
              </a>
              <svg
                className={`w-5 h-5 text-vapor-text transition-transform ${
                  isAboutExpanded ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </button>
          {isAboutExpanded && (
            <div className="px-4 pb-4">
              <p className="text-sm text-vapor-text-secondary leading-relaxed">
                Stake your tokens securely with VaporFund's decentralized platform. All deposits are automatically routed to a multi-signature wallet, ensuring maximum security for your assets. Choose from multiple strategies to optimize your staking rewards.
              </p>
            </div>
          )}
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
            {/* Amount Input */}
            <div>
              <label className="block text-sm font-medium text-vapor-text mb-2">
                Amount to Stake
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  placeholder="0.0"
                  className="w-full text-2xl font-bold text-center py-4 border-2 border-vapor-primary/20 rounded-xl focus:outline-none focus:border-vapor-primary bg-vapor-background text-vapor-text"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xl font-medium text-vapor-text-secondary">
                  {defaultToken}
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="text-sm text-vapor-text-secondary">
                  Available: {parseFloat(balance).toFixed(2)} {defaultToken}
                </div>
                <button
                  onClick={handleMaxClick}
                  className="text-sm text-vapor-primary hover:underline font-medium"
                >
                  MAX
                </button>
              </div>
              <div className="mt-2 text-center">
                <p className="text-xs text-vapor-text-secondary">
                  Minimum: 101 {defaultToken} • Maximum: 10,000 {defaultToken}
                </p>
              </div>
            </div>

            {/* APY Input */}
            <div>
              <label className="block text-sm font-medium text-vapor-text mb-2">
                Target APY (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={targetAPY || ''}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (e.target.value === '') {
                      setTargetAPY(0);
                    } else if (isNaN(value) || value < 0) {
                      setTargetAPY(0);
                    } else if (value > maxAPY) {
                      setTargetAPY(maxAPY);
                    } else {
                      setTargetAPY(value);
                    }
                  }}
                  min="0"
                  max={maxAPY}
                  step="0.1"
                  placeholder={`Enter APY (0-${maxAPY}%)`}
                  className="w-full text-2xl font-bold text-center py-4 border-2 border-vapor-primary/20 rounded-xl focus:outline-none focus:border-vapor-primary bg-vapor-background text-vapor-text"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xl font-medium text-vapor-text-secondary">
                  %
                </div>
              </div>
              <div className="text-sm text-vapor-text-secondary mt-2 text-center">
                Maximum APY: <span className="font-medium text-vapor-primary">{maxAPY}%</span>
              </div>

              {/* Lock Period Info based on APY */}
              {targetAPY > 0 && minimumLockDays > 1 && (
                <div className="mt-3 p-3 rounded-lg border border-vapor-primary/20 bg-vapor-background-secondary">
                  <p className="text-sm text-vapor-text">
                    <strong>Minimum Lock Period:</strong> {minimumLockDays} days
                  </p>
                  <p className="text-xs text-vapor-text-secondary mt-1">
                    {targetAPY >= 20 ? 'High APY requires longer lock period' :
                     targetAPY >= 10 ? 'Medium APY requires moderate lock period' :
                     'Standard lock period applies'}
                  </p>
                </div>
              )}
            </div>

            {/* Staking Days Input */}
            <div>
              <label className="block text-sm font-medium text-vapor-text mb-2">
                Staking Period (Days)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={stakingDays === null ? '' : stakingDays}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (inputValue === '') {
                      setStakingDays(null);
                      return;
                    }
                    const value = parseInt(inputValue);
                    if (!isNaN(value) && value >= minimumLockDays) {
                      setStakingDays(value);
                    }
                  }}
                  min={minimumLockDays}
                  step="1"
                  placeholder="Enter days"
                  className="w-full text-2xl font-bold text-center py-4 border-2 border-vapor-primary/20 rounded-xl focus:outline-none focus:border-vapor-primary bg-vapor-background text-vapor-text"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xl font-medium text-vapor-text-secondary">
                  days
                </div>
              </div>
              <div className="text-sm text-vapor-text-secondary mt-2 text-center">
                Minimum: {minimumLockDays} {minimumLockDays === 1 ? 'day' : 'days'}
              </div>
            </div>

            {/* Earnings Preview */}
            {amount && stakingDays && targetAPY > 0 && (
              <div className="p-4 rounded-xl border border-vapor-primary/20 bg-gradient-to-r from-vapor-primary/10 to-vapor-primary/5">
                <div className="text-center">
                  <div className="text-sm text-vapor-text-secondary mb-1">Expected Earnings</div>
                  <div className="text-2xl font-bold text-vapor-primary">
                    +{calculateEarnings().toFixed(2)} {defaultToken}
                  </div>
                  <div className="text-xs text-vapor-text-secondary">
                    At {targetAPY}% APY for {stakingDays} days
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              onClick={handleStakeClick}
              disabled={
                !amount ||
                parseFloat(amount) === 0 ||
                parseFloat(amount) < 101 ||
                parseFloat(amount) > 10000 ||
                !targetAPY ||
                !stakingDays ||
                stakingDays < minimumLockDays ||
                staking.isStaking ||
                staking.isApproving
              }
              className="w-full vapor-button vapor-button-primary text-lg py-3"
            >
              {staking.isApproving ? 'Approving...' : staking.isStaking ? 'Staking...' : 'Start Staking'}
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
