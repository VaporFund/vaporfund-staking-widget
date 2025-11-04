# VaporFund Staking Widget - Integration Guide

**Last Updated**: November 3, 2025
**Version**: 0.1.0

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Obtaining API Key](#obtaining-api-key)
3. [Installation Methods](#installation-methods)
4. [Quick Start Examples](#quick-start-examples)
5. [Configuration](#configuration)
6. [Production Checklist](#production-checklist)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)

---

## Getting Started

VaporFund Staking Widget allows you to add crypto staking functionality to your website in minutes. This guide will walk you through the integration process step by step.

### What You'll Need

- **API Key** (from VaporFund admin dashboard)
- **Node.js 18+** (for npm/yarn projects)
- **React 18+** (if using React integration)
- **Modern browser** with Web3 wallet (MetaMask, WalletConnect, etc.)

---

## Obtaining API Key

### Step 1: Contact VaporFund Team

Since the widget uses an authenticated API system, you need to request an API key from VaporFund:

**Contact:**
- Email: partners@vaporfund.com
- Discord: [discord.com/invite/qWXfwMz4pP](https://discord.com/invite/qWXfwMz4pP)
- Telegram: [t.me/vaporfund_co](https://t.me/vaporfund_co)

### Step 2: Provide Integration Details

When requesting an API key, provide:

1. **Website URL(s)** - Domain where widget will be used
   - Example: `https://yoursite.com`, `https://www.yoursite.com`

2. **Development URLs** (optional)
   - Example: `http://localhost:3000`, `http://localhost:5173`

3. **Environment**
   - `test` - For development/testing (Sepolia testnet)
   - `live` - For production (Ethereum mainnet)

4. **Expected Volume** (for rate limiting)
   - Example: "100 transactions/day"

5. **Referral Code** (optional)
   - For revenue sharing program

### Step 3: Receive Your API Key

You'll receive an API key in this format:

```
Test: vf_test_9U15TPLnRHZz-TRpNi8guy3RzeH6xJp0RdQhnabq
Live: vf_live_AbCdEf123456-XyZ789MnOpQrStUvWxYz012345
```

**Important:**
- Test keys work with Sepolia testnet only
- Live keys work with Ethereum mainnet only
- Never commit API keys to version control
- Keep your API keys secure

---

## Installation Methods

### Method 1: NPM/Yarn (React Projects)

**Best for:** React, Next.js, Create React App

```bash
# Using Yarn (recommended)
yarn add @vaporfund/staking-widget

# Using NPM
npm install @vaporfund/staking-widget

# Using PNPM
pnpm add @vaporfund/staking-widget
```

### Method 2: CDN (HTML/JavaScript)

**Best for:** Static websites, WordPress, simple integrations

```html
<script src="https://cdn.vaporfund.com/widget/v1.min.js"></script>
```

---

## Quick Start Examples

### React/Next.js

**1. Create Environment File**

Create `.env.local` in your project root:

```env
# VaporFund Widget Configuration
NEXT_PUBLIC_VAPOR_API_KEY="vf_test_9U15TPLnRHZz-TRpNi8guy3RzeH6xJp0RdQhnabq"
NEXT_PUBLIC_VAPOR_REFERRAL_CODE="your_referral_code"
NEXT_PUBLIC_VAPOR_NETWORK="sepolia"  # or "mainnet"
```

**2. Import and Use Widget**

```tsx
'use client'; // Next.js App Router only

import { VaporStakingWidget } from '@vaporfund/staking-widget';
import '@vaporfund/staking-widget/styles.css';

export default function StakingPage() {
  return (
    <div className="container mx-auto py-8">
      <VaporStakingWidget
        apiKey={process.env.NEXT_PUBLIC_VAPOR_API_KEY}
        referralCode={process.env.NEXT_PUBLIC_VAPOR_REFERRAL_CODE}
        network={process.env.NEXT_PUBLIC_VAPOR_NETWORK || 'mainnet'}
        theme="dark"
        onSuccess={(tx) => {
          console.log('Staking successful!', tx);
          // Track conversion, show success message, etc.
        }}
        onError={(error) => {
          console.error('Staking failed:', error);
          // Show error message to user
        }}
      />
    </div>
  );
}
```

**3. Next.js: Disable SSR (Important!)**

```tsx
import dynamic from 'next/dynamic';

const VaporStakingWidget = dynamic(
  () => import('@vaporfund/staking-widget').then(m => m.VaporStakingWidget),
  { ssr: false }
);

export default function StakingPage() {
  return (
    <VaporStakingWidget
      apiKey={process.env.NEXT_PUBLIC_VAPOR_API_KEY}
      network="sepolia"
    />
  );
}
```

### Vanilla JavaScript / HTML

**Complete Example:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Staking Demo</title>
  <style>
    body {
      max-width: 600px;
      margin: 50px auto;
      padding: 20px;
      font-family: system-ui, -apple-system, sans-serif;
    }
  </style>
</head>
<body>
  <h1>Stake Your Crypto</h1>

  <!-- Widget Container -->
  <div id="vapor-staking-widget"></div>

  <!-- Load Widget Script -->
  <script src="https://cdn.vaporfund.com/widget/v1.min.js"></script>

  <script>
    // Initialize Widget
    VaporWidget.init({
      container: '#vapor-staking-widget',
      apiKey: 'vf_test_9U15TPLnRHZz-TRpNi8guy3RzeH6xJp0RdQhnabq',
      referralCode: 'partner_123',
      network: 'sepolia',
      theme: 'auto', // 'light', 'dark', or 'auto'
      onSuccess: function(tx) {
        console.log('Stake successful!', tx);
        alert('Staking successful! Tx: ' + tx.hash);
      },
      onError: function(error) {
        console.error('Stake failed:', error);
        alert('Staking failed: ' + error.message);
      }
    });
  </script>
</body>
</html>
```

### WordPress

**1. Install via Functions.php**

Add to your theme's `functions.php`:

```php
<?php
// Add VaporFund Staking Widget
function vapor_staking_widget_shortcode($atts) {
    // Parse shortcode attributes
    $atts = shortcode_atts(array(
        'api_key' => 'vf_test_xxxxx',
        'referral_code' => '',
        'theme' => 'auto',
        'network' => 'mainnet'
    ), $atts);

    // Enqueue widget script
    wp_enqueue_script(
        'vapor-widget',
        'https://cdn.vaporfund.com/widget/v1.min.js',
        array(),
        '1.0.0',
        true
    );

    // Generate unique ID for this widget instance
    $widget_id = 'vapor-widget-' . uniqid();

    // Output widget HTML
    ob_start();
    ?>
    <div id="<?php echo esc_attr($widget_id); ?>"></div>
    <script>
    document.addEventListener('DOMContentLoaded', function() {
        VaporWidget.init({
            container: '#<?php echo esc_js($widget_id); ?>',
            apiKey: '<?php echo esc_js($atts['api_key']); ?>',
            referralCode: '<?php echo esc_js($atts['referral_code']); ?>',
            theme: '<?php echo esc_js($atts['theme']); ?>',
            network: '<?php echo esc_js($atts['network']); ?>'
        });
    });
    </script>
    <?php
    return ob_get_clean();
}
add_shortcode('vapor_staking', 'vapor_staking_widget_shortcode');
?>
```

**2. Use Shortcode in Posts/Pages**

```
[vapor_staking api_key="vf_test_xxxxx" referral_code="your_code" theme="dark"]
```

---

## Configuration

### Required Configuration

| Property | Type | Description |
|----------|------|-------------|
| `apiKey` | `string` | Your VaporFund API key (required) |

### Optional Configuration

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `referralCode` | `string` | `undefined` | Your referral code for revenue sharing |
| `network` | `'mainnet' \| 'sepolia'` | `'mainnet'` | Ethereum network to use |
| `theme` | `'light' \| 'dark' \| 'auto'` | `'auto'` | Widget color theme |
| `defaultToken` | `string` | `'USDC'` | Pre-selected token symbol |
| `compact` | `boolean` | `false` | Use compact layout |
| `customColors` | `object` | `{}` | Override theme colors |
| `onSuccess` | `function` | `undefined` | Transaction success callback |
| `onError` | `function` | `undefined` | Error callback |

### Custom Colors

```typescript
customColors={{
  primary: '#6366f1',           // Main accent color
  background: '#ffffff',        // Widget background
  backgroundSecondary: '#f3f4f6', // Secondary surfaces
  text: '#111827',              // Primary text
  textSecondary: '#6b7280',     // Secondary text
  accent: '#8b5cf6',            // Accent elements
  success: '#10b981',           // Success messages
  error: '#ef4444',             // Error messages
  warning: '#f59e0b'            // Warning messages
}}
```

---

## Production Checklist

Before going live, ensure you:

### 1. API Key Setup

- [ ] Requested production API key (`vf_live_xxxxx`)
- [ ] Added production domain to API key whitelist
- [ ] Stored API key in environment variables (not in code)
- [ ] Set `network="mainnet"` for production

### 2. Security

- [ ] API key stored securely (environment variables)
- [ ] HTTPS enabled on your website
- [ ] API key not committed to Git
- [ ] Domain whitelist configured correctly

### 3. Testing

- [ ] Tested on Sepolia testnet first
- [ ] Verified wallet connection works
- [ ] Confirmed transaction flow completes
- [ ] Tested on mobile devices
- [ ] Checked all supported wallets (MetaMask, WalletConnect, etc.)

### 4. User Experience

- [ ] Success/error callbacks implemented
- [ ] Loading states handled
- [ ] Theme matches your website
- [ ] Widget is responsive on mobile
- [ ] Clear call-to-action for users

### 5. Monitoring

- [ ] Transaction success rate tracked
- [ ] Error logs configured
- [ ] Analytics events set up (if using)
- [ ] Referral tracking working (if applicable)

---

## Testing

### Testing on Sepolia Testnet

**1. Get Test Tokens**

Before testing, you need test USDC on Sepolia:

- **Sepolia ETH**: [sepoliafaucet.com](https://sepoliafaucet.com/)
- **Circle USDC Faucet**: [faucet.circle.com](https://faucet.circle.com/)

**2. Configure for Testing**

```jsx
<VaporStakingWidget
  apiKey="vf_test_9U15TPLnRHZz-TRpNi8guy3RzeH6xJp0RdQhnabq"
  network="sepolia"  // Important!
  theme="dark"
/>
```

**3. Connect Wallet**

- Switch MetaMask to Sepolia network
- Connect wallet to widget
- Verify balance shows correctly

**4. Test Staking Flow**

1. Enter amount (min 101 USDC)
2. Enter target APY (max 20%)
3. Set staking period (minimum varies by APY)
4. Click "Start Staking"
5. Approve token (first time only)
6. Confirm staking transaction

**5. Verify Transaction**

Check transaction on Sepolia Etherscan:
```
https://sepolia.etherscan.io/tx/{transaction_hash}
```

### Test Checklist

- [ ] Widget loads without errors
- [ ] Wallet connection successful
- [ ] Balance displays correctly
- [ ] Amount validation works (min/max)
- [ ] APY validation works (0-20%)
- [ ] Lock period calculated correctly
- [ ] Token approval transaction works
- [ ] Staking transaction completes
- [ ] Success callback fires with transaction data
- [ ] Error handling works for rejections

---

## Troubleshooting

### Common Issues

#### 1. "Invalid API Key" Error

**Problem:** Widget shows "Invalid API key" message

**Solutions:**
- Verify API key is correct (copy-paste carefully)
- Check that API key environment matches network (test/live)
- Ensure API key is active (contact support if deactivated)
- Check if your domain is whitelisted

#### 2. "Origin not allowed" Error

**Problem:** CORS error in browser console

**Solutions:**
- Add your domain to API key whitelist
- For development, add `http://localhost:3000` (or your port)
- Check that origin header is sent correctly
- Contact support to update allowed origins

#### 3. Widget Not Loading

**Problem:** Widget container is empty

**Solutions:**
- Check browser console for errors
- Verify script/package is loaded correctly
- Ensure React version is 18+
- Try clearing browser cache
- Check network tab for failed requests

#### 4. "Insufficient Balance" Error

**Problem:** Shows insufficient balance despite having tokens

**Solutions:**
- Verify you're on correct network (mainnet vs sepolia)
- Check token contract address matches
- Ensure wallet is connected
- Try refreshing the page
- Check if token is whitelisted

#### 5. Transaction Fails

**Problem:** Transaction rejected or fails on-chain

**Solutions:**
- Ensure enough ETH for gas fees
- Check if staking contract has allowance
- Verify amount is within min/max limits
- Check network congestion (try higher gas)
- Review transaction error message

#### 6. Balance Shows Zero

**Problem:** Widget shows 0 balance despite having tokens

**Solutions:**
- Confirm wallet is on correct network
- Check if widget is configured for correct network
- Verify token address is correct
- Try disconnecting and reconnecting wallet
- Check Etherscan/Sepolia Etherscan to confirm balance

### Getting Help

If issues persist:

1. **Check Console Logs**
   - Open browser DevTools (F12)
   - Look for errors in Console tab
   - Check Network tab for failed requests

2. **Gather Information**
   - Error messages
   - Network (mainnet/sepolia)
   - Browser and version
   - Wallet type
   - Steps to reproduce

3. **Contact Support**
   - Email: partners@vaporfund.com
   - Discord: [discord.com/invite/qWXfwMz4pP](https://discord.com/invite/qWXfwMz4pP)
   - Include gathered information above

---

## API Endpoints

Widget communicates with these backend endpoints:

```
GET  /api/v1/widget/health              - Health check
GET  /api/v1/widget/strategies          - Get staking strategies
GET  /api/v1/widget/tokens              - Get whitelisted tokens
POST /api/v1/widget/prepare-transaction - Prepare stake transaction
POST /api/v1/widget/track-transaction   - Track completed transaction
```

**Authentication:** All requests include `X-Widget-API-Key` header

**Base URLs:**
- **Production:** `https://staking-api.vaporfund.com`
- **Development:** `http://localhost:3001` (when running backend locally)

---

## Rate Limits

API keys have rate limits based on your tier:

| Tier | Requests/Day | Requests/Hour |
|------|--------------|---------------|
| Test | 100,000 | 10,000 |
| Starter | 100,000 | 10,000 |
| Growth | 500,000 | 50,000 |
| Enterprise | Unlimited | Unlimited |

**Rate Limit Headers:**

```
X-RateLimit-Limit: 100000
X-RateLimit-Remaining: 99500
X-RateLimit-Reset: 1638360000
```

If you exceed rate limits:
- HTTP 429 response returned
- Widget shows error message
- Contact support to upgrade tier

---

## Advanced Features

### Referral Tracking

Earn revenue share by referring users:

```jsx
<VaporStakingWidget
  apiKey="vf_live_xxxxx"
  referralCode="partner_123"
  onSuccess={(tx) => {
    console.log('Referral fee earned:', tx.referralFee);
  }}
/>
```

**Revenue Share:**
- 0.25% - 0.50% of transaction volume
- Paid monthly in USDC
- Minimum payout: $100

### Event Tracking

Track widget analytics:

```jsx
<VaporStakingWidget
  apiKey="vf_live_xxxxx"
  onSuccess={(tx) => {
    // Track conversion
    gtag('event', 'stake_success', {
      amount: tx.amount,
      token: tx.token,
      transaction_hash: tx.hash
    });
  }}
  onError={(error) => {
    // Track errors
    gtag('event', 'stake_error', {
      error_code: error.code,
      error_message: error.message
    });
  }}
/>
```

### Multi-Language (Coming Soon)

```jsx
<VaporStakingWidget
  apiKey="vf_live_xxxxx"
  locale="th" // th, en, zh, ja, ko
/>
```

---

## Smart Contract Addresses

### Mainnet (Ethereum)

- **Staking Contract:** `0x089fa7705f6dea9ccc70c912029a0a442b2ced71`
- **USDC Token:** `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`
- **USDT Token:** `0xdAC17F958D2ee523a2206206994597C13D831ec7`
- **DAI Token:** `0x6B175474E89094C44Da98b954EedeAC495271d0F`

### Sepolia (Testnet)

- **Staking Contract:** `0x508e7698c9fE9214b2aaF3Da5149849CbCBeE009`
- **USDC Token (Primary):** `0x326A6B393DD01D8D3ACA188F2AdCee1cB23B3268`
- **USDC Token (Circle):** `0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238`

---

## Support & Resources

### Documentation

- **Widget API Reference:** [docs.vaporfund.com/widget/api](https://docs.vaporfund.com/widget/api)
- **Integration Examples:** [github.com/vaporfund/widget-examples](https://github.com/vaporfund/widget-examples)
- **Smart Contract Docs:** [docs.vaporfund.com/contracts](https://docs.vaporfund.com/contracts)

### Community

- **Discord:** [discord.com/invite/qWXfwMz4pP](https://discord.com/invite/qWXfwMz4pP)
- **Twitter:** [@vaporfund](https://twitter.com/vaporfund)
- **Telegram:** [t.me/vaporfund_co](https://t.me/vaporfund_co)

### Contact

- **Partners:** partners@vaporfund.com
- **Support:** support@vaporfund.com
- **Security:** security@vaporfund.com

---

**Ready to integrate?** Start with a test API key and deploy on Sepolia testnet first!

**Need help?** Join our [Discord community](https://discord.com/invite/qWXfwMz4pP) for live support.
