import React from 'react';
import ReactDOM from 'react-dom/client';
import { VaporStakingWidget } from './components/VaporStakingWidget';
import type { Transaction, WidgetError } from './types';

// Development demo app
function App() {
  const handleSuccess = (tx: Transaction) => {
    console.log('✅ Staking successful!', tx);
    alert(`Stake successful! TX: ${tx.hash}`);
  };

  const handleError = (error: WidgetError) => {
    console.error('❌ Staking error:', error);
    alert(`Error: ${error.message}`);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ maxWidth: '500px', width: '100%' }}>
        <VaporStakingWidget
          apiKey="pk_test_12345678901234567890123456789012"
          referralCode="dev_test"
          theme="auto"
          defaultToken="USDC"
          network="sepolia"
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
