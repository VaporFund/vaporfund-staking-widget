# VaporFund Staking Widget

[![npm version](https://img.shields.io/npm/v/@vaporfund/staking-widget.svg)](https://www.npmjs.com/package/@vaporfund/staking-widget)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/github/workflow/status/vaporfund/vaporfund-staking-platform/CI)](https://github.com/vaporfund/vaporfund-staking-platform/actions)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@vaporfund/staking-widget)](https://bundlephobia.com/package/@vaporfund/staking-widget)

> Embeddable crypto staking widget for any platform - add staking in 5 minutes with zero blockchain expertise required.

A lightweight React component that enables USDC staking directly from your website, wallet, or dApp. Perfect for platforms looking to offer DeFi staking features without building from scratch.

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Usage](#usage)
  - [React/Next.js](#reactnextjs)
  - [Vanilla JavaScript](#vanilla-javascript)
  - [WordPress](#wordpress)
  - [React Native](#react-native)
- [Configuration](#configuration)
- [Theming](#theming)
- [API Reference](#api-reference)
- [Examples](#examples)
- [Security](#security)
- [Browser Support](#browser-support)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## Features

- **🚀 Quick Integration** - Single line of code to add staking
- **🎨 Customizable Themes** - Light/dark modes with full color customization
- **💰 Referral Tracking** - Built-in partner revenue sharing
- **🔐 Secure** - Non-custodial, audited smart contracts
- **📱 Mobile Responsive** - Works on all devices
- **⚡ Lightweight** - ~45KB gzipped bundle
- **🔌 Multiple Integrations** - React, vanilla JS, WordPress, React Native
- **🌐 Multi-Wallet Support** - MetaMask, WalletConnect, Rainbow, Coinbase Wallet

## Quick Start

### React

```bash
npm install @vaporfund/staking-widget
```

```jsx
import { VaporStakingWidget } from '@vaporfund/staking-widget';

function App() {
  return (
    <VaporStakingWidget
      apiKey="pk_live_xxxxx"
      referralCode="your_code"
    />
  );
}
```

### Vanilla JavaScript

```html
<div id="vapor-staking"></div>
<script src="https://cdn.vaporfund.com/widget/v1.min.js"></script>
<script>
  VaporWidget.init({
    container: '#vapor-staking',
    apiKey: 'pk_live_xxxxx'
  });
</script>
```

[Get your API key →](https://partner.vaporfund.com/signup)

## Installation

### NPM

```bash
npm install @vaporfund/staking-widget
# or
yarn add @vaporfund/staking-widget
# or
pnpm add @vaporfund/staking-widget
```

### CDN

```html
<!-- Latest version -->
<script src="https://cdn.vaporfund.com/widget/v1.min.js"></script>

<!-- Specific version -->
<script src="https://cdn.vaporfund.com/widget/v1.0.0/vaporfund-widget.min.js"></script>
```

## Usage

### React/Next.js

```tsx
'use client'; // Next.js App Router

import { VaporStakingWidget } from '@vaporfund/staking-widget';

export default function StakingPage() {
  const handleSuccess = (tx) => {
    console.log('Stake successful!', tx);
  };

  return (
    <VaporStakingWidget
      apiKey={process.env.NEXT_PUBLIC_VAPOR_API_KEY}
      referralCode="partner_123"
      theme="dark"
      onSuccess={handleSuccess}
    />
  );
}
```

**Important for Next.js:** Disable SSR for the widget:

```tsx
import dynamic from 'next/dynamic';

const VaporStakingWidget = dynamic(
  () => import('@vaporfund/staking-widget').then(m => m.VaporStakingWidget),
  { ssr: false }
);
```

### Vanilla JavaScript

```html
<!DOCTYPE html>
<html>
<head>
  <title>Staking Demo</title>
</head>
<body>
  <div id="vapor-staking"></div>

  <script src="https://cdn.vaporfund.com/widget/v1.min.js"></script>
  <script>
    VaporWidget.init({
      container: '#vapor-staking',
      apiKey: 'pk_live_xxxxx',
      referralCode: 'partner_123',
      theme: 'auto',
      onSuccess: (tx) => console.log('Success!', tx),
      onError: (error) => console.error('Error:', error)
    });
  </script>
</body>
</html>
```

### WordPress

```php
// Add to your theme's functions.php
function vapor_staking_widget_shortcode($atts) {
    $atts = shortcode_atts(array(
        'api_key' => '',
        'theme' => 'auto',
        'referral_code' => ''
    ), $atts);

    wp_enqueue_script('vapor-widget', 'https://cdn.vaporfund.com/widget/v1.min.js');

    return sprintf(
        '<div class="vapor-staking-widget" data-api-key="%s" data-theme="%s" data-referral="%s"></div>',
        esc_attr($atts['api_key']),
        esc_attr($atts['theme']),
        esc_attr($atts['referral_code'])
    );
}
add_shortcode('vapor_staking', 'vapor_staking_widget_shortcode');
```

Usage: `[vapor_staking api_key="pk_live_xxxxx" referral_code="your_code"]`

### React Native

```jsx
import { WebView } from 'react-native-webview';

const StakingWidget = () => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.vaporfund.com/widget/v1.min.js"></script>
      </head>
      <body>
        <div id="vapor-staking"></div>
        <script>
          VaporWidget.init({
            container: '#vapor-staking',
            apiKey: '${process.env.VAPOR_API_KEY}',
            theme: 'dark'
          });
        </script>
      </body>
    </html>
  `;

  return <WebView source={{ html }} />;
};
```

## Configuration

### Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `apiKey` | `string` | - | ✅ | Your VaporFund API key |
| `referralCode` | `string` | - | - | Partner referral code for revenue sharing |
| `theme` | `'light' \| 'dark' \| 'auto'` | `'auto'` | - | Color theme |
| `defaultToken` | `string` | `'USDC'` | - | Pre-selected token |
| `defaultStrategy` | `string` | - | - | Pre-selected staking strategy |
| `network` | `'mainnet' \| 'sepolia'` | `'mainnet'` | - | Ethereum network |
| `compact` | `boolean` | `false` | - | Compact layout for small spaces |
| `customColors` | `object` | - | - | Custom color overrides |
| `locale` | `string` | `'en'` | - | Language (en only for now) |
| `onSuccess` | `(tx: Transaction) => void` | - | - | Success callback |
| `onError` | `(error: Error) => void` | - | - | Error callback |

### Example: Full Configuration

```jsx
<VaporStakingWidget
  apiKey="pk_live_xxxxx"
  referralCode="partner_123"
  theme="dark"
  compact={false}
  defaultToken="USDC"
  defaultStrategy="high_yield"
  network="mainnet"
  customColors={{
    primary: '#6366f1',
    background: '#1a1a1a',
    text: '#ffffff'
  }}
  onSuccess={(tx) => {
    console.log('Stake completed:', tx.hash);
    console.log('Amount:', tx.amount);
    console.log('Referral fee:', tx.referralFee);
  }}
  onError={(error) => {
    console.error('Staking failed:', error.message);
  }}
/>
```

## Theming

### Pre-built Themes

```jsx
<VaporStakingWidget theme="light" />  // Light mode
<VaporStakingWidget theme="dark" />   // Dark mode
<VaporStakingWidget theme="auto" />   // System preference
```

### Custom Colors

```jsx
<VaporStakingWidget
  customColors={{
    primary: '#6366f1',           // Primary brand color
    background: '#1a1a1a',        // Main background
    backgroundSecondary: '#2d2d2d', // Secondary backgrounds
    text: '#ffffff',              // Primary text
    textSecondary: '#a0a0a0',     // Secondary text
    accent: '#8b5cf6',            // Accent color
    success: '#10b981',           // Success states
    error: '#ef4444',             // Error states
    warning: '#f59e0b'            // Warning states
  }}
/>
```

### Compact Mode

For sidebars, modals, or mobile:

```jsx
<VaporStakingWidget compact={true} />
```

## API Reference

### Transaction Object

Returned in `onSuccess` callback:

```typescript
interface Transaction {
  hash: string;           // Blockchain transaction hash
  amount: string;         // Staked amount
  token: string;          // Token symbol (e.g., "USDC")
  strategy: string;       // Selected strategy
  timestamp: number;      // Unix timestamp
  referralFee: string;    // Partner fee earned
}
```

### Error Object

Returned in `onError` callback:

```typescript
interface WidgetError {
  code: string;          // Error code
  message: string;       // Human-readable message
  details?: any;         // Additional error details
}
```

### Common Error Codes

- `WALLET_NOT_CONNECTED` - User hasn't connected wallet
- `INSUFFICIENT_BALANCE` - Not enough tokens
- `AMOUNT_TOO_LOW` - Below minimum stake
- `AMOUNT_TOO_HIGH` - Above maximum stake
- `TRANSACTION_REJECTED` - User rejected transaction
- `NETWORK_ERROR` - RPC/network issue

## Examples

- [Live Demo](https://demo.vaporfund.com/widget)
- [CodeSandbox - React](https://codesandbox.io/s/vaporfund-widget-react-xxxxx)
- [CodePen - Vanilla JS](https://codepen.io/vaporfund/pen/xxxxx)
- [GitHub - Next.js Example](./examples/nextjs)
- [GitHub - WordPress Plugin](./examples/wordpress)

## Security

### Smart Contracts

- **Audited by:** [Audit Firm Name]
- **Mainnet:** [`0x089fa7705f6dea9ccc70c912029a0a442b2ced71`](https://etherscan.io/address/0x089fa7705f6dea9ccc70c912029a0a442b2ced71)
- **Sepolia:** [`0x508e7698c9fE9214b2aaF3Da5149849CbCBeE009`](https://sepolia.etherscan.io/address/0x508e7698c9fE9214b2aaF3Da5149849CbCBeE009)

### Widget Security

- ✅ No private keys stored or transmitted
- ✅ All transactions require user wallet approval
- ✅ HTTPS-only in production
- ✅ Input validation & sanitization
- ✅ Rate limiting & DDoS protection
- ✅ Non-custodial (users maintain full control)

### Reporting Vulnerabilities

Email: security@vaporfund.com

## Browser Support

| Browser | Version |
|---------|---------|
| Chrome | Last 2 versions |
| Firefox | Last 2 versions |
| Safari | Last 2 versions |
| Edge | Last 2 versions |
| iOS Safari | 14+ |
| Chrome Android | Latest |

**Bundle Size:** ~45KB (gzipped)
**Dependencies:** React, ethers.js, RainbowKit

## Development

### Setup

```bash
# Clone repository
git clone https://github.com/vaporfund/vaporfund-staking-platform.git
cd src/widget

# Install dependencies
yarn install

# Start development server
yarn dev
```

### Commands

```bash
yarn dev          # Start dev server (http://localhost:5173)
yarn build        # Build for production
yarn preview      # Preview production build
yarn test         # Run tests
yarn test:e2e     # Run E2E tests
yarn lint         # Lint code
yarn typecheck    # TypeScript checks
yarn coverage     # Test coverage report
```

### Project Structure

```
src/widget/
├── src/
│   ├── components/      # React components
│   ├── hooks/           # Custom hooks
│   ├── lib/             # Core libraries
│   ├── styles/          # CSS/styling
│   └── index.ts         # Entry point
├── examples/            # Integration examples
├── tests/               # Test files
├── docs/                # Documentation
├── package.json
└── README.md
```

### Testing

```bash
# Unit tests
yarn test

# E2E tests (requires local blockchain)
yarn test:e2e

# Coverage
yarn coverage
```

### Building

```bash
# Production build
yarn build

# Output: dist/
# - vaporfund-widget.min.js
# - vaporfund-widget.css
```

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Quick Guide

1. Fork the repository
2. Create feature branch (`git checkout -b feat/amazing-feature`)
3. Commit changes (`git commit -m 'feat(widget): add amazing feature'`)
4. Push to branch (`git push origin feat/amazing-feature`)
5. Open Pull Request

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(widget): add new feature
fix(widget): fix bug
docs(widget): update documentation
style(widget): code formatting
refactor(widget): code refactoring
test(widget): add tests
chore(widget): maintenance tasks
```

## Roadmap

### Phase 1 (MVP) - Current
- [x] Basic widget structure
- [ ] Wallet connection (WalletConnect, MetaMask)
- [ ] USDC staking
- [ ] Light/Dark themes
- [ ] Referral tracking
- [ ] Strategy selection

### Phase 2 - Q1 2026
- [ ] Multi-token support (USDT, DAI, ETH)
- [ ] Advanced strategies
- [ ] Transaction history
- [ ] Mobile SDK (iOS/Android)

### Phase 3 - Q2 2026
- [ ] NFT staking
- [ ] Governance participation
- [ ] Portfolio tracking
- [ ] Multi-language support

## Support

- **Documentation:** [docs.vaporfund.com/widget](https://docs.vaporfund.com/widget)
- **API Reference:** [staking-api.vaporfund.com/docs](https://staking-api.vaporfund.com/api/v1/docs)
- **Status Page:** [status.vaporfund.com](https://status.vaporfund.com)
- **Discord:** [discord.gg/vaporfund](https://discord.gg/vaporfund)
- **Email:** partners@vaporfund.com

## FAQ

**Is there a setup fee?**
No. Free to integrate, we charge a small protocol fee (0.5%) on transactions.

**Can I customize the appearance?**
Yes. Use `customColors` prop or choose from light/dark themes.

**What wallets are supported?**
All major wallets via WalletConnect: MetaMask, Rainbow, Coinbase Wallet, Trust Wallet, etc.

**Is this custodial?**
No. Users connect their own wallets. We never custody funds.

**How do referral fees work?**
You earn 0.25-0.50% of volume. Paid monthly in USDC (min $100).

See full [FAQ →](https://docs.vaporfund.com/widget/faq)

## License

[MIT](LICENSE) © VaporFund

---

**Ready to integrate?** [Get API Key →](https://partner.vaporfund.com/signup)

**Questions?** [Contact Us →](mailto:partners@vaporfund.com)
