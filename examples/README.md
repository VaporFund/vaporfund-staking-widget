# VaporFund Widget - Examples

This folder contains examples of using the VaporFund Staking Widget in different environments:
- React (NPM package)
- Next.js (NPM package with SSR disabled)
- Vanilla JavaScript (CDN)

All examples include **referral code tracking** for earning revenue share on staking volume.

## ⚠️ Important: Use HTTP Server

**You CANNOT open these files directly** (double-click or `file://` protocol)

The widget requires an HTTP server to work properly due to:
- JavaScript modules
- CORS policies
- Browser security restrictions

---

## 🚀 Quick Start

### Method 1: Use npm script (Recommended)

```bash
# From project root
yarn serve:examples

# Then open:
# http://localhost:8080/examples/test-wallet.html
# http://localhost:8080/examples/simple-cdn.html
# http://localhost:8080/examples/debug-cdn.html
```

### Method 2: Use npx serve

```bash
# From project root
npx serve . -l 8080

# Or from examples folder
cd examples
npx serve -l 8080
```

### Method 3: Use Python

```bash
# From project root
python3 -m http.server 8080

# Then open:
# http://localhost:8080/examples/test-wallet.html
```

---

## 💰 Referral Code Feature

**All examples include referral tracking!** Simply add your `referralCode` to earn revenue share:

```javascript
VaporWidget.init({
  apiKey: 'vf_test_xxxxx',
  referralCode: 'your_code_here', // 👈 Earn 0.25-0.50% on all stakes
  // ... other config
});
```

**How it works:**
1. User stakes through your widget
2. Transaction completes successfully
3. Widget automatically calls backend API to track referral
4. Your earnings accumulate
5. Get paid monthly in USDC

**No extra code needed** - referral tracking is completely automatic!

---

## 📁 Example Files

### React & Next.js Examples

#### react/App.tsx
**Purpose**: React component integration

**Features**:
- TypeScript types
- Environment variables
- Success/error callbacks
- Referral tracking
- Custom colors

**Usage**:
```bash
cd examples/react
npm install
npm start
```

**Set environment variables:**
```bash
# .env
REACT_APP_VAPOR_API_KEY=vf_test_xxxxx
REACT_APP_VAPOR_REFERRAL_CODE=your_code
```

---

#### nextjs/page.tsx
**Purpose**: Next.js App Router integration

**Features**:
- SSR disabled (dynamic import)
- Server/client components
- Environment variables
- Referral tracking
- Error handling

**Usage**:
```bash
cd examples/nextjs
npm install
npm run dev
```

**Set environment variables:**
```bash
# .env.local
NEXT_PUBLIC_VAPOR_API_KEY=vf_test_xxxxx
NEXT_PUBLIC_VAPOR_REFERRAL_CODE=your_code
```

---

#### vanilla-js/index.html
**Purpose**: Pure JavaScript integration (no build tools)

**Features**:
- No dependencies
- Simple CDN integration
- Referral tracking
- Comprehensive error handling
- Production-ready

**Usage**: Serve with HTTP server (see Quick Start)

---

### CDN Examples

#### 1. test-wallet.html
**Purpose**: Test wallet detection and connection

**Features**:
- Check if MetaMask is installed
- Test wallet connection
- View wallet details
- Monitor wallet events

**URL**: http://localhost:8080/examples/test-wallet.html

**Use this when**:
- Widget won't connect to wallet
- Want to verify MetaMask is working
- Need to debug wallet issues

---

#### 2. simple-cdn.html
**Purpose**: Minimal working example with referral tracking

**Features**:
- Single widget instance
- Basic configuration
- Referral code integration
- Comprehensive callbacks
- Simple UI

**URL**: http://localhost:8080/examples/simple-cdn.html

**Use this when**:
- Want to see basic integration
- Testing widget functionality
- Learning how to integrate

---

#### 3. debug-cdn.html
**Purpose**: Full debugging interface

**Features**:
- Environment checks
- Console output viewer
- Manual controls
- Real-time logging

**URL**: http://localhost:8080/examples/debug-cdn.html

**Use this when**:
- Widget not working
- Need detailed error messages
- Want to see all logs

---

#### 4. cdn-example.html
**Purpose**: Advanced features showcase

**Features**:
- Multiple widgets
- Dynamic configuration
- Theme switching
- Live controls

**URL**: http://localhost:8080/examples/cdn-example.html

**Use this when**:
- Want to see all features
- Testing different configurations
- Learning advanced usage

---

#### 5. auto-init-cdn.html
**Purpose**: Data attributes demo with referral tracking

**Features**:
- Auto-initialization
- Multiple themes
- Compact mode
- Referral code via data attributes
- No JavaScript required

**URL**: http://localhost:8080/examples/auto-init-cdn.html

**Use this when**:
- Want simplest integration
- Don't want to write JavaScript
- Using CMS like WordPress

---

## 🔧 Before Testing

### 1. Build CDN version

```bash
yarn build:cdn
```

This creates:
- `dist/cdn/vaporfund-widget.min.js`
- `dist/cdn/style.css`

### 2. Install MetaMask

If you don't have a Web3 wallet:
- MetaMask: https://metamask.io/
- Or use Brave browser (built-in wallet)

### 3. Get Test Tokens (for Sepolia)

- Sepolia ETH: https://sepoliafaucet.com/
- Test USDC: https://faucet.circle.com/

### 4. Switch to Sepolia Network

In MetaMask:
1. Click network dropdown
2. Select "Sepolia test network"
3. If not visible, enable "Show test networks" in settings

---

## 🐛 Troubleshooting

### Issue: "window.ethereum is undefined"

**Problem**: No Web3 wallet detected

**Solutions**:
1. Install MetaMask
2. Enable MetaMask extension
3. Refresh page
4. Check `test-wallet.html` first

---

### Issue: "Failed to load widget"

**Problem**: Using file:// protocol

**Solution**:
Use HTTP server (see Quick Start above)

❌ **Wrong**: `file:///Users/.../example.html`
✅ **Right**: `http://localhost:8080/examples/example.html`

---

### Issue: Widget shows but won't connect

**Problem**: Wallet extension slow to load

**Solutions**:
1. Wait a few seconds
2. Click "Connect Wallet" again
3. Refresh page
4. Check console for errors

---

### Issue: "Network error" or "API error"

**Problem**: Backend not running or wrong API key

**Solutions**:
1. Check if backend is running on port 3001
2. Verify API key is correct
3. Check network (sepolia vs mainnet)
4. Look at console errors

---

## 📝 Testing Checklist

Before reporting issues:

- [ ] Built CDN version (`yarn build:cdn`)
- [ ] Using HTTP server (not file://)
- [ ] MetaMask installed and enabled
- [ ] Connected to correct network (Sepolia for test)
- [ ] Have test ETH and USDC
- [ ] Checked console for errors
- [ ] Tested in `test-wallet.html` first

---

## 💡 Tips

### Tip 1: Start Simple

Always test in this order:
1. `test-wallet.html` - verify wallet works
2. `simple-cdn.html` - verify widget loads
3. `debug-cdn.html` - debug if issues
4. Other examples - test features

### Tip 2: Check Console

Open browser DevTools (F12) and check:
- Console tab for errors
- Network tab for failed requests
- Application tab for localStorage

### Tip 3: Hard Refresh

If widget not updating:
- Mac: Cmd + Shift + R
- Windows/Linux: Ctrl + Shift + R

### Tip 4: Clear Cache

Sometimes browser cache causes issues:
- Chrome: Settings → Privacy → Clear browsing data
- Or use Incognito mode

---

## 📚 Documentation

- **[Integration Guide](../INTEGRATION_GUIDE.md)** - Complete integration guide
- **[CDN Usage Guide](../CDN_USAGE.md)** - CDN-specific documentation
- **[Setup Guide](../SETUP.md)** - Development setup

---

## 🆘 Need Help?

1. **Check console** - Look for error messages
2. **Use debug-cdn.html** - See detailed diagnostics
3. **Test wallet first** - Use test-wallet.html
4. **Read docs** - Check documentation above
5. **Contact support** - partners@vaporfund.com

---

**Remember**: Always use HTTP server, never open files directly! 🚀
