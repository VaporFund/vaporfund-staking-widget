# VaporFund Staking Widget - Testing Guide

**Version**: 0.1.0
**Last Updated**: November 3, 2025
**Testing Environment**: Sepolia Testnet

---

## 📋 Table of Contents

1. [Pre-requisites](#pre-requisites)
2. [Environment Setup](#environment-setup)
3. [Testing Workflow](#testing-workflow)
4. [Test Cases](#test-cases)
5. [Troubleshooting](#troubleshooting)
6. [Production Checklist](#production-checklist)

---

## 🎯 Pre-requisites

### Required Software

- [ ] **Node.js 18+** - [Download](https://nodejs.org/)
- [ ] **Yarn** - `npm install -g yarn`
- [ ] **MetaMask Browser Extension** - [Install](https://metamask.io/)
- [ ] **Modern Browser** - Chrome, Firefox, Brave, or Edge

### Required Accounts

- [ ] **MetaMask Wallet** - Already setup
- [ ] **Sepolia Testnet Added** - In MetaMask
- [ ] **Test API Key** - From VaporFund team

### Test Tokens (Sepolia)

- [ ] **Sepolia ETH** - For gas fees
- [ ] **Test USDC** - For staking

---

## 🔧 Environment Setup

### Step 1: Clone and Install

```bash
# Navigate to project
cd /path/to/vaporfund-staking-widget

# Install dependencies (if not done)
yarn install

# Build CDN version
yarn build:cdn
```

**Expected Output:**
```
✓ built in 2.79s
dist/cdn/vaporfund-widget.min.js  481.14 kB │ gzip: 163.87 kB
dist/cdn/style.css                 17.53 kB │ gzip:   3.86 kB
```

### Step 2: Start Test Server

```bash
# Start HTTP server
yarn serve:examples

# Server should start at:
# http://localhost:8080
```

**Verify Server:**
```bash
# In another terminal
curl http://localhost:8080/examples/

# Should return HTML content
```

### Step 3: Configure MetaMask

#### Add Sepolia Network (if not exists)

1. Open MetaMask
2. Click network dropdown
3. Click "Add Network"
4. Enter details:
   - **Network Name**: Sepolia
   - **RPC URL**: `https://sepolia.infura.io/v3/YOUR_KEY`
   - **Chain ID**: `11155111`
   - **Currency Symbol**: ETH
   - **Block Explorer**: `https://sepolia.etherscan.io`

5. Click "Save"

#### Switch to Sepolia

1. Click network dropdown
2. Select "Sepolia"
3. Verify you're on Sepolia (check network name in MetaMask)

### Step 4: Get Test Tokens

#### Get Sepolia ETH

**Method 1: Alchemy Faucet**
1. Go to: https://sepoliafaucet.com/
2. Sign in with Alchemy account
3. Enter your wallet address
4. Click "Send Me ETH"
5. Wait 1-2 minutes

**Method 2: Infura Faucet**
1. Go to: https://www.infura.io/faucet/sepolia
2. Enter wallet address
3. Complete captcha
4. Click "Receive ETH"

**Expected Amount:** 0.5 - 1 ETH

#### Get Test USDC

**Method 1: Circle Faucet** (Recommended)
1. Go to: https://faucet.circle.com/
2. Select "Sepolia" network
3. Connect wallet or paste address
4. Click "Get USDC"
5. Wait for transaction confirmation

**Method 2: Use Contract Directly**
```
Contract: 0x326A6B393DD01D8D3ACA188F2AdCee1cB23B3268
Symbol: USDC
Decimals: 6
```

Add to MetaMask:
1. Click "Import tokens"
2. Paste contract address
3. Token should auto-fill
4. Click "Add"

**Expected Amount:** 1,000 - 10,000 USDC

### Step 5: Verify Balance

Open MetaMask and check:
- [ ] Sepolia ETH balance > 0.1 ETH
- [ ] USDC balance > 100 USDC

---

## 🧪 Testing Workflow

### Phase 1: Wallet Detection Test

**Test File:** `http://localhost:8080/examples/test-wallet.html`

#### Test 1.1: Check window.ethereum

**Steps:**
1. Open `test-wallet.html`
2. Look at "Status" section

**Expected Results:**
```
✓ window.ethereum: Available (green)
✓ Wallet Type: MetaMask
✓ No errors in console
```

**❌ If Failed:**
- Error: "window.ethereum: Not Found"
- **Fix**: Install MetaMask
- **Fix**: Enable MetaMask extension
- **Fix**: Disable conflicting wallets (Zerion, Phantom)

#### Test 1.2: Manual Connection

**Steps:**
1. Click "Connect Wallet" button
2. MetaMask popup should appear
3. Click "Next" → "Connect"

**Expected Results:**
```
✓ Account shows your address (0x...)
✓ Chain ID shows: 11155111
✓ Connected status: Yes (green)
✓ No errors in console
```

**❌ If Failed:**
- Error: "User rejected"
- **Fix**: Click "Connect Wallet" again, accept in MetaMask

#### Test 1.3: Account Detection

**Steps:**
1. After connecting, check "Account" field
2. Should show your wallet address

**Expected Results:**
```
Account: 0x1234...5678
Connected: Yes
```

**✅ Phase 1 Complete** if all tests pass

---

### Phase 2: Widget Loading Test

**Test File:** `http://localhost:8080/examples/simple-cdn.html`

#### Test 2.1: Widget Initialization

**Steps:**
1. Open `simple-cdn.html`
2. Wait 2-3 seconds
3. Widget should appear

**Expected Results:**
```
✓ Widget container visible
✓ "Connect Wallet" button visible
✓ "About Vapor Staking" section visible
✓ No JavaScript errors in console
```

**Check Console for:**
```
[VaporWidget] Initialized successfully
Widget version: 0.1.0
```

**❌ If Failed:**
- Widget not showing
- **Fix**: Check console for errors
- **Fix**: Verify files exist in `dist/cdn/`
- **Fix**: Run `yarn build:cdn` again

#### Test 2.2: Connect Wallet in Widget

**Steps:**
1. Click "Connect Wallet" button in widget
2. MetaMask popup appears
3. Click "Connect"

**Expected Results:**
```
✓ Wallet connected
✓ Address displayed in header
✓ Balance loaded (shows USDC amount)
✓ Staking form appears
```

**Check Console for:**
```
[VaporWidget] Starting wallet connection...
[VaporWidget] Provider found, requesting accounts...
[VaporWidget] Accounts received: 1
[VaporWidget] Chain ID: 11155111
[VaporWidget] Wallet connected successfully!
```

**❌ If Failed:**
- Error: "No Web3 wallet detected"
- **Fix**: MetaMask not installed
- **Fix**: Try refreshing page

#### Test 2.3: Balance Loading

**Steps:**
1. After wallet connected
2. Wait 2-3 seconds
3. Balance should appear

**Expected Results:**
```
✓ Shows "Available: X USDC"
✓ X matches your MetaMask balance
✓ No errors
```

**Check Console for:**
```
Loading balance for token: { symbol: "USDC", address: "0x326A..." }
Token balance retrieved: { balance: "1000", decimals: 6 }
Balance loaded: 1000
```

**❌ If Failed:**
- Shows "Available: 0 USDC" but you have tokens
- **Fix**: Check if correct USDC contract (see troubleshooting)
- **Fix**: Verify backend API is running

**✅ Phase 2 Complete** if widget loads and connects

---

### Phase 3: Staking Form Test

**Test File:** Continue in `simple-cdn.html` (wallet connected)

#### Test 3.1: Amount Input Validation

**Test Case: Minimum Amount**

**Steps:**
1. Enter amount: `50`
2. Enter APY: `10`
3. Enter days: `7`
4. Click "Start Staking"

**Expected Results:**
```
❌ Error: "Minimum deposit is 101 USDC"
✓ Button disabled or error shown
```

**Test Case: Maximum Amount**

**Steps:**
1. Enter amount: `15000`
2. Enter APY: `10`
3. Enter days: `7`

**Expected Results:**
```
✓ Amount auto-corrects to 10000
✓ Shows max limit message
```

**Test Case: Valid Amount**

**Steps:**
1. Enter amount: `500`
2. Enter APY: `10`
3. Enter days: `14`

**Expected Results:**
```
✓ No errors
✓ Shows expected earnings calculation
✓ Button enabled
```

#### Test 3.2: APY Input Validation

**Test Case: APY Too High**

**Steps:**
1. Enter APY: `25`

**Expected Results:**
```
✓ Auto-corrects to 20 (max)
✓ Shows "Maximum APY: 20%"
```

**Test Case: APY Lock Period**

**Steps:**
1. Enter APY: `20`

**Expected Results:**
```
✓ Shows "Minimum Lock Period: 90 days"
✓ Auto-fills staking days to 90
```

**Test Different APY Tiers:**

| APY | Min Lock Days | Expected Behavior |
|-----|---------------|-------------------|
| 5% | 1 | ✓ Short lock allowed |
| 10% | 14 | ✓ 2 weeks minimum |
| 15% | 30 | ✓ 1 month minimum |
| 20% | 90 | ✓ 3 months minimum |

#### Test 3.3: Earnings Calculation

**Steps:**
1. Amount: `1000 USDC`
2. APY: `10%`
3. Days: `30`

**Expected Calculation:**
```
Earnings = (1000 × 10 × 30) / (365 × 100)
         = 8.22 USDC

✓ Shows "Expected Earnings: +8.22 USDC"
```

**Verify Formula:**
```javascript
earnings = (amount × apy × days) / (365 × 100)
```

#### Test 3.4: MAX Button

**Steps:**
1. Click "MAX" button

**Expected Results:**
```
✓ Fills amount with your balance
✓ If balance > 10000, fills with 10000
✓ No errors
```

**✅ Phase 3 Complete** if all validations work

---

### Phase 4: Wallet Connection Flow Test

#### Test 4.1: Disconnect and Reconnect

**Steps:**
1. In MetaMask: Disconnect from site
2. Widget should show "Connect Wallet" again
3. Click "Connect Wallet"
4. Reconnect in MetaMask

**Expected Results:**
```
✓ Widget detects disconnection
✓ Shows connect screen again
✓ Can reconnect successfully
✓ Balance reloads
```

#### Test 4.2: Account Change

**Steps:**
1. Connected to widget
2. In MetaMask: Switch account
3. Widget should update

**Expected Results:**
```
✓ Address updates in widget
✓ Balance updates for new account
✓ No errors
```

#### Test 4.3: Network Change

**Steps:**
1. Connected to Sepolia
2. In MetaMask: Switch to Mainnet
3. Switch back to Sepolia

**Expected Results:**
```
✓ Widget detects network change
✓ Updates accordingly
✓ May show network mismatch warning
```

**✅ Phase 4 Complete** if wallet events work

---

### Phase 5: API Integration Test

**Note:** Requires backend running on `http://localhost:3001`

#### Test 5.1: Health Check

**Steps:**
1. Open browser console
2. Run:

```javascript
fetch('http://localhost:3001/api/v1/widget/health', {
  headers: {
    'X-Widget-API-Key': 'vf_test_9U15TPLnRHZz-TRpNi8guy3RzeH6xJp0RdQhnabq',
    'Origin': 'http://localhost:8080'
  }
})
.then(r => r.json())
.then(console.log);
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "apiKeyName": "Test Development Key",
    "environment": "test",
    "rateLimit": 100000
  }
}
```

#### Test 5.2: Get Tokens

**Check Console for:**
```
GET http://localhost:3001/api/v1/widget/tokens
Status: 200

Response:
{
  "success": true,
  "data": {
    "tokens": [
      {
        "address": "0x326A6B393DD01D8D3ACA188F2AdCee1cB23B3268",
        "symbol": "USDC",
        "decimals": 6,
        ...
      }
    ]
  }
}
```

#### Test 5.3: Get Strategies

**Check Console for:**
```
GET http://localhost:3001/api/v1/widget/strategies
Status: 200

Response:
{
  "success": true,
  "data": {
    "strategies": [...]
  }
}
```

**❌ If API Tests Fail:**
- Backend not running
- **Fix**: Start backend with `yarn start:dev`
- Wrong API key
- **Fix**: Verify API key in `.env.local`
- CORS error
- **Fix**: Check allowed origins in backend

**✅ Phase 5 Complete** if API calls succeed

---

### Phase 6: End-to-End Staking Test

**⚠️ Important:** This requires deployed staking contract on Sepolia

#### Test 6.1: Full Staking Flow

**Steps:**

1. **Connect Wallet**
   ```
   ✓ Click "Connect Wallet"
   ✓ Approve in MetaMask
   ✓ Balance loads
   ```

2. **Enter Staking Details**
   ```
   Amount: 200 USDC
   APY: 10%
   Days: 14
   ```

3. **Review Values**
   ```
   ✓ Expected Earnings: +0.77 USDC
   ✓ No validation errors
   ```

4. **Initiate Staking**
   ```
   ✓ Click "Start Staking"
   ✓ Confirmation modal appears (if implemented)
   ```

5. **Approve Token (First Time)**
   ```
   ✓ MetaMask popup: Approve USDC
   ✓ Confirm approval transaction
   ✓ Wait for confirmation
   ✓ Shows "Approving..." status
   ```

6. **Execute Staking**
   ```
   ✓ MetaMask popup: Stake transaction
   ✓ Review gas fees
   ✓ Confirm transaction
   ✓ Shows "Staking..." status
   ```

7. **Transaction Success**
   ```
   ✓ Success modal appears (if implemented)
   ✓ Shows transaction hash
   ✓ Balance updates
   ✓ Form resets
   ✓ onSuccess callback fires
   ```

**Expected Console Logs:**
```
[VaporWidget] Staking with token address: 0x326A...
Approving token...
Approval successful
Staking tokens...
Staking successful! TX: 0xabcd...
✅ Success callback called
```

**Check on Etherscan:**
```
https://sepolia.etherscan.io/tx/YOUR_TX_HASH

✓ Transaction confirmed
✓ Status: Success
```

#### Test 6.2: Rejection Handling

**Steps:**
1. Enter valid staking details
2. Click "Start Staking"
3. In MetaMask: Click "Reject"

**Expected Results:**
```
✓ Shows error message
✓ No crash
✓ Can try again
✓ onError callback fires with rejection error
```

#### Test 6.3: Insufficient Balance

**Steps:**
1. Enter amount > your balance
2. Try to stake

**Expected Results:**
```
✓ Shows "Insufficient balance" error
✓ Button disabled or shows error
✓ Cannot proceed
```

**✅ Phase 6 Complete** if full flow works

---

## 📊 Test Cases Summary

### Functional Tests

| Test ID | Description | Status |
|---------|-------------|--------|
| F-001 | Wallet detection works | ⏳ |
| F-002 | Connect wallet succeeds | ⏳ |
| F-003 | Balance loads correctly | ⏳ |
| F-004 | Amount validation works | ⏳ |
| F-005 | APY validation works | ⏳ |
| F-006 | Lock period enforced | ⏳ |
| F-007 | Earnings calculated correctly | ⏳ |
| F-008 | MAX button works | ⏳ |
| F-009 | Form validation complete | ⏳ |
| F-010 | API calls succeed | ⏳ |
| F-011 | Token approval works | ⏳ |
| F-012 | Staking transaction works | ⏳ |

### UI/UX Tests

| Test ID | Description | Status |
|---------|-------------|--------|
| U-001 | Widget renders properly | ⏳ |
| U-002 | Responsive on mobile | ⏳ |
| U-003 | Dark theme displays correctly | ⏳ |
| U-004 | Light theme displays correctly | ⏳ |
| U-005 | Loading states show | ⏳ |
| U-006 | Error messages clear | ⏳ |
| U-007 | Buttons disabled when appropriate | ⏳ |
| U-008 | No layout shifts | ⏳ |

### Integration Tests

| Test ID | Description | Status |
|---------|-------------|--------|
| I-001 | CDN bundle loads | ⏳ |
| I-002 | Multiple instances work | ⏳ |
| I-003 | Auto-init works | ⏳ |
| I-004 | Callbacks fire correctly | ⏳ |
| I-005 | Events handled properly | ⏳ |

---

## 🐛 Troubleshooting

### Issue 1: Widget Not Loading

**Symptoms:**
- Blank screen
- Container empty
- No errors

**Debug Steps:**
```javascript
// Check if VaporWidget exists
console.log(typeof VaporWidget); // Should be 'object'

// Check version
console.log(VaporWidget.getVersion()); // Should be '0.1.0'

// Check instances
console.log(VaporWidget.getInstances()); // Should show instances
```

**Solutions:**
- Rebuild: `yarn build:cdn`
- Clear cache: Hard refresh (Cmd+Shift+R)
- Check file paths in HTML
- Verify HTTP server running

### Issue 2: Balance Shows Zero

**Symptoms:**
- Connected wallet
- Shows "Available: 0 USDC"
- But you have USDC

**Debug Steps:**
```javascript
// Check token address being used
// Look in console for:
"Loading balance for token: { address: '0x...' }"

// Verify it matches your USDC contract
```

**Solutions:**
- Check USDC contract address
- Primary: `0x326A6B393DD01D8D3ACA188F2AdCee1cB23B3268`
- Alternative: `0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238`
- Import correct token in MetaMask
- Verify backend returns correct token address

### Issue 3: API Errors

**Symptoms:**
- 404 errors
- CORS errors
- "Invalid API key"

**Debug Steps:**
```bash
# Check backend running
curl http://localhost:3001/api/v1/widget/health

# Should return JSON, not error
```

**Solutions:**
- Start backend: `cd backend && yarn start:dev`
- Check API key in request headers
- Verify origin in allowed list
- Check backend logs

### Issue 4: MetaMask Not Detected

**Symptoms:**
- "No Web3 wallet detected"
- window.ethereum undefined

**Debug Steps:**
```javascript
// Check in console
console.log(typeof window.ethereum); // Should be 'object'
console.log(window.ethereum.isMetaMask); // Should be true
```

**Solutions:**
- Install MetaMask
- Enable extension
- Disable conflicting wallets
- Refresh page
- Try incognito mode

### Issue 5: Transaction Fails

**Symptoms:**
- Transaction rejected
- Gas estimation failed
- Contract error

**Debug Steps:**
- Check gas fees (have enough ETH?)
- Check allowance (approved token?)
- Check contract address
- View transaction on Etherscan

**Solutions:**
- Get more Sepolia ETH
- Check staking contract deployed
- Verify contract address in config
- Check token approval

---

## ✅ Production Checklist

Before deploying to production:

### Backend

- [ ] Production API keys created
- [ ] Domain whitelist configured
- [ ] Rate limits set appropriately
- [ ] Database migrations run
- [ ] CORS configured for production domains
- [ ] Environment variables set
- [ ] SSL certificates installed
- [ ] Logging configured
- [ ] Monitoring setup
- [ ] Backup strategy in place

### Frontend/Widget

- [ ] Built with production config
- [ ] API base URL points to production
- [ ] Network set to 'mainnet'
- [ ] Test API keys removed
- [ ] Source maps excluded (or secured)
- [ ] Analytics integrated
- [ ] Error tracking setup (Sentry, etc.)
- [ ] CDN URLs finalized
- [ ] Cache headers configured

### Smart Contracts

- [ ] Deployed to mainnet
- [ ] Verified on Etherscan
- [ ] Audited (if required)
- [ ] Contract addresses updated in config
- [ ] Owner/admin keys secured
- [ ] Upgrade path tested (if upgradeable)

### Testing

- [ ] All test cases passed
- [ ] Tested on mainnet (small amounts)
- [ ] Cross-browser testing done
- [ ] Mobile testing done
- [ ] Load testing completed
- [ ] Security audit done
- [ ] Penetration testing done

### Documentation

- [ ] User guide updated
- [ ] API documentation complete
- [ ] Integration examples ready
- [ ] Troubleshooting guide updated
- [ ] FAQ created
- [ ] Support contact info provided

### Launch

- [ ] Soft launch planned
- [ ] Monitoring active
- [ ] Support team ready
- [ ] Rollback plan prepared
- [ ] Communication plan ready
- [ ] Legal review done (if required)

---

## 📞 Support

**If tests fail or you encounter issues:**

1. **Check Documentation**
   - [Integration Guide](./INTEGRATION_GUIDE.md)
   - [CDN Usage Guide](./CDN_USAGE.md)
   - [Troubleshooting Section](#troubleshooting)

2. **Contact Support**
   - Email: partners@vaporfund.com
   - Discord: https://discord.com/invite/qWXfwMz4pP
   - Telegram: https://t.me/vaporfund_co

3. **Report Issues**
   - GitHub: https://github.com/VaporFund/vaporfund-staking-widget/issues
   - Include: Browser, OS, error messages, console logs

---

## 📝 Test Report Template

After completing tests, document results:

```markdown
# Widget Test Report

**Date**: YYYY-MM-DD
**Tester**: Your Name
**Environment**: Sepolia Testnet
**Widget Version**: 0.1.0

## Test Results

### Phase 1: Wallet Detection
- [ ] PASS / FAIL - Test 1.1
- [ ] PASS / FAIL - Test 1.2
- [ ] PASS / FAIL - Test 1.3

### Phase 2: Widget Loading
- [ ] PASS / FAIL - Test 2.1
- [ ] PASS / FAIL - Test 2.2
- [ ] PASS / FAIL - Test 2.3

### Phase 3: Staking Form
- [ ] PASS / FAIL - Test 3.1
- [ ] PASS / FAIL - Test 3.2
- [ ] PASS / FAIL - Test 3.3
- [ ] PASS / FAIL - Test 3.4

## Issues Found

1. **Issue Description**
   - Severity: High/Medium/Low
   - Steps to reproduce:
   - Expected vs Actual:
   - Screenshots:

## Recommendations

- [ ] Ready for production
- [ ] Needs fixes
- [ ] Additional testing required

## Notes

(Any additional observations)
```

---

**Happy Testing!** 🧪🚀

If you complete all phases successfully, the widget is ready for production deployment.
