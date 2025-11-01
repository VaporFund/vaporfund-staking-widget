# Software Requirements Specification (SRS)
## VaporFund Staking Widget

**Version:** 1.0.0
**Date:** 2025-11-01
**Status:** Draft
**Authors:** VaporFund Engineering Team

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Overall Description](#2-overall-description)
3. [System Features and Requirements](#3-system-features-and-requirements)
4. [External Interface Requirements](#4-external-interface-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [Appendix](#6-appendix)

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) document describes the functional and non-functional requirements for the VaporFund Staking Widget - an embeddable Web3 component that enables USDC staking across third-party platforms.

The intended audience includes:
- Development team
- QA engineers
- Product managers
- Third-party integrators
- Security auditors

### 1.2 Scope

**Product Name:** VaporFund Staking Widget

**Description:** A lightweight, embeddable React component that allows end users to stake USDC tokens directly from partner websites, wallets, and applications without requiring blockchain development expertise from integrators.

**Goals:**
- Enable seamless staking integration for partners in under 5 minutes
- Provide non-custodial, secure staking functionality
- Support multiple integration methods (npm, CDN, framework-specific)
- Track referral conversions for partner revenue sharing
- Maintain high performance (<1s load time, <45KB bundle)

**Out of Scope for MVP:**
- Multi-token staking (ETH, USDT, DAI) - planned for Phase 2 (Q1 2026)
- NFT staking - planned for Phase 3 (Q2 2026)
- Governance features - planned for Phase 3 (Q2 2026)
- Multi-language support - planned for Phase 2 (Q1 2026)

### 1.3 Definitions, Acronyms, and Abbreviations

| Term | Definition |
|------|------------|
| **Widget** | Embeddable UI component for staking |
| **Integrator** | Third-party platform embedding the widget |
| **Staker** | End user performing staking actions |
| **API Key** | Authentication credential for widget usage |
| **Referral Code** | Partner identifier for revenue tracking |
| **TVL** | Total Value Locked in smart contracts |
| **DeFi** | Decentralized Finance |
| **Web3** | Decentralized web using blockchain |
| **ERC20** | Ethereum token standard |
| **USDC** | USD Coin stablecoin |
| **SSR** | Server-Side Rendering |
| **CDN** | Content Delivery Network |

### 1.4 References

- VaporFund Staking Smart Contract: `0x089fa7705f6dea9ccc70c912029a0a442b2ced71`
- VaporFund Backend API: `https://staking-api.vaporfund.com/api/v1`
- ERC20 Standard: https://eips.ethereum.org/EIPS/eip-20
- WalletConnect Protocol: https://docs.walletconnect.com/
- RainbowKit Documentation: https://www.rainbowkit.com/docs/introduction

---

## 2. Overall Description

### 2.1 Product Perspective

The VaporFund Staking Widget is a component of the larger VaporFund ecosystem:

```
┌─────────────────────────────────────────┐
│     Third-Party Platform (Integrator)   │
│  ┌───────────────────────────────────┐  │
│  │    VaporFund Staking Widget       │  │
│  │  ┌────────────────────────────┐   │  │
│  │  │   User Interface Layer     │   │  │
│  │  └────────────────────────────┘   │  │
│  │  ┌────────────────────────────┐   │  │
│  │  │   Web3 Connection Layer    │   │  │
│  │  └────────────────────────────┘   │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
                  ↓
    ┌─────────────────────────────┐
    │  VaporFund Backend API      │
    │  - Strategy metadata        │
    │  - Referral tracking        │
    │  - Analytics                │
    └─────────────────────────────┘
                  ↓
    ┌─────────────────────────────┐
    │  Ethereum Blockchain        │
    │  - Smart Contracts          │
    │  - Token transfers          │
    │  - Transaction records      │
    └─────────────────────────────┘
```

### 2.2 Product Functions

**Primary Functions:**
1. **Wallet Connection** - Connect user's Web3 wallet (MetaMask, WalletConnect, etc.)
2. **Token Staking** - Enable USDC deposits to VaporFund smart contract
3. **Strategy Selection** - Allow users to choose staking strategies
4. **Transaction Management** - Handle approvals, confirmations, and status tracking
5. **Referral Tracking** - Attribute stakes to partner referral codes
6. **Theme Customization** - Provide light/dark modes and custom branding

### 2.3 User Classes and Characteristics

#### User Class 1: Integrators (Partners)
- **Description:** Developers/platforms embedding the widget
- **Technical Expertise:** Moderate (basic web development)
- **Frequency of Use:** One-time integration, occasional updates
- **Key Needs:** Simple integration, customization, documentation

#### User Class 2: End Users (Stakers)
- **Description:** Crypto users staking tokens via partner platforms
- **Technical Expertise:** Basic (familiar with wallets)
- **Frequency of Use:** Occasional (staking operations)
- **Key Needs:** Clear UI, security, transaction transparency

#### User Class 3: Platform Administrators
- **Description:** VaporFund team managing widget and contracts
- **Technical Expertise:** High (blockchain development)
- **Frequency of Use:** Daily (monitoring, support)
- **Key Needs:** Analytics, error tracking, partner management

### 2.4 Operating Environment

**Client Environment:**
- Modern web browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari 14+, Chrome Android)
- JavaScript enabled
- Web3 wallet extension or mobile wallet app

**Server Environment:**
- VaporFund Backend API (NestJS on GKE)
- Ethereum Mainnet or Sepolia Testnet
- CDN for widget distribution

**Dependencies:**
- React 18+
- ethers.js v6
- RainbowKit (for wallet connections)
- wagmi (for Web3 hooks)

### 2.5 Design and Implementation Constraints

**Technical Constraints:**
- Bundle size must stay under 50KB (gzipped)
- Must work without SSR (client-side only)
- Must support React 18+
- Must be framework-agnostic via CDN version

**Business Constraints:**
- Must track referrals for revenue sharing
- Must comply with Web3 security best practices
- Must not custody user funds (non-custodial)

**Regulatory Constraints:**
- Must not store private keys
- Must provide transaction transparency
- Must comply with smart contract audits

### 2.6 Assumptions and Dependencies

**Assumptions:**
- Users have Web3 wallet installed and funded
- Users understand basic crypto concepts
- Integrators have obtained API key from VaporFund
- Ethereum network is operational
- RPC providers are available

**Dependencies:**
- VaporFund Backend API availability (99.9% SLA)
- VaporFund Smart Contract deployment
- Ethereum network uptime
- Third-party RPC providers (Infura, Alchemy)
- WalletConnect infrastructure

---

## 3. System Features and Requirements

### 3.1 Functional Requirements

#### FR-1: Wallet Connection

**FR-1.1** The widget SHALL support wallet connection via WalletConnect protocol
**FR-1.2** The widget SHALL support MetaMask browser extension
**FR-1.3** The widget SHALL display wallet address after successful connection
**FR-1.4** The widget SHALL allow users to disconnect their wallet
**FR-1.5** The widget SHALL detect and display the connected network (Mainnet/Sepolia)
**FR-1.6** The widget SHALL prompt users to switch networks if on wrong network

**Priority:** High
**Acceptance Criteria:**
- User can connect wallet in <5 seconds
- Connection persists across page refreshes
- Clear error messages for connection failures

---

#### FR-2: Token Staking

**FR-2.1** The widget SHALL allow users to enter USDC stake amount
**FR-2.2** The widget SHALL validate amount is ≥ minimum stake ($10)
**FR-2.3** The widget SHALL validate amount is ≤ maximum stake ($100,000)
**FR-2.4** The widget SHALL check user's USDC balance before proceeding
**FR-2.5** The widget SHALL request token approval if not already granted
**FR-2.6** The widget SHALL submit stake transaction to smart contract
**FR-2.7** The widget SHALL display transaction status (pending, success, failed)
**FR-2.8** The widget SHALL show transaction hash with Etherscan link

**Priority:** High
**Acceptance Criteria:**
- Full stake flow completes in <60 seconds
- Clear validation messages
- Transaction can be tracked on blockchain explorer

---

#### FR-3: Strategy Selection

**FR-3.1** The widget SHALL fetch available strategies from backend API
**FR-3.2** The widget SHALL display strategy options with descriptions
**FR-3.3** The widget SHALL allow users to select one strategy
**FR-3.4** The widget MAY pre-select a default strategy based on `defaultStrategy` prop
**FR-3.5** The widget SHALL include strategy ID in stake transaction

**Priority:** Medium
**Acceptance Criteria:**
- Strategies load within 2 seconds
- Strategy descriptions are clear and concise
- Selection is saved during session

---

#### FR-4: Referral Tracking

**FR-4.1** The widget SHALL accept `referralCode` as configuration parameter
**FR-4.2** The widget SHALL send referral code to backend API on stake
**FR-4.3** The widget SHALL include referral fee in success callback
**FR-4.4** The widget SHALL NOT require referral code (optional)

**Priority:** High
**Acceptance Criteria:**
- Referrals are tracked 100% of time when code provided
- Fee calculation is accurate
- Backend receives referral data

---

#### FR-5: Theme Customization

**FR-5.1** The widget SHALL support `light` theme
**FR-5.2** The widget SHALL support `dark` theme
**FR-5.3** The widget SHALL support `auto` theme (system preference)
**FR-5.4** The widget SHALL accept custom color overrides via `customColors` prop
**FR-5.5** The widget SHALL support `compact` layout mode

**Priority:** Medium
**Acceptance Criteria:**
- Themes apply correctly without flashing
- Custom colors override defaults
- Compact mode reduces size by 30%

---

#### FR-6: Error Handling

**FR-6.1** The widget SHALL display user-friendly error messages
**FR-6.2** The widget SHALL call `onError` callback with error details
**FR-6.3** The widget SHALL log errors to console in development mode
**FR-6.4** The widget SHALL handle network errors gracefully
**FR-6.5** The widget SHALL handle transaction rejections gracefully

**Priority:** High
**Acceptance Criteria:**
- No unhandled exceptions
- Error messages are actionable
- Errors don't break widget state

---

#### FR-7: Integration Methods

**FR-7.1** The widget SHALL be installable via npm/yarn
**FR-7.2** The widget SHALL be loadable via CDN script tag
**FR-7.3** The widget SHALL export React component for framework integration
**FR-7.4** The widget SHALL export vanilla JS API for non-React usage
**FR-7.5** The widget SHALL support TypeScript with type definitions

**Priority:** High
**Acceptance Criteria:**
- All integration methods documented
- TypeScript types are accurate
- No peer dependency warnings

---

### 3.2 User Stories

#### US-1: As an Integrator
**Story:** As a crypto wallet developer, I want to embed staking in my app so that users can earn yield without leaving my platform.

**Acceptance Criteria:**
- [ ] Can install widget via npm in <2 minutes
- [ ] Can customize colors to match brand
- [ ] Can track referral revenue in dashboard

---

#### US-2: As an End User
**Story:** As a USDC holder, I want to stake my tokens easily so that I can earn yield on my holdings.

**Acceptance Criteria:**
- [ ] Can connect wallet in <5 seconds
- [ ] Can complete stake in <60 seconds
- [ ] Can see clear transaction confirmation

---

#### US-3: As a Partner
**Story:** As a DeFi dashboard, I want to earn fees on stakes so that I can monetize my user base.

**Acceptance Criteria:**
- [ ] Referral code is tracked on every stake
- [ ] Can view revenue in partner dashboard
- [ ] Receive monthly payouts in USDC

---

### 3.3 API Integration Requirements

#### Backend API Endpoints

**Required Endpoints:**

1. **GET /strategies**
   - Returns available staking strategies
   - Response: `{ strategies: Array<Strategy> }`

2. **GET /tokens/whitelist**
   - Returns whitelisted tokens
   - Response: `{ tokens: Array<Token> }`

3. **POST /transactions/prepare**
   - Prepares staking transaction
   - Request: `{ token, amount, strategy, referralCode }`
   - Response: `{ transaction: PreparedTransaction }`

4. **POST /referrals/track**
   - Tracks referral conversion
   - Request: `{ referralCode, txHash, amount, fee }`
   - Response: `{ success: boolean }`

---

## 4. External Interface Requirements

### 4.1 User Interfaces

#### UI-1: Wallet Connection Screen
- **Purpose:** Connect user's Web3 wallet
- **Elements:**
  - "Connect Wallet" button
  - Wallet option list (MetaMask, WalletConnect, etc.)
  - Connection status indicator
- **Interactions:**
  - Click wallet option → Opens wallet connection modal
  - Successful connection → Shows wallet address

#### UI-2: Staking Input Screen
- **Purpose:** Enter stake amount and select strategy
- **Elements:**
  - Token selector (USDC default)
  - Amount input field
  - Balance display
  - Strategy selector
  - "Stake" button
- **Interactions:**
  - Type amount → Validates in real-time
  - Select strategy → Updates selection
  - Click "Stake" → Opens confirmation modal

#### UI-3: Transaction Confirmation Modal
- **Purpose:** Review and confirm stake transaction
- **Elements:**
  - Amount summary
  - Strategy details
  - Estimated gas fee
  - "Confirm" and "Cancel" buttons
- **Interactions:**
  - Click "Confirm" → Submits transaction
  - Click "Cancel" → Returns to input screen

#### UI-4: Transaction Status Screen
- **Purpose:** Show transaction progress
- **Elements:**
  - Status indicator (pending, success, failed)
  - Transaction hash
  - Etherscan link
  - "Done" button
- **Interactions:**
  - Click Etherscan link → Opens blockchain explorer
  - Click "Done" → Resets to input screen

### 4.2 Hardware Interfaces

**Not Applicable** - Widget runs entirely in web browsers

### 4.3 Software Interfaces

#### SI-1: Ethereum Blockchain
- **Interface Type:** JSON-RPC
- **Purpose:** Submit transactions, read contract state
- **Protocol:** HTTPS
- **Data Format:** JSON-RPC 2.0

#### SI-2: VaporFund Backend API
- **Interface Type:** REST API
- **Purpose:** Fetch strategies, track referrals
- **Protocol:** HTTPS
- **Authentication:** API Key (Bearer token)
- **Data Format:** JSON

#### SI-3: WalletConnect
- **Interface Type:** WebSocket
- **Purpose:** Connect mobile wallets
- **Protocol:** WSS
- **Version:** WalletConnect v2

#### SI-4: MetaMask
- **Interface Type:** Browser Extension API
- **Purpose:** Connect browser wallet
- **Protocol:** JavaScript window.ethereum

### 4.4 Communication Interfaces

#### Network Protocols
- **HTTPS** for API calls (TLS 1.2+)
- **WSS** for WebSocket connections
- **JSON-RPC** for blockchain interactions

#### Data Formats
- JSON for API requests/responses
- ABI-encoded data for smart contract calls

---

## 5. Non-Functional Requirements

### 5.1 Performance Requirements

**NFR-1.1** Widget SHALL load in <1 second on 3G connection
**NFR-1.2** Widget bundle size SHALL be <50KB (gzipped)
**NFR-1.3** API calls SHALL complete in <2 seconds (95th percentile)
**NFR-1.4** Widget SHALL support 100+ concurrent users per integrator
**NFR-1.5** Transaction submission SHALL complete in <5 seconds

### 5.2 Security Requirements

**NFR-2.1** Widget SHALL NOT store or transmit private keys
**NFR-2.2** Widget SHALL use HTTPS for all API calls in production
**NFR-2.3** Widget SHALL validate all user inputs
**NFR-2.4** Widget SHALL sanitize all displayed data (XSS prevention)
**NFR-2.5** Widget SHALL implement rate limiting (max 10 req/min per user)
**NFR-2.6** API keys SHALL be validated server-side

### 5.3 Reliability Requirements

**NFR-3.1** Widget SHALL handle network failures gracefully
**NFR-3.2** Widget SHALL retry failed API calls (max 3 attempts)
**NFR-3.3** Widget SHALL not crash on invalid props
**NFR-3.4** Widget SHALL maintain state during network interruptions
**NFR-3.5** Backend API SHALL have 99.9% uptime SLA

### 5.4 Usability Requirements

**NFR-4.1** Widget SHALL be usable by non-technical users
**NFR-4.2** Widget SHALL provide clear error messages
**NFR-4.3** Widget SHALL complete stake flow in ≤5 steps
**NFR-4.4** Widget SHALL be accessible (WCAG 2.1 AA)
**NFR-4.5** Widget SHALL support keyboard navigation

### 5.5 Maintainability Requirements

**NFR-5.1** Code SHALL follow ESLint/Prettier standards
**NFR-5.2** Code SHALL have >80% test coverage
**NFR-5.3** Code SHALL be written in TypeScript
**NFR-5.4** Components SHALL be modular and reusable
**NFR-5.5** Documentation SHALL be kept up-to-date

### 5.6 Portability Requirements

**NFR-6.1** Widget SHALL work on Chrome, Firefox, Safari, Edge (latest 2 versions)
**NFR-6.2** Widget SHALL work on iOS Safari 14+
**NFR-6.3** Widget SHALL work with React 18+
**NFR-6.4** Widget SHALL work without SSR
**NFR-6.5** Widget SHALL be embeddable in iframes (future)

---

## 6. Appendix

### 6.1 Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-11-01 | VaporFund Team | Initial draft |

### 6.2 Glossary

See section 1.3 for definitions.

### 6.3 Traceability Matrix

| Requirement ID | User Story | Test Case | Priority |
|----------------|------------|-----------|----------|
| FR-1.1 | US-2 | TC-001 | High |
| FR-2.1 | US-2 | TC-010 | High |
| FR-4.1 | US-3 | TC-020 | High |
| FR-5.1 | US-1 | TC-030 | Medium |

### 6.4 References

- Project Plan: [PROJECT_PLAN.md](./PROJECT_PLAN.md)
- Architecture: [ARCHITECTURE.md](./ARCHITECTURE.md)
- API Documentation: https://staking-api.vaporfund.com/api/v1/docs
