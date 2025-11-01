import React from 'react';
import { Strategy } from '@/types';
import { formatUSD, formatPercentage } from '@/lib/utils/formatting';

interface ConfirmationModalProps {
  amount: string;
  tokenSymbol: string;
  strategy: Strategy;
  estimatedGas: string;
  isApproving: boolean;
  isStaking: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationModal({
  amount,
  tokenSymbol,
  strategy,
  estimatedGas,
  isApproving,
  isStaking,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  const isProcessing = isApproving || isStaking;

  return (
    <div className="vapor-modal-overlay" onClick={onCancel}>
      <div className="vapor-modal p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-vapor-text">Confirm Stake</h2>
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="text-vapor-text-secondary hover:text-vapor-text disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-4 mb-6">
          {/* Amount */}
          <div className="vapor-card vapor-card-compact bg-vapor-background-secondary">
            <div className="flex items-center justify-between">
              <span className="text-vapor-text-secondary">Amount</span>
              <div className="text-right">
                <div className="font-semibold text-vapor-text">
                  {amount} {tokenSymbol}
                </div>
                <div className="text-sm text-vapor-text-secondary">
                  ≈ {formatUSD(amount)}
                </div>
              </div>
            </div>
          </div>

          {/* Strategy */}
          <div className="vapor-card vapor-card-compact bg-vapor-background-secondary">
            <div className="flex items-center justify-between">
              <span className="text-vapor-text-secondary">Strategy</span>
              <div className="text-right">
                <div className="font-semibold text-vapor-text">{strategy.name}</div>
                <div className="text-sm text-vapor-primary">
                  {formatPercentage(strategy.apy)} APY
                </div>
              </div>
            </div>
          </div>

          {/* Gas Fee */}
          <div className="vapor-card vapor-card-compact bg-vapor-background-secondary">
            <div className="flex items-center justify-between">
              <span className="text-vapor-text-secondary">Estimated Gas</span>
              <div className="font-semibold text-vapor-text">{estimatedGas} ETH</div>
            </div>
          </div>
        </div>

        {/* Processing State */}
        {isProcessing && (
          <div className="mb-4 p-3 bg-vapor-primary bg-opacity-10 rounded-lg">
            <div className="flex items-center gap-2 text-vapor-primary">
              <span className="vapor-spinner w-4 h-4" />
              <span className="text-sm font-medium">
                {isApproving ? 'Approving token...' : 'Processing stake...'}
              </span>
            </div>
            <p className="text-xs text-vapor-text-secondary mt-1">
              Please confirm the transaction in your wallet
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="flex-1 vapor-button vapor-button-secondary"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className="flex-1 vapor-button vapor-button-primary"
          >
            {isApproving ? 'Approving...' : isStaking ? 'Staking...' : 'Confirm Stake'}
          </button>
        </div>

        <p className="text-xs text-vapor-text-secondary text-center mt-4">
          By confirming, you agree to stake your tokens according to the selected strategy.
        </p>
      </div>
    </div>
  );
}
