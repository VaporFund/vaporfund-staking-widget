# VaporFund Staking Widget - Setup Guide

## Project Structure Created

```
src/widget/
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite build config (npm)
├── vite.config.cdn.ts        # Vite build config (CDN)
├── tailwind.config.js        # Tailwind CSS config
├── .eslintrc.json            # ESLint configuration
├── .prettierrc.json          # Prettier configuration
├── .gitignore                # Git ignore file
├── .env.example              # Environment variables template
├── LICENSE                   # MIT License
├── README.md                 # Main documentation
├── SRS.md                    # Software Requirements Spec
├── PROJECT_PLAN.md           # 8-week project plan
│
├── src/
│   ├── index.ts              # Main entry point
│   ├── dev.tsx               # Development app
│   │
│   ├── types/
│   │   └── index.ts          # TypeScript type definitions
│   │
│   ├── constants/
│   │   └── index.ts          # App constants
│   │
│   ├── styles/
│   │   └── index.css         # Global styles (Tailwind)
│   │
│   ├── lib/
│   │   ├── api/
│   │   │   └── client.ts     # API client
│   │   ├── web3/
│   │   │   ├── contracts.ts  # Smart contract interactions
│   │   │   └── provider.ts   # Web3 provider utilities
│   │   └── utils/
│   │       ├── validation.ts # Input validation
│   │       └── formatting.ts # Data formatting
│   │
│   ├── hooks/
│   │   ├── useWallet.ts      # Wallet connection hook
│   │   ├── useStaking.ts     # Staking operations hook
│   │   └── useTheme.ts       # Theme management hook
│   │
│   ├── components/
│   │   ├── VaporStakingWidget.tsx  # Main widget component
│   │   ├── WalletConnect/
│   │   │   └── WalletButton.tsx
│   │   ├── StakingForm/
│   │   │   ├── TokenInput.tsx
│   │   │   └── StrategySelector.tsx
│   │   └── TransactionModal/
│   │       ├── ConfirmationModal.tsx
│   │       └── StatusModal.tsx
│   │
│   └── test/
│       └── setup.ts          # Test setup
│
├── examples/
│   ├── react/
│   │   └── App.tsx           # React example
│   ├── nextjs/
│   │   └── page.tsx          # Next.js example
│   └── vanilla-js/
│       └── index.html        # Vanilla JS example
│
└── index.html                # Development HTML
```

## Prerequisites

- **Node.js** >= 18.0.0
- **Yarn** >= 1.22.0 (required - this project enforces Yarn)

### Installing Yarn

If you don't have Yarn installed:

```bash
# Via npm
npm install -g yarn

# Via Homebrew (macOS)
brew install yarn

# Verify installation
yarn --version
```

## Quick Start

### 1. Install Dependencies

> **Important:** This project uses Yarn as the package manager. Please do not use npm or pnpm.

```bash
cd src/widget

# Install dependencies with Yarn
yarn install

# If you don't have Yarn installed:
npm install -g yarn
```

### 2. Set Up Environment

```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
```env
VITE_VAPOR_API_KEY=pk_test_your_key_here
VITE_VAPOR_REFERRAL_CODE=your_code
VITE_NETWORK=sepolia
```

### 3. Start Development Server

```bash
yarn dev
```

Open http://localhost:5173 to see the widget in action!

### 4. Build for Production

```bash
# Build npm package
yarn build

# Build CDN bundle
yarn build:cdn
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `yarn dev` | Start development server |
| `yarn build` | Build npm package |
| `yarn build:cdn` | Build CDN bundle |
| `yarn preview` | Preview production build |
| `yarn test` | Run tests |
| `yarn test:ui` | Run tests with UI |
| `yarn test:e2e` | Run E2E tests |
| `yarn coverage` | Generate coverage report |
| `yarn lint` | Lint code |
| `yarn lint:fix` | Fix linting issues |
| `yarn typecheck` | Check TypeScript types |
| `yarn format` | Format code with Prettier |

## Features Implemented

### ✅ Core Features
- [x] React component library
- [x] TypeScript support
- [x] Wallet connection (MetaMask, WalletConnect)
- [x] USDC staking interface
- [x] Strategy selection
- [x] Light/Dark theme support
- [x] Custom color theming
- [x] Compact layout mode
- [x] Transaction confirmation flow
- [x] Success/Error handling
- [x] API integration
- [x] Web3 contract interactions

### ✅ Development Tools
- [x] Vite build system
- [x] ESLint + Prettier
- [x] Vitest testing setup
- [x] Tailwind CSS
- [x] Hot module replacement
- [x] TypeScript strict mode

### ✅ Examples
- [x] React integration example
- [x] Next.js integration example
- [x] Vanilla JS example
- [x] Development demo app

## Next Steps

### Phase 1 - Complete MVP (Remaining)

1. **Connect to Backend API**
   - Update API endpoints in `src/constants/index.ts`
   - Test strategy fetching
   - Implement referral tracking

2. **Test with Real Contracts**
   - Deploy to Sepolia testnet
   - Update contract addresses
   - Test full staking flow

3. **Testing**
   - Write unit tests for components
   - Add integration tests
   - E2E tests with Playwright

4. **Documentation**
   - Add inline code comments
   - Create integration guides
   - API reference documentation

5. **Publishing**
   - Publish to npm as `@vaporfund/staking-widget`
   - Deploy CDN bundle
   - Create GitHub release

### Phase 2 - Enhancements (Q1 2026)
- Multi-token support (ETH, USDT, DAI)
- Advanced yield strategies
- Transaction history
- Mobile SDK

### Phase 3 - Advanced Features (Q2 2026)
- NFT staking
- Governance participation
- Portfolio tracking
- Multi-language support

## Development Workflow

### Adding a New Component

1. Create component file in `src/components/`
2. Add TypeScript types
3. Style with Tailwind CSS classes
4. Export from component index
5. Write tests in `__tests__/` directory

### Adding a New Hook

1. Create hook file in `src/hooks/`
2. Define return type interface
3. Implement hook logic
4. Export from `src/index.ts`
5. Document usage in README

### Testing

```bash
# Run all tests
yarn test

# Run specific test file
yarn test useWallet.test.ts

# Watch mode
yarn test --watch

# Coverage
yarn coverage
```

## Troubleshooting

### Build Issues

If you encounter build errors:

```bash
# Clear cache
rm -rf node_modules dist .vite
yarn install
yarn build
```

### Type Errors

```bash
# Check types
yarn typecheck

# Generate types
yarn build
```

### Wallet Connection Issues

Make sure you have:
- MetaMask or another Web3 wallet installed
- Wallet is connected to the correct network (Mainnet or Sepolia)
- Account has sufficient ETH for gas fees

## Contributing

1. Create feature branch: `git checkout -b feat/amazing-feature`
2. Make changes and commit: `git commit -m 'feat(widget): add amazing feature'`
3. Run tests: `yarn test && yarn typecheck`
4. Push changes: `git push origin feat/amazing-feature`
5. Create Pull Request

## Support

- **Documentation**: https://docs.vaporfund.com/widget
- **Issues**: https://github.com/vaporfund/vaporfund-staking-platform/issues
- **Email**: partners@vaporfund.com

## Community

- **Discord**: https://discord.com/invite/qWXfwMz4pP
- **Twitter**: https://twitter.com/vaporfund
- **Telegram**: https://t.me/vaporfund_co

---

**Ready to build!** 🚀

Start development: `yarn dev`
Build for production: `yarn build`
Run tests: `yarn test`
