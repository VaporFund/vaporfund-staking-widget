import React from 'react';
import { truncateAddress } from '@/lib/utils/formatting';

interface WalletButtonProps {
  isConnected: boolean;
  isConnecting: boolean;
  address: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function WalletButton({
  isConnected,
  isConnecting,
  address,
  onConnect,
  onDisconnect,
}: WalletButtonProps) {
  if (isConnected && address) {
    return (
      <button
        onClick={onDisconnect}
        className="vapor-button vapor-button-secondary flex items-center gap-2"
      >
        <div className="w-2 h-2 bg-vapor-success rounded-full" />
        <span>{truncateAddress(address)}</span>
      </button>
    );
  }

  return (
    <button
      onClick={onConnect}
      disabled={isConnecting}
      className="vapor-button vapor-button-primary"
    >
      {isConnecting ? (
        <span className="flex items-center gap-2">
          <span className="vapor-spinner w-4 h-4" />
          Connecting...
        </span>
      ) : (
        'Connect Wallet'
      )}
    </button>
  );
}
