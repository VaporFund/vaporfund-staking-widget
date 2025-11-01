import React from 'react';
import { Strategy } from '@/types';
import { formatPercentage } from '@/lib/utils/formatting';

interface StrategySelectorProps {
  strategies: Strategy[];
  selected: string;
  onChange: (strategyId: string) => void;
}

export function StrategySelector({ strategies, selected, onChange }: StrategySelectorProps) {
  const getRiskColor = (risk: Strategy['riskLevel']) => {
    switch (risk) {
      case 'low':
        return 'text-vapor-success';
      case 'medium':
        return 'text-vapor-warning';
      case 'high':
        return 'text-vapor-error';
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-vapor-text-secondary">
        Staking Strategy
      </label>

      <div className="space-y-2">
        {strategies.map((strategy) => (
          <button
            key={strategy.id}
            onClick={() => onChange(strategy.id)}
            className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
              selected === strategy.id
                ? 'border-vapor-primary bg-vapor-primary bg-opacity-5'
                : 'border-vapor-background-secondary hover:border-vapor-primary hover:border-opacity-50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-vapor-text">{strategy.name}</h3>
                  <span className={`text-xs font-medium ${getRiskColor(strategy.riskLevel)}`}>
                    {strategy.riskLevel.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-vapor-text-secondary mt-1">
                  {strategy.description}
                </p>
              </div>

              <div className="text-right ml-4">
                <div className="text-lg font-bold text-vapor-primary">
                  {formatPercentage(strategy.apy)}
                </div>
                <div className="text-xs text-vapor-text-secondary">APY</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
