import React from 'react';
import { Transaction } from '@/types';
import { formatUSD, formatTxHash, formatDate } from '@/lib/utils/formatting';
import { SUPPORTED_NETWORKS } from '@/constants';

interface StatusModalProps {
  transaction: Transaction;
  network: 'mainnet' | 'sepolia';
  onClose: () => void;
}

export function StatusModal({ transaction, network, onClose }: StatusModalProps) {
  const explorerUrl = formatTxHash(transaction.hash, SUPPORTED_NETWORKS[network].blockExplorer);

  return (
    <div className="vapor-modal-overlay" onClick={onClose}>
      <div className="vapor-modal p-6" onClick={(e) => e.stopPropagation()}>
        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-vapor-success bg-opacity-10 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-vapor-success"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-vapor-text text-center mb-2">
          Stake Successful!
        </h2>
        <p className="text-vapor-text-secondary text-center mb-6">
          Your tokens have been staked successfully
        </p>

        {/* Transaction Details */}
        <div className="space-y-3 mb-6">
          <div className="vapor-card vapor-card-compact bg-vapor-background-secondary">
            <div className="flex items-center justify-between">
              <span className="text-vapor-text-secondary">Amount Staked</span>
              <div className="text-right">
                <div className="font-semibold text-vapor-text">
                  {transaction.amount} {transaction.token}
                </div>
                <div className="text-sm text-vapor-text-secondary">
                  ≈ {formatUSD(transaction.amount)}
                </div>
              </div>
            </div>
          </div>

          <div className="vapor-card vapor-card-compact bg-vapor-background-secondary">
            <div className="flex items-center justify-between">
              <span className="text-vapor-text-secondary">Strategy</span>
              <div className="font-semibold text-vapor-text">{transaction.strategy}</div>
            </div>
          </div>

          <div className="vapor-card vapor-card-compact bg-vapor-background-secondary">
            <div className="flex items-center justify-between">
              <span className="text-vapor-text-secondary">Date</span>
              <div className="font-semibold text-vapor-text">
                {formatDate(transaction.timestamp)}
              </div>
            </div>
          </div>

          {transaction.referralFee && parseFloat(transaction.referralFee) > 0 && (
            <div className="vapor-card vapor-card-compact bg-vapor-success bg-opacity-10">
              <div className="flex items-center justify-between">
                <span className="text-vapor-success">Referral Bonus</span>
                <div className="font-semibold text-vapor-success">
                  {formatUSD(transaction.referralFee)}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Transaction Hash */}
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full vapor-button vapor-button-outline mb-3 text-center"
        >
          <span className="flex items-center justify-center gap-2">
            View on Explorer
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </span>
        </a>

        <button onClick={onClose} className="w-full vapor-button vapor-button-primary">
          Done
        </button>
      </div>
    </div>
  );
}
