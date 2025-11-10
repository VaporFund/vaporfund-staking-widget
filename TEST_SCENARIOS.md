# Widget Test Scenarios - Quick Reference

**Quick testing guide for QA and developers**

---

## 🚀 Quick Start (5 minutes)

```bash
# 1. Build widget
yarn build:cdn

# 2. Start server
yarn serve:examples

# 3. Open browser
http://localhost:8080/examples/test-wallet.html
```

---

## ✅ Basic Smoke Test (10 minutes)

### 1. Wallet Detection
```
URL: http://localhost:8080/examples/test-wallet.html

✓ Click "Check Wallet"
✓ See "window.ethereum: ✓ Available"
✓ See "Wallet Type: MetaMask"
✓ No errors in console

PASS: ✅  FAIL: ❌
```

### 2. Widget Loading
```
URL: http://localhost:8080/examples/simple-cdn.html

✓ Widget appears
✓ "Connect Wallet" button visible
✓ No JavaScript errors

PASS: ✅  FAIL: ❌
```

### 3. Wallet Connection
```
✓ Click "Connect Wallet"
✓ MetaMask popup appears
✓ Click "Connect"
✓ Address shows in widget
✓ Balance loads

PASS: ✅  FAIL: ❌
```

### 4. Form Validation
```
✓ Enter amount: 50
✓ See error: "Minimum deposit is 101 USDC"
✓ Enter amount: 500
✓ Error clears

PASS: ✅  FAIL: ❌
```

---

## 🧪 Detailed Test Cases (30 minutes)

### Test Case 1: Amount Validation

| Input | Expected | Result |
|-------|----------|--------|
| 50 | ❌ "Minimum 101" | ⏳ |
| 101 | ✅ Accepted | ⏳ |
| 500 | ✅ Accepted | ⏳ |
| 10000 | ✅ Accepted | ⏳ |
| 15000 | ✅ Auto-corrects to 10000 | ⏳ |

### Test Case 2: APY Validation

| Input | Min Days | Expected | Result |
|-------|----------|----------|--------|
| 5% | 1 | ✅ Accepted | ⏳ |
| 10% | 14 | ✅ Auto-fills 14 days | ⏳ |
| 15% | 30 | ✅ Auto-fills 30 days | ⏳ |
| 20% | 90 | ✅ Auto-fills 90 days | ⏳ |
| 25% | - | ✅ Auto-corrects to 20% | ⏳ |

### Test Case 3: Earnings Calculation

| Amount | APY | Days | Expected Earnings | Result |
|--------|-----|------|-------------------|--------|
| 1000 | 10% | 30 | 8.22 USDC | ⏳ |
| 500 | 15% | 60 | 12.33 USDC | ⏳ |
| 2000 | 20% | 90 | 98.63 USDC | ⏳ |

Formula: `(amount × apy × days) / (365 × 100)`

### Test Case 4: Wallet Events

| Action | Expected Behavior | Result |
|--------|-------------------|--------|
| Disconnect wallet | Shows connect screen | ⏳ |
| Reconnect | Balance reloads | ⏳ |
| Switch account | Updates address & balance | ⏳ |
| Switch network | Detects change | ⏳ |

---

## 🎯 User Scenarios

### Scenario A: First-Time User

**Goal:** Complete first stake on Sepolia

```
Steps:
1. Open http://localhost:8080/examples/simple-cdn.html
2. Click "Connect Wallet"
3. Approve in MetaMask
4. See balance: "Available: X USDC"
5. Enter: Amount=200, APY=10%, Days=14
6. See: "Expected Earnings: +0.77 USDC"
7. Click "Start Staking"
8. (If contract deployed) Approve token → Stake
9. Success!

Expected Time: 2-3 minutes
Pass Criteria: All steps complete without errors
```

### Scenario B: Returning User

**Goal:** Quick stake without approval

```
Steps:
1. Already approved token
2. Connect wallet
3. Enter stake details
4. Click stake
5. Only 1 transaction (no approval)
6. Success!

Expected Time: 1 minute
Pass Criteria: No approval step needed
```

### Scenario C: Mobile User

**Goal:** Stake from mobile browser

```
Steps:
1. Open on mobile (MetaMask mobile app browser)
2. Widget responsive and readable
3. Connect wallet
4. Complete stake
5. Transaction confirms

Expected Time: 3-4 minutes
Pass Criteria: UI usable on small screen
```

---

## 🔍 Edge Cases

### Edge Case 1: No Wallet Extension

```
Setup: Disable MetaMask
Expected:
- "No Web3 wallet detected" message
- Clear install instructions
- No crash

Test: ⏳
```

### Edge Case 2: Wrong Network

```
Setup: Connect to Mainnet (widget on Sepolia)
Expected:
- Network mismatch warning
- Instructions to switch
- Cannot proceed until switched

Test: ⏳
```

### Edge Case 3: Insufficient Balance

```
Setup: Balance < minimum stake
Expected:
- "Insufficient balance" error
- Button disabled
- Suggested actions shown

Test: ⏳
```

### Edge Case 4: Slow Network

```
Setup: Throttle network to 3G
Expected:
- Loading indicators show
- No timeout errors
- Eventually loads or shows error

Test: ⏳
```

### Edge Case 5: Backend Offline

```
Setup: Stop backend server
Expected:
- "API Error" message
- Graceful degradation
- No crash

Test: ⏳
```

---

## 🌐 Cross-Browser Testing

| Browser | Version | Widget Loads | Connects | Stake Works | Notes |
|---------|---------|--------------|----------|-------------|-------|
| Chrome | Latest | ⏳ | ⏳ | ⏳ | |
| Firefox | Latest | ⏳ | ⏳ | ⏳ | |
| Brave | Latest | ⏳ | ⏳ | ⏳ | Built-in wallet |
| Edge | Latest | ⏳ | ⏳ | ⏳ | |
| Safari | Latest | ⏳ | ⏳ | ⏳ | Limited support |

---

## 📱 Device Testing

| Device | OS | Screen Size | Result | Notes |
|--------|----|----|--------|-------|
| Desktop | macOS | 1920x1080 | ⏳ | |
| Desktop | Windows | 1920x1080 | ⏳ | |
| Tablet | iPad | 1024x768 | ⏳ | |
| Mobile | iPhone | 375x667 | ⏳ | |
| Mobile | Android | 360x640 | ⏳ | |

---

## 🎨 Visual Regression Tests

### Light Theme
```
URL: http://localhost:8080/examples/auto-init-cdn.html

✓ Background is white
✓ Text is dark
✓ Buttons have correct colors
✓ No visual glitches

PASS: ⏳
```

### Dark Theme
```
✓ Background is dark
✓ Text is light
✓ Good contrast
✓ Looks professional

PASS: ⏳
```

### Compact Mode
```
✓ Smaller layout
✓ All elements visible
✓ No overflow
✓ Usable

PASS: ⏳
```

---

## 🚨 Error Handling Tests

### Error 1: User Rejection
```
Trigger: Reject MetaMask popup
Expected: "Connection request rejected by user"
Actual: ⏳
Can Retry: ⏳
```

### Error 2: Network Error
```
Trigger: Disconnect internet during API call
Expected: "Network error. Please try again"
Actual: ⏳
Can Retry: ⏳
```

### Error 3: Invalid API Key
```
Trigger: Use wrong API key
Expected: "Invalid API key"
Actual: ⏳
Clear Message: ⏳
```

### Error 4: Transaction Failed
```
Trigger: Insufficient gas
Expected: Shows gas error from MetaMask
Actual: ⏳
Recoverable: ⏳
```

---

## ⚡ Performance Tests

### Load Time
```
Metric: Time to interactive
Target: < 3 seconds
Actual: _____ seconds
PASS: ⏳
```

### Bundle Size
```
Metric: Total download size (gzipped)
Target: < 200 KB
Actual: ~168 KB
PASS: ✅
```

### API Response Time
```
Endpoint: /widget/health
Target: < 500ms
Actual: _____ ms
PASS: ⏳
```

---

## 🔐 Security Tests

### Test 1: API Key Exposure
```
Check: View source, network tab
Verify: API key transmitted in headers only
Result: ⏳
```

### Test 2: XSS Protection
```
Input: <script>alert('xss')</script> in amount field
Expected: Sanitized, no execution
Result: ⏳
```

### Test 3: CORS
```
Try: Load from unauthorized domain
Expected: CORS error
Result: ⏳
```

---

## 📊 Quick Results Summary

```
Total Tests: 50
Passed: ___
Failed: ___
Skipped: ___

Pass Rate: ____%

Critical Issues: ___
Major Issues: ___
Minor Issues: ___

Ready for Production: YES / NO
```

---

## 🎯 Priority Tests

**Must Pass Before Production:**

1. ✅ Wallet connection works
2. ✅ Balance loads correctly
3. ✅ Form validation complete
4. ✅ API calls succeed
5. ✅ Error messages clear
6. ✅ No console errors
7. ✅ Works on Chrome & Firefox
8. ✅ Mobile responsive

**Nice to Have:**

- Multiple instances work
- All browsers supported
- Perfect accessibility
- Advanced features

---

## 📝 Report Template

```markdown
# Quick Test Report

**Date**: _______
**Tester**: _______
**Duration**: _____ minutes

## Summary
- Smoke Test: PASS / FAIL
- Basic Functions: PASS / FAIL
- Edge Cases: PASS / FAIL

## Issues
1. _________________
2. _________________

## Recommendation
☐ Ready to deploy
☐ Needs fixes
☐ More testing needed
```

---

**Use this for quick daily testing or before deployments!** 🚀
