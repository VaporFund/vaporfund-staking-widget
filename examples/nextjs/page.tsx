'use client';

import dynamic from 'next/dynamic';
import type { Transaction, WidgetError } from '@vaporfund/staking-widget';

// Disable SSR for the widget
const VaporStakingWidget = dynamic(
  () => import('@vaporfund/staking-widget').then((mod) => mod.VaporStakingWidget),
  { ssr: false }
);

export default function StakingPage() {
  const handleSuccess = (transaction: Transaction) => {
    console.log('Stake successful!', transaction);
  };

  const handleError = (error: WidgetError) => {
    console.error('Staking failed:', error);
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">
          Stake Your USDC
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Earn competitive yields on your stablecoin holdings
        </p>

        <VaporStakingWidget
          apiKey={process.env.NEXT_PUBLIC_VAPOR_API_KEY!}
          referralCode={process.env.NEXT_PUBLIC_VAPOR_REFERRAL_CODE}
          theme="dark"
          defaultToken="USDC"
          network="mainnet"
          customColors={{
            primary: '#6366f1',
            accent: '#8b5cf6',
          }}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </div>
    </div>
  );
}
