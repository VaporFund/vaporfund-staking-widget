import React from 'react';
import { formatNumber, formatUSD } from '@/lib/utils/formatting';

interface TokenInputProps {
  value: string;
  balance: string;
  tokenSymbol: string;
  error?: string;
  onChange: (value: string) => void;
  onMaxClick: () => void;
}

export function TokenInput({
  value,
  balance,
  tokenSymbol,
  error,
  onChange,
  onMaxClick,
}: TokenInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Allow only numbers and decimal point
    if (/^\d*\.?\d*$/.test(newValue)) {
      onChange(newValue);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-vapor-text-secondary">
        Amount to Stake
      </label>

      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="0.00"
          className={`vapor-input pr-20 text-lg ${error ? 'vapor-input-error' : ''}`}
        />

        <button
          onClick={onMaxClick}
          className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 text-sm font-medium text-vapor-primary hover:bg-vapor-primary hover:bg-opacity-10 rounded transition-colors"
        >
          MAX
        </button>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-vapor-text-secondary">
          Balance: {formatNumber(balance)} {tokenSymbol}
        </span>
        {value && !error && (
          <span className="text-vapor-text-secondary">
            ≈ {formatUSD(value)}
          </span>
        )}
      </div>

      {error && (
        <p className="text-sm text-vapor-error flex items-center gap-1">
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
