# VaporFund Widget API Key - Complete Transaction Flow
## How API Key Controls Widget Access

---

## 🎯 Core Concept

**คำถาม:** ต้องมี API Key ถึงจะ stake/swap ได้ใช่ไหม?
**คำตอบ:** ใช่! API Key คือ "กุญแจ" ที่ทำให้ Widget เชื่อมต่อกับ Backend ได้

```
ไม่มี API Key = Widget ไม่สามารถเรียก API = ไม่สามารถ stake ได้
```

---

## 🔄 Complete Staking Flow with API Key

### Overview Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                           User Journey                            │
└──────────────────────────────────────────────────────────────────┘

1. User visits website with embedded widget
   ↓
2. Widget initialized with API Key
   ↓
3. Widget connects to VaporFund Backend (validates API Key)
   ↓
4. User connects wallet
   ↓
5. Widget fetches strategies & tokens (requires valid API Key)
   ↓
6. User selects amount & strategy
   ↓
7. Widget prepares transaction via Backend API (API Key required)
   ↓
8. User approves & signs transaction
   ↓
9. Transaction sent to blockchain
   ↓
10. Widget reports success to Backend (tracked with API Key)
```

---

## 📊 Detailed Sequence Diagram

```
┌─────────┐         ┌────────┐         ┌─────────────┐         ┌────────────┐         ┌──────────┐
│  User   │         │ Widget │         │   Backend   │         │  Database  │         │Blockchain│
│(Browser)│         │(React) │         │  (NestJS)   │         │(PostgreSQL)│         │(Ethereum)│
└────┬────┘         └───┬────┘         └──────┬──────┘         └─────┬──────┘         └────┬─────┘
     │                  │                     │                      │                      │
     │  Load Page       │                     │                      │                      │
     ├─────────────────>│                     │                      │                      │
     │                  │                     │                      │                      │
     │   Initialize     │                     │                      │                      │
     │   with API Key   │                     │                      │                      │
     ├─────────────────>│                     │                      │                      │
     │                  │                     │                      │                      │
     │                  │  GET /health        │                      │                      │
     │                  │  Header:            │                      │                      │
     │                  │  X-Widget-API-Key   │                      │                      │
     │                  ├────────────────────>│                      │                      │
     │                  │                     │                      │                      │
     │                  │                     │  Validate API Key    │                      │
     │                  │                     ├─────────────────────>│                      │
     │                  │                     │  - Check if active   │                      │
     │                  │                     │  - Check domain      │                      │
     │                  │                     │  - Check rate limit  │                      │
     │                  │                     │<─────────────────────┤                      │
     │                  │                     │  Key Valid ✅        │                      │
     │                  │                     │                      │                      │
     │                  │  200 OK             │                      │                      │
     │                  │<────────────────────┤                      │                      │
     │                  │                     │                      │                      │
     │  Widget Loaded   │                     │                      │                      │
     │<─────────────────┤                     │                      │                      │
     │                  │                     │                      │                      │
     │ Connect Wallet   │                     │                      │                      │
     ├─────────────────>│                     │                      │                      │
     │                  │                     │                      │                      │
     │                  │  GET /strategies    │                      │                      │
     │                  │  Header:            │                      │                      │
     │                  │  X-Widget-API-Key   │                      │                      │
     │                  ├────────────────────>│                      │                      │
     │                  │                     │                      │                      │
     │                  │                     │  Validate + Log      │                      │
     │                  │                     ├─────────────────────>│                      │
     │                  │                     │  INSERT usage record │                      │
     │                  │                     │<─────────────────────┤                      │
     │                  │                     │                      │                      │
     │                  │  { strategies: [...]}                     │                      │
     │                  │<────────────────────┤                      │                      │
     │                  │                     │                      │                      │
     │  Show Strategies │                     │                      │                      │
     │<─────────────────┤                     │                      │                      │
     │                  │                     │                      │                      │
     │                  │  GET /tokens        │                      │                      │
     │                  │  Header:            │                      │                      │
     │                  │  X-Widget-API-Key   │                      │                      │
     │                  ├────────────────────>│                      │                      │
     │                  │                     │  Validate + Log      │                      │
     │                  │                     ├─────────────────────>│                      │
     │                  │                     │<─────────────────────┤                      │
     │                  │  { tokens: [...] }  │                      │                      │
     │                  │<────────────────────┤                      │                      │
     │                  │                     │                      │                      │
     │ Enter Amount &   │                     │                      │                      │
     │ Select Strategy  │                     │                      │                      │
     ├─────────────────>│                     │                      │                      │
     │                  │                     │                      │                      │
     │                  │ POST /prepare-tx    │                      │                      │
     │                  │ Header:             │                      │                      │
     │                  │ X-Widget-API-Key    │                      │                      │
     │                  │ Body: {             │                      │                      │
     │                  │   token: "0x...",   │                      │                      │
     │                  │   amount: "100",    │                      │                      │
     │                  │   strategy: "apy",  │                      │                      │
     │                  │   userAddress: "0x" │                      │                      │
     │                  │ }                   │                      │                      │
     │                  ├────────────────────>│                      │                      │
     │                  │                     │                      │                      │
     │                  │                     │  Validate API Key    │                      │
     │                  │                     ├─────────────────────>│                      │
     │                  │                     │  - Check permissions │                      │
     │                  │                     │  - Verify token      │                      │
     │                  │                     │  - Calculate APY     │                      │
     │                  │                     │  - Log request       │                      │
     │                  │                     │<─────────────────────┤                      │
     │                  │                     │                      │                      │
     │                  │  {                  │                      │                      │
     │                  │    contractAddress, │                      │                      │
     │                  │    encodedData,     │                      │                      │
     │                  │    estimatedGas,    │                      │                      │
     │                  │    lockPeriod       │                      │                      │
     │                  │  }                  │                      │                      │
     │                  │<────────────────────┤                      │                      │
     │                  │                     │                      │                      │
     │ Confirm Tx       │                     │                      │                      │
     ├─────────────────>│                     │                      │                      │
     │                  │                     │                      │                      │
     │                  │ Send Tx to Blockchain                     │                      │
     │                  ├───────────────────────────────────────────────────────────────>│
     │                  │                     │                      │                      │
     │ Sign Transaction │                     │                      │                      │
     │<─────────────────┤                     │                      │                      │
     ├─────────────────>│                     │                      │                      │
     │                  │                     │                      │              Tx Sent │
     │                  │                     │                      │                      ├─┐
     │                  │                     │                      │              Mining  │ │
     │                  │                     │                      │                      │<┘
     │                  │                     │                      │           Tx Mined ✅│
     │                  │  Tx Hash: 0xabc...  │                      │                      │
     │                  │<───────────────────────────────────────────────────────────────┤
     │                  │                     │                      │                      │
     │                  │ POST /track-tx      │                      │                      │
     │                  │ Header:             │                      │                      │
     │                  │ X-Widget-API-Key    │                      │                      │
     │                  │ Body: {             │                      │                      │
     │                  │   txHash: "0xabc",  │                      │                      │
     │                  │   amount: "100",    │                      │                      │
     │                  │   token: "USDT",    │                      │                      │
     │                  │   strategy: "apy",  │                      │                      │
     │                  │   userAddress: "0x" │                      │                      │
     │                  │ }                   │                      │                      │
     │                  ├────────────────────>│                      │                      │
     │                  │                     │                      │                      │
     │                  │                     │  Store Transaction   │                      │
     │                  │                     ├─────────────────────>│                      │
     │                  │                     │  INSERT into         │                      │
     │                  │                     │  staking_transactions│                      │
     │                  │                     │  - Link to API Key   │                      │
     │                  │                     │  - Store domain      │                      │
     │                  │                     │  - Calculate rewards │                      │
     │                  │                     │<─────────────────────┤                      │
     │                  │                     │                      │                      │
     │                  │  { success: true }  │                      │                      │
     │                  │<────────────────────┤                      │                      │
     │                  │                     │                      │                      │
     │ Success! 🎉     │                     │                      │                      │
     │<─────────────────┤                     │                      │                      │
     │                  │                     │                      │                      │
```

---

## 🔑 API Key at Each Step

### 1️⃣ Widget Initialization

```tsx
// Customer Website
<VaporStakingWidget
  apiKey="vf_live_1a2b3c4d5e6f..."
  network="ethereum"
/>
```

**What happens:**
- Widget stores API Key in memory
- All API requests will include this key
- ❌ No API Key = Widget shows error immediately

---

### 2️⃣ Health Check (Optional but Recommended)

**Endpoint:** `GET /api/widget/health`

**Headers:**
```
X-Widget-API-Key: vf_live_1a2b3c4d5e6f...
Origin: https://customer-site.com
```

**Backend validates:**
```typescript
@Get('health')
@UseGuards(WidgetApiKeyGuard)
async health(@Request() req) {
  return {
    success: true,
    data: {
      apiKey: req.widgetApiKey.name,
      rateLimit: req.widgetApiKey.rateLimit,
      remaining: await this.getRemainingRequests(req.widgetApiKey.id)
    }
  };
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "apiKey": "Production Website",
    "rateLimit": 10000,
    "remaining": 9876
  }
}
```

---

### 3️⃣ Fetch Strategies

**Endpoint:** `GET /api/widget/strategies`

**Headers:**
```
X-Widget-API-Key: vf_live_1a2b3c4d5e6f...
Origin: https://customer-site.com
```

**Backend:**
1. ✅ Validate API Key (WidgetApiKeyGuard)
2. ✅ Check domain allowed
3. ✅ Check rate limit
4. ✅ Log usage
5. Return strategies

**Widget receives:**
```json
{
  "success": true,
  "data": {
    "strategies": [
      {
        "id": "flexible",
        "name": "Flexible Staking",
        "apy": "8.5%",
        "lockPeriod": 0
      },
      {
        "id": "locked-30",
        "name": "30-Day Lock",
        "apy": "12.0%",
        "lockPeriod": 30
      }
    ]
  }
}
```

---

### 4️⃣ Fetch Whitelisted Tokens

**Endpoint:** `GET /api/widget/tokens`

**Headers:**
```
X-Widget-API-Key: vf_live_1a2b3c4d5e6f...
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tokens": [
      {
        "address": "0x...",
        "symbol": "USDT",
        "decimals": 6,
        "minDeposit": "10",
        "maxDeposit": "1000000"
      }
    ]
  }
}
```

---

### 5️⃣ Prepare Transaction (CRITICAL)

**Endpoint:** `POST /api/widget/prepare-transaction`

**Headers:**
```
X-Widget-API-Key: vf_live_1a2b3c4d5e6f...
Origin: https://customer-site.com
```

**Request Body:**
```json
{
  "token": "0x...",
  "amount": "100",
  "strategy": "locked-30",
  "userAddress": "0x...",
  "referralCode": "REF123"
}
```

**Backend Logic:**
```typescript
@Post('prepare-transaction')
@UseGuards(WidgetApiKeyGuard)
async prepareTransaction(
  @Request() req,
  @Body() body: PrepareTransactionDto
) {
  const apiKey = req.widgetApiKey;

  // 1. Validate token is whitelisted
  const token = await this.validateToken(body.token);

  // 2. Validate amount within limits
  this.validateAmount(body.amount, token);

  // 3. Get strategy details
  const strategy = await this.getStrategy(body.strategy);

  // 4. Calculate lock period based on APY
  const lockPeriod = this.calculateLockPeriod(strategy.apy);

  // 5. Generate transaction data
  const txData = await this.generateStakingTx({
    token: body.token,
    amount: body.amount,
    lockPeriod,
    userAddress: body.userAddress
  });

  // 6. Log preparation (for analytics)
  await this.logPreparation({
    apiKeyId: apiKey.id,
    userAddress: body.userAddress,
    token: body.token,
    amount: body.amount,
    strategy: body.strategy,
    domain: req.headers.origin
  });

  return {
    success: true,
    data: {
      contractAddress: CONTRACT_ADDRESS,
      encodedData: txData,
      estimatedGas: "150000",
      lockPeriod,
      expectedApy: strategy.apy
    }
  };
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "contractAddress": "0x...",
    "encodedData": "0x...",
    "estimatedGas": "150000",
    "lockPeriod": 30,
    "expectedApy": "12.0%"
  }
}
```

**❌ Without valid API Key:**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_API_KEY",
    "message": "Invalid or inactive API Key"
  }
}
```

---

### 6️⃣ Execute Transaction (Blockchain)

**Widget Code:**
```typescript
// Widget sends transaction to blockchain
const tx = await stakingContract.stake(
  tokenAddress,
  amount,
  lockPeriod,
  { gasLimit: estimatedGas }
);

// Wait for confirmation
const receipt = await tx.wait();
```

**Note:** This step doesn't need API Key because it goes directly to blockchain.

---

### 7️⃣ Track Transaction (Post-Stake)

**Endpoint:** `POST /api/widget/track-transaction`

**Headers:**
```
X-Widget-API-Key: vf_live_1a2b3c4d5e6f...
Origin: https://customer-site.com
```

**Request Body:**
```json
{
  "txHash": "0xabc123...",
  "amount": "100",
  "token": "USDT",
  "strategy": "locked-30",
  "userAddress": "0x...",
  "referralCode": "REF123"
}
```

**Backend Logic:**
```typescript
@Post('track-transaction')
@UseGuards(WidgetApiKeyGuard)
async trackTransaction(
  @Request() req,
  @Body() body: TrackTransactionDto
) {
  const apiKey = req.widgetApiKey;

  // 1. Verify transaction on blockchain
  const txReceipt = await this.verifyTransaction(body.txHash);

  if (!txReceipt) {
    throw new BadRequestException('Transaction not found');
  }

  // 2. Store in database
  const stakingTx = await this.stakingTransactionRepo.save({
    txHash: body.txHash,
    userAddress: body.userAddress,
    token: body.token,
    amount: body.amount,
    strategy: body.strategy,
    apiKeyId: apiKey.id,
    domain: req.headers.origin,
    referralCode: body.referralCode,
    status: 'completed'
  });

  // 3. Calculate referral if applicable
  if (body.referralCode) {
    await this.processReferral(body.referralCode, stakingTx);
  }

  // 4. Update analytics
  await this.updateAnalytics(apiKey.id, stakingTx);

  return {
    success: true,
    data: {
      transactionId: stakingTx.id,
      referralFee: stakingTx.referralFee || '0'
    }
  };
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transactionId": "uuid-123",
    "referralFee": "0.5"
  }
}
```

---

## 🚫 Error Scenarios

### Scenario 1: Invalid API Key

```
User tries to use widget → Widget calls API → Backend rejects
```

**Response:**
```json
{
  "statusCode": 401,
  "message": "Invalid or inactive API Key",
  "error": "Unauthorized"
}
```

**Widget shows:**
```
⚠️ Configuration Error: Invalid API Key
Please contact the site administrator.
```

---

### Scenario 2: Domain Not Allowed

```
Widget on domain X → Backend checks allowedDomains → domain X not in list
```

**Response:**
```json
{
  "statusCode": 403,
  "message": "This domain is not authorized to use this API Key",
  "error": "Forbidden"
}
```

**Widget shows:**
```
⚠️ Access Denied
This widget is not authorized to run on this domain.
```

---

### Scenario 3: Rate Limit Exceeded

```
1001st request in a day → Backend checks usage count → Limit is 1000
```

**Response:**
```json
{
  "statusCode": 429,
  "message": "Rate limit exceeded. Try again later.",
  "error": "Too Many Requests"
}
```

**Response Headers:**
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 2025-11-04T00:00:00Z
```

**Widget shows:**
```
⚠️ Rate Limit Exceeded
Please try again tomorrow or contact support to increase your limit.
```

---

### Scenario 4: Expired API Key

```
API Key has expiresAt: 2025-01-01 → Today is 2025-01-02
```

**Response:**
```json
{
  "statusCode": 401,
  "message": "API Key has expired",
  "error": "Unauthorized"
}
```

---

## 🔐 Security Implementation

### Backend Middleware (NestJS)

```typescript
// widget-api-key.guard.ts
@Injectable()
export class WidgetApiKeyGuard implements CanActivate {
  constructor(
    @InjectRepository(WidgetApiKey)
    private apiKeyRepo: Repository<WidgetApiKey>,
    @InjectRepository(WidgetApiKeyUsage)
    private usageRepo: Repository<WidgetApiKeyUsage>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    // 1. Extract API Key
    const apiKey = request.headers['x-widget-api-key'];
    if (!apiKey) {
      throw new UnauthorizedException('API Key required');
    }

    // 2. Find and validate API Key
    const keyRecord = await this.apiKeyRepo.findOne({
      where: { key: apiKey },
      relations: ['owner']
    });

    if (!keyRecord) {
      throw new UnauthorizedException('Invalid API Key');
    }

    if (!keyRecord.isActive) {
      throw new UnauthorizedException('API Key is inactive');
    }

    // 3. Check expiration
    if (keyRecord.expiresAt && new Date() > keyRecord.expiresAt) {
      throw new UnauthorizedException('API Key expired');
    }

    // 4. Validate origin/domain
    const origin = request.headers.origin || request.headers.referer;
    if (keyRecord.allowedOrigins?.length) {
      const isAllowed = this.isOriginAllowed(origin, keyRecord.allowedOrigins);
      if (!isAllowed) {
        throw new ForbiddenException('Origin not allowed');
      }
    }

    // 5. Check rate limit
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const usageCount = await this.usageRepo.count({
      where: {
        apiKeyId: keyRecord.id,
        timestamp: MoreThan(today)
      }
    });

    if (usageCount >= keyRecord.rateLimit) {
      // Set rate limit headers
      response.setHeader('X-RateLimit-Limit', keyRecord.rateLimit);
      response.setHeader('X-RateLimit-Remaining', 0);
      response.setHeader('X-RateLimit-Reset', this.getNextResetTime());

      throw new TooManyRequestsException('Rate limit exceeded');
    }

    // 6. Log usage (async, don't wait)
    this.logUsage(keyRecord, request).catch(err => {
      console.error('Failed to log usage:', err);
    });

    // 7. Update last used
    keyRecord.lastUsedAt = new Date();
    await this.apiKeyRepo.save(keyRecord);

    // 8. Attach to request
    request.widgetApiKey = keyRecord;

    // 9. Set rate limit headers
    response.setHeader('X-RateLimit-Limit', keyRecord.rateLimit);
    response.setHeader('X-RateLimit-Remaining', keyRecord.rateLimit - usageCount - 1);
    response.setHeader('X-RateLimit-Reset', this.getNextResetTime());

    return true;
  }

  private async logUsage(
    apiKey: WidgetApiKey,
    request: any
  ): Promise<void> {
    await this.usageRepo.save({
      apiKeyId: apiKey.id,
      endpoint: request.url,
      method: request.method,
      domain: this.extractDomain(request.headers.origin),
      origin: request.headers.origin,
      ipAddress: request.ip,
      userAgent: request.headers['user-agent'],
      statusCode: 200, // Will be updated by interceptor
      timestamp: new Date()
    });
  }

  private isOriginAllowed(origin: string, allowedOrigins: string[]): boolean {
    if (!origin) return false;

    const originHost = new URL(origin).hostname;

    return allowedOrigins.some(allowed => {
      // Support wildcards: *.example.com
      if (allowed.startsWith('*.')) {
        const domain = allowed.slice(2);
        return originHost.endsWith(domain);
      }
      return originHost === allowed;
    });
  }

  private extractDomain(origin: string): string {
    if (!origin) return null;
    try {
      return new URL(origin).hostname;
    } catch {
      return null;
    }
  }

  private getNextResetTime(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.toISOString();
  }
}
```

---

## 📈 Analytics & Tracking

### What Gets Tracked

Every API request with valid API Key logs:

```typescript
{
  apiKeyId: "uuid",
  endpoint: "/api/widget/strategies",
  method: "GET",
  domain: "example.com",
  origin: "https://example.com",
  ipAddress: "1.2.3.4",
  userAgent: "Mozilla/5.0...",
  statusCode: 200,
  responseTime: 120, // milliseconds
  timestamp: "2025-11-03T10:30:00Z"
}
```

### Admin Dashboard Shows

1. **Usage Overview**
   - Total requests today/this month
   - Unique domains using the key
   - Top endpoints
   - Error rate

2. **Geographic Distribution**
   - Requests by country (from IP)
   - Most active regions

3. **Performance Metrics**
   - Average response time
   - 95th percentile latency
   - Error breakdown

4. **Transaction Tracking**
   - Total staked via this key
   - Number of unique users
   - Conversion rate (visits → stakes)

---

## 🎨 Widget Integration Examples

### React (NPM)

```tsx
import { VaporStakingWidget } from '@vaporfund/staking-widget';
import '@vaporfund/staking-widget/styles.css';

function App() {
  return (
    <VaporStakingWidget
      apiKey={process.env.REACT_APP_VAPOR_API_KEY} // ← Required!
      network="ethereum"
      theme="dark"
      onSuccess={(tx) => {
        console.log('Staking successful!', tx);
        // Track your own analytics
      }}
      onError={(error) => {
        console.error('Staking failed:', error);
        if (error.code === 'INVALID_API_KEY') {
          alert('Please configure your API key');
        }
      }}
    />
  );
}
```

### Vanilla JS (CDN)

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://cdn.vaporfund.com/widget/v1/vapor-widget.css">
</head>
<body>
  <div id="vapor-widget"></div>

  <script src="https://cdn.vaporfund.com/widget/v1/vapor-widget.js"></script>
  <script>
    VaporWidget.init({
      container: '#vapor-widget',
      apiKey: 'vf_live_1a2b3c4d5e6f...', // ← Required!
      network: 'ethereum',
      theme: 'dark',
      onSuccess: function(tx) {
        console.log('Success:', tx);
      },
      onError: function(error) {
        console.error('Error:', error);
      }
    });
  </script>
</body>
</html>
```

---

## 🔧 Environment Configuration

### Backend `.env`

```env
# Widget API Key Features
WIDGET_API_KEY_ENABLED=true
WIDGET_API_KEY_DEFAULT_RATE_LIMIT=10000
WIDGET_API_KEY_REQUIRE_HTTPS=true
WIDGET_API_KEY_ALLOW_LOCALHOST=true # For development

# Rate Limiting
WIDGET_RATE_LIMIT_WINDOW=86400 # 24 hours in seconds
WIDGET_RATE_LIMIT_MAX=10000

# Analytics
WIDGET_ANALYTICS_RETENTION_DAYS=90
WIDGET_ANALYTICS_AGGREGATE_INTERVAL=3600 # 1 hour
```

### Widget `.env` (Customer Side)

```env
# Required
REACT_APP_VAPOR_API_KEY=vf_live_1a2b3c4d5e6f...

# Optional
REACT_APP_VAPOR_NETWORK=ethereum
REACT_APP_VAPOR_THEME=dark
```

---

## ✅ Summary: API Key Control Points

| Step | API Key Required? | What Happens Without It? |
|------|------------------|---------------------------|
| Widget Load | ✅ Yes | Widget shows error |
| Health Check | ✅ Yes | 401 Unauthorized |
| Fetch Strategies | ✅ Yes | Cannot load strategies |
| Fetch Tokens | ✅ Yes | Cannot load tokens |
| Prepare Transaction | ✅ Yes | Cannot prepare stake |
| Blockchain Transaction | ❌ No | Direct wallet → blockchain |
| Track Transaction | ✅ Yes | Cannot track/report |

**Bottom Line:** Without a valid API Key, the widget is completely non-functional. It cannot fetch data or prepare transactions.

---

## 🚀 Next Steps

1. **For Backend Team:**
   - Implement WidgetApiKeyGuard
   - Create Admin UI for key management
   - Set up analytics tracking

2. **For Frontend Team:**
   - Update ApiClient to use X-Widget-API-Key header
   - Add error handling for API key issues
   - Implement retry logic for rate limits

3. **For DevOps:**
   - Set up monitoring for API key usage
   - Configure alerts for anomalies
   - Set up automated key rotation

---

**Document Version:** 1.0
**Last Updated:** November 3, 2025
**Related:** See `WIDGET_API_KEY_DESIGN.md` for complete system architecture
