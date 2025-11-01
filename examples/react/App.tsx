import React from 'react';
import { VaporStakingWidget } from '@vaporfund/staking-widget';
import type { Transaction, WidgetError } from '@vaporfund/staking-widget';

function App() {
  const handleSuccess = (transaction: Transaction) => {
    console.log('Stake successful!', transaction);
    // Update your app state, show notification, etc.
  };

  const handleError = (error: WidgetError) => {
    console.error('Staking failed:', error);
    // Show error notification to user
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Earn Yield on Your USDC
        </h1>

        <VaporStakingWidget
          apiKey={process.env.REACT_APP_VAPOR_API_KEY!}
          referralCode={process.env.REACT_APP_VAPOR_REFERRAL_CODE}
          theme="auto"
          defaultToken="USDC"
          network="mainnet"
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </div>
    </div>
  );
}

export default App;
