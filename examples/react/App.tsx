import React from 'react';
import { VaporStakingWidget } from '@vaporfund/staking-widget';
import type { Transaction, WidgetError } from '@vaporfund/staking-widget';

function App() {
  const handleSuccess = (transaction: Transaction) => {
    console.log('Stake successful!', transaction);
    console.log('Transaction Hash:', transaction.hash);
    console.log('Amount Staked:', transaction.amount, transaction.token);
    console.log('Referral Fee:', transaction.referralFee);

    // Update your app state, show notification, etc.
    alert(`Successfully staked ${transaction.amount} ${transaction.token}!`);
  };

  const handleError = (error: WidgetError) => {
    console.error('Staking failed:', error);
    console.error('Error Code:', error.code);
    console.error('Error Message:', error.message);

    // Show error notification to user
    alert(`Error: ${error.message}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">
          Earn Yield on Your USDC
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Stake securely and earn competitive yields
        </p>

        <VaporStakingWidget
          // Get your API key from: https://partner.vaporfund.com/signup
          apiKey={process.env.REACT_APP_VAPOR_API_KEY || 'vf_test_xxxxx'}

          // Optional: Add your referral code to earn revenue share
          referralCode={process.env.REACT_APP_VAPOR_REFERRAL_CODE || 'partner_123'}

          theme="auto"
          defaultToken="USDC"
          network="sepolia" // Use 'mainnet' for production

          // Optional: Custom branding
          customColors={{
            primary: '#6366f1',
            accent: '#8b5cf6',
          }}

          onSuccess={handleSuccess}
          onError={handleError}
        />

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Powered by VaporFund • Non-custodial • Audited</p>
        </div>
      </div>
    </div>
  );
}

export default App;
