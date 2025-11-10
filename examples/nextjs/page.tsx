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
    console.log('🎉 Stake successful!', transaction);
    console.log('Transaction Hash:', transaction.hash);
    console.log('Amount Staked:', transaction.amount, transaction.token);
    console.log('Strategy:', transaction.strategy);
    console.log('Referral Fee Earned:', transaction.referralFee);

    // You can update your database, show notification, etc.
    // Example: Call your API to save the transaction
    // fetch('/api/save-transaction', {
    //   method: 'POST',
    //   body: JSON.stringify(transaction)
    // });
  };

  const handleError = (error: WidgetError) => {
    console.error('❌ Staking failed:', error);
    console.error('Error Code:', error.code);
    console.error('Error Message:', error.message);

    // Handle specific error codes
    if (error.code === 'INSUFFICIENT_BALANCE') {
      alert('You do not have enough tokens to stake.');
    } else if (error.code === 'TRANSACTION_REJECTED') {
      alert('You rejected the transaction.');
    } else {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">
          Stake Your USDC
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-8">
          Earn competitive yields on your stablecoin holdings
        </p>

        <VaporStakingWidget
          // Get your API key from: https://partner.vaporfund.com/signup
          // Format: vf_test_xxxxx (testnet) or vf_live_xxxxx (mainnet)
          apiKey={process.env.NEXT_PUBLIC_VAPOR_API_KEY || 'vf_test_xxxxx'}

          // Optional: Add your referral code to earn 0.25-0.50% revenue share
          // Referral tracking is automatic - no additional code needed!
          referralCode={process.env.NEXT_PUBLIC_VAPOR_REFERRAL_CODE}

          theme="dark"
          defaultToken="USDC"
          network="sepolia" // Use 'mainnet' for production

          // Optional: Custom branding to match your site
          customColors={{
            primary: '#6366f1',
            accent: '#8b5cf6',
            background: '#1a1a1a',
            text: '#ffffff',
          }}

          // Optional: Compact mode for smaller spaces
          // compact={true}

          onSuccess={handleSuccess}
          onError={handleError}
        />

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            🔒 Non-custodial • ✅ Audited • ⚡ Instant
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            Powered by{' '}
            <a
              href="https://vaporfund.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              VaporFund
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
