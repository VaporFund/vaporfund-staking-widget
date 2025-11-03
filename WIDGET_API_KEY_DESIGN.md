# VaporFund Widget API Key Management System
## Design Document v1.0

---

## 📋 Table of Contents
1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Database Schema](#database-schema)
4. [API Endpoints](#api-endpoints)
5. [Authentication Flow](#authentication-flow)
6. [Widget Integration](#widget-integration)
7. [Rate Limiting & Monitoring](#rate-limiting--monitoring)
8. [Security Considerations](#security-considerations)
9. [Implementation Roadmap](#implementation-roadmap)

---

## 🎯 Overview

### Objective
สร้างระบบจัดการ API Key สำหรับ VaporFund Staking Widget ให้ Admin สามารถ:
- สร้างและจัดการ API Keys
- ติดตามว่าใครเอา Widget ไปใช้
- จำกัดการใช้งาน (rate limiting)
- ตรวจสอบสถิติการใช้งาน

### Inspiration
ออกแบบตาม best practices จาก:
- Google Maps Platform API Keys
- Stripe API Keys
- Mapbox Access Tokens

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Admin Dashboard                          │
│  (Create/Manage/Monitor API Keys)                           │
└───────────────────┬─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│                  Backend API Server (NestJS)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Widget Keys  │  │ Middleware   │  │ Analytics    │      │
│  │ Module       │  │ (Validation) │  │ Service      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└───────────────────┬─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│                     PostgreSQL Database                      │
│  - widget_api_keys                                          │
│  - widget_api_key_usage                                     │
│  - widget_domains (optional)                                │
└─────────────────────────────────────────────────────────────┘
                    ▲
                    │
┌───────────────────┴─────────────────────────────────────────┐
│              Widget Embedded on Customer Sites               │
│  - Sends API Key with every request                         │
│  - Tracked by domain/origin                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema

### 1. **widget_api_keys** Table

```typescript
@Entity('widget_api_keys')
export class WidgetApiKey {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // API Key (e.g., "vf_live_abc123xyz..." or "vf_test_abc123xyz...")
  @Column({ type: 'varchar', length: 64, unique: true })
  @Index()
  key: string;

  // Key prefix for easy identification
  @Column({ type: 'enum', enum: ['live', 'test'], default: 'live' })
  environment: 'live' | 'test';

  // Human-readable name/description
  @Column({ type: 'varchar', length: 255 })
  name: string;

  // Owner of this API key (Admin user)
  @ManyToOne(() => User, (user) => user.widgetApiKeys)
  owner: User;

  @Column({ type: 'uuid' })
  ownerId: string;

  // Status
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  // Allowed domains (array of domains)
  @Column({ type: 'jsonb', nullable: true })
  allowedDomains: string[] | null; // ["example.com", "*.example.com"]

  // Allowed origins (for CORS)
  @Column({ type: 'jsonb', nullable: true })
  allowedOrigins: string[] | null;

  // Rate limiting
  @Column({ type: 'integer', default: 1000 })
  rateLimit: number; // requests per day

  // IP Whitelist (optional)
  @Column({ type: 'jsonb', nullable: true })
  ipWhitelist: string[] | null;

  // Metadata for tracking
  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any> | null;

  // Last used timestamp
  @Column({ type: 'timestamp', nullable: true })
  lastUsedAt: Date | null;

  // Expiration (optional)
  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => WidgetApiKeyUsage, (usage) => usage.apiKey)
  usage: WidgetApiKeyUsage[];
}
```

### 2. **widget_api_key_usage** Table (Analytics)

```typescript
@Entity('widget_api_key_usage')
export class WidgetApiKeyUsage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // API Key reference
  @ManyToOne(() => WidgetApiKey, (apiKey) => apiKey.usage, { onDelete: 'CASCADE' })
  apiKey: WidgetApiKey;

  @Column({ type: 'uuid' })
  @Index()
  apiKeyId: string;

  // Request details
  @Column({ type: 'varchar', length: 255 })
  endpoint: string; // e.g., "/api/widget/strategies"

  @Column({ type: 'varchar', length: 10 })
  method: string; // GET, POST, etc.

  @Column({ type: 'varchar', length: 255, nullable: true })
  domain: string | null; // Domain where widget is embedded

  @Column({ type: 'varchar', length: 255, nullable: true })
  origin: string | null; // Full origin URL

  @Column({ type: 'varchar', length: 45, nullable: true })
  ipAddress: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  userAgent: string | null;

  // Response details
  @Column({ type: 'integer' })
  statusCode: number;

  @Column({ type: 'integer', nullable: true })
  responseTime: number | null; // milliseconds

  // Timestamp (partition by date for performance)
  @CreateDateColumn()
  @Index()
  timestamp: Date;

  // Additional metadata
  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any> | null;
}
```

### 3. **Update User Entity**

เพิ่ม relation ใน `user.entity.ts`:

```typescript
@OneToMany(() => WidgetApiKey, (widgetApiKey) => widgetApiKey.owner)
widgetApiKeys: WidgetApiKey[];
```

---

## 🔌 API Endpoints

### **Admin Endpoints** (Protected - Admin Only)

#### 1. Create API Key
```
POST /api/admin/widget-keys
Authorization: Bearer {admin_jwt_token}

Request Body:
{
  "name": "Production Website",
  "environment": "live", // or "test"
  "allowedDomains": ["example.com", "*.example.com"],
  "allowedOrigins": ["https://example.com"],
  "rateLimit": 10000, // requests per day
  "expiresAt": "2025-12-31T23:59:59Z", // optional
  "metadata": {
    "project": "Main Website",
    "contact": "developer@example.com"
  }
}

Response:
{
  "success": true,
  "data": {
    "id": "uuid",
    "key": "vf_live_1a2b3c4d5e6f7g8h9i0j...",
    "name": "Production Website",
    "environment": "live",
    "isActive": true,
    "allowedDomains": ["example.com", "*.example.com"],
    "rateLimit": 10000,
    "createdAt": "2025-11-03T10:00:00Z"
  }
}
```

#### 2. List All API Keys
```
GET /api/admin/widget-keys
Authorization: Bearer {admin_jwt_token}

Query Parameters:
- page: number (default: 1)
- limit: number (default: 20)
- environment: "live" | "test" | "all"
- isActive: boolean

Response:
{
  "success": true,
  "data": {
    "keys": [...],
    "total": 42,
    "page": 1,
    "limit": 20
  }
}
```

#### 3. Get API Key Details
```
GET /api/admin/widget-keys/:keyId
Authorization: Bearer {admin_jwt_token}

Response:
{
  "success": true,
  "data": {
    "id": "uuid",
    "key": "vf_live_...",
    "name": "Production Website",
    "environment": "live",
    "isActive": true,
    "allowedDomains": ["example.com"],
    "rateLimit": 10000,
    "lastUsedAt": "2025-11-03T09:30:00Z",
    "createdAt": "2025-01-01T00:00:00Z",
    "stats": {
      "totalRequests": 150000,
      "requestsToday": 1234,
      "requestsThisMonth": 45678
    }
  }
}
```

#### 4. Update API Key
```
PATCH /api/admin/widget-keys/:keyId
Authorization: Bearer {admin_jwt_token}

Request Body:
{
  "name": "Updated Name",
  "allowedDomains": ["newdomain.com"],
  "rateLimit": 20000,
  "isActive": false // Revoke access
}

Response:
{
  "success": true,
  "data": { /* updated key */ }
}
```

#### 5. Delete API Key
```
DELETE /api/admin/widget-keys/:keyId
Authorization: Bearer {admin_jwt_token}

Response:
{
  "success": true,
  "message": "API Key deleted successfully"
}
```

#### 6. Get Usage Analytics
```
GET /api/admin/widget-keys/:keyId/analytics
Authorization: Bearer {admin_jwt_token}

Query Parameters:
- startDate: ISO8601 date
- endDate: ISO8601 date
- groupBy: "hour" | "day" | "week" | "month"

Response:
{
  "success": true,
  "data": {
    "summary": {
      "totalRequests": 150000,
      "uniqueDomains": 3,
      "avgResponseTime": 120,
      "errorRate": 0.02
    },
    "timeline": [
      {
        "date": "2025-11-01",
        "requests": 5000,
        "errors": 10,
        "avgResponseTime": 115
      },
      ...
    ],
    "topEndpoints": [
      { "endpoint": "/api/widget/strategies", "count": 50000 },
      { "endpoint": "/api/widget/tokens", "count": 45000 }
    ],
    "topDomains": [
      { "domain": "example.com", "count": 100000 },
      { "domain": "test.example.com", "count": 50000 }
    ]
  }
}
```

---

### **Widget Public Endpoints** (API Key Protected)

All widget endpoints require API Key in header:
```
X-Widget-API-Key: vf_live_1a2b3c4d5e6f7g8h9i0j...
```

#### Example Protected Endpoints:
```
GET /api/widget/strategies
GET /api/widget/tokens
POST /api/widget/prepare-transaction
POST /api/widget/track-referral
```

Middleware validates:
1. API Key exists and is active
2. Domain/Origin is allowed
3. Rate limit not exceeded
4. Key not expired
5. IP in whitelist (if configured)

---

## 🔐 Authentication Flow

### Widget Request Flow:

```
1. User embeds widget with API Key
   ↓
2. Widget makes API request with:
   - Header: X-Widget-API-Key: vf_live_...
   - Header: Origin: https://customer-site.com
   ↓
3. Backend Middleware validates:
   - API Key valid?
   - Domain allowed?
   - Rate limit OK?
   - Not expired?
   ↓
4. If valid:
   - Process request
   - Log usage to widget_api_key_usage
   - Return response
   ↓
5. If invalid:
   - Return 401/403 with error
   - Log failed attempt
```

### Middleware Validation Logic:

```typescript
@Injectable()
export class WidgetApiKeyGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-widget-api-key'];
    const origin = request.headers['origin'];
    const ip = request.ip;

    if (!apiKey) {
      throw new UnauthorizedException('API Key required');
    }

    // 1. Validate API Key
    const keyRecord = await this.findApiKey(apiKey);
    if (!keyRecord || !keyRecord.isActive) {
      throw new UnauthorizedException('Invalid or inactive API Key');
    }

    // 2. Check expiration
    if (keyRecord.expiresAt && new Date() > keyRecord.expiresAt) {
      throw new UnauthorizedException('API Key expired');
    }

    // 3. Validate domain/origin
    if (keyRecord.allowedOrigins?.length) {
      if (!this.isOriginAllowed(origin, keyRecord.allowedOrigins)) {
        throw new ForbiddenException('Origin not allowed');
      }
    }

    // 4. Validate IP (if whitelist configured)
    if (keyRecord.ipWhitelist?.length) {
      if (!keyRecord.ipWhitelist.includes(ip)) {
        throw new ForbiddenException('IP not whitelisted');
      }
    }

    // 5. Check rate limit
    const usageCount = await this.getTodayUsageCount(keyRecord.id);
    if (usageCount >= keyRecord.rateLimit) {
      throw new TooManyRequestsException('Rate limit exceeded');
    }

    // 6. Update last used timestamp
    await this.updateLastUsed(keyRecord.id);

    // 7. Attach to request for logging
    request.widgetApiKey = keyRecord;

    return true;
  }
}
```

---

## 🎨 Widget Integration

### For NPM Users (React):

```tsx
import { VaporStakingWidget } from '@vaporfund/staking-widget';
import '@vaporfund/staking-widget/styles.css';

function App() {
  return (
    <VaporStakingWidget
      apiKey="vf_live_1a2b3c4d5e6f7g8h9i0j..."
      network="ethereum"
      theme="dark"
    />
  );
}
```

### For CDN Users (Vanilla JS):

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
      apiKey: 'vf_live_1a2b3c4d5e6f7g8h9i0j...',
      network: 'ethereum',
      theme: 'dark'
    });
  </script>
</body>
</html>
```

### Widget API Client Update:

```typescript
// src/lib/api/client.ts
class ApiClient {
  private client: AxiosInstance;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: TIMEOUTS.API_REQUEST,
      headers: {
        'Content-Type': 'application/json',
        'X-Widget-API-Key': apiKey, // ← Changed from Bearer token
      },
    });

    // Add request interceptor to include origin
    this.client.interceptors.request.use((config) => {
      config.headers['X-Widget-Origin'] = window.location.origin;
      return config;
    });

    // Error handling with user-friendly messages
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          throw new Error('Invalid API Key. Please check your configuration.');
        }
        if (error.response?.status === 403) {
          throw new Error('This domain is not authorized to use this API Key.');
        }
        if (error.response?.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }
        return Promise.reject(error);
      }
    );
  }
}
```

---

## 📊 Rate Limiting & Monitoring

### Rate Limiting Strategy:

1. **Simple Daily Limit** (MVP)
   - Count requests per API Key per day
   - Reset at midnight UTC
   - Configurable limit per key

2. **Advanced (Future)**
   - Sliding window algorithm
   - Different limits for different endpoints
   - Burst allowance

### Implementation:

```typescript
@Injectable()
export class RateLimitService {
  async checkRateLimit(apiKeyId: string, limit: number): Promise<boolean> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const count = await this.usageRepository.count({
      where: {
        apiKeyId,
        timestamp: MoreThan(today),
      },
    });

    return count < limit;
  }

  async getRemainingRequests(apiKeyId: string, limit: number): Promise<number> {
    const used = await this.getTodayUsageCount(apiKeyId);
    return Math.max(0, limit - used);
  }
}
```

### Response Headers:

```
X-RateLimit-Limit: 10000
X-RateLimit-Remaining: 9876
X-RateLimit-Reset: 2025-11-04T00:00:00Z
```

---

## 🔒 Security Considerations

### 1. API Key Generation
```typescript
function generateApiKey(environment: 'live' | 'test'): string {
  const prefix = environment === 'live' ? 'vf_live_' : 'vf_test_';
  const randomBytes = crypto.randomBytes(32);
  const key = randomBytes.toString('base64url'); // URL-safe base64
  return `${prefix}${key}`;
}
```

### 2. Key Storage
- Store hashed version in database (optional for extra security)
- Show full key only once during creation
- Admin can regenerate but not view original

### 3. Domain Validation
- Support wildcards: `*.example.com`
- Strict origin checking
- Case-insensitive matching

### 4. HTTPS Only
- Reject requests from non-HTTPS origins (except localhost)
- Add warning in documentation

### 5. Audit Logging
- Log all key creation/deletion
- Log failed authentication attempts
- Alert on suspicious activity

### 6. Key Rotation
- Recommend regular key rotation
- Support multiple active keys per owner
- Graceful deprecation period

---

## 🚀 Implementation Roadmap

### Phase 1: Core Functionality (Week 1)
- [ ] Database schema implementation
- [ ] Basic CRUD endpoints for API Keys
- [ ] API Key validation middleware
- [ ] Widget client integration

### Phase 2: Admin Dashboard (Week 2)
- [ ] Admin UI for key management
- [ ] Key creation wizard
- [ ] Basic usage statistics view

### Phase 3: Analytics & Monitoring (Week 3)
- [ ] Usage tracking implementation
- [ ] Analytics dashboard
- [ ] Rate limiting enforcement
- [ ] Alert system for anomalies

### Phase 4: Advanced Features (Week 4+)
- [ ] Domain wildcard support
- [ ] IP whitelisting
- [ ] Advanced rate limiting (sliding window)
- [ ] Webhook notifications
- [ ] Key rotation automation
- [ ] Usage quotas and billing integration

---

## 📝 Example Use Cases

### Use Case 1: Production Website
```json
{
  "name": "Main Production Website",
  "environment": "live",
  "allowedDomains": ["vaporfund.com", "www.vaporfund.com"],
  "rateLimit": 100000,
  "metadata": {
    "team": "Frontend",
    "contact": "frontend@vaporfund.com"
  }
}
```

### Use Case 2: Partner Integration
```json
{
  "name": "Partner ABC Integration",
  "environment": "live",
  "allowedDomains": ["*.partnerabc.com"],
  "rateLimit": 50000,
  "expiresAt": "2026-01-01T00:00:00Z",
  "metadata": {
    "partner": "ABC Corp",
    "contract": "CONTRACT-2025-001"
  }
}
```

### Use Case 3: Development/Testing
```json
{
  "name": "Development Environment",
  "environment": "test",
  "allowedDomains": ["localhost", "*.dev.vaporfund.com"],
  "rateLimit": 10000,
  "metadata": {
    "purpose": "development"
  }
}
```

---

## 🔧 Configuration

### Environment Variables:

```env
# Widget API Key Settings
WIDGET_API_KEY_ENABLED=true
WIDGET_API_KEY_DEFAULT_RATE_LIMIT=10000
WIDGET_API_KEY_MAX_RATE_LIMIT=1000000
WIDGET_API_KEY_USAGE_RETENTION_DAYS=90

# Security
WIDGET_API_KEY_REQUIRE_HTTPS=true
WIDGET_API_KEY_ALLOW_LOCALHOST=true
```

---

## 📚 Documentation for Developers

### Getting Your API Key:

1. Login to Admin Dashboard
2. Navigate to "Widget Settings" → "API Keys"
3. Click "Create New API Key"
4. Configure:
   - Name your key
   - Add allowed domains
   - Set rate limit
5. Copy the key (shown only once!)
6. Add to your widget configuration

### Testing Your Integration:

```bash
# Test with curl
curl -H "X-Widget-API-Key: vf_test_..." \
     -H "Origin: https://your-site.com" \
     https://api.vaporfund.com/api/widget/strategies
```

### Common Errors:

| Status | Error | Solution |
|--------|-------|----------|
| 401 | Invalid API Key | Check that key is correct and active |
| 403 | Origin not allowed | Add your domain to allowed domains |
| 429 | Rate limit exceeded | Wait or request limit increase |
| 403 | Key expired | Generate new key |

---

## 📊 Metrics & KPIs

### Track:
- Total active API keys
- Requests per key per day
- Error rates by key
- Most popular endpoints
- Geographic distribution of requests
- Response time by key

### Alerts:
- Unusual spike in requests (potential attack)
- High error rate (potential integration issue)
- Key nearing rate limit
- Failed authentication attempts

---

## 🎓 Best Practices

### For Admins:
1. Use descriptive names for keys
2. Set appropriate rate limits
3. Regularly audit unused keys
4. Rotate keys periodically
5. Use `test` environment for development

### For Widget Users:
1. Keep API key secure (don't commit to public repos)
2. Use environment variables
3. Monitor usage in dashboard
4. Request new key if compromised
5. Test thoroughly in `test` environment first

---

## 🔮 Future Enhancements

1. **Usage-Based Billing**
   - Track usage for billing purposes
   - Different pricing tiers

2. **Advanced Analytics**
   - Geographic heatmap
   - User behavior tracking
   - Conversion funnels

3. **API Key Scopes**
   - Limit keys to specific endpoints
   - Read-only vs read-write

4. **Webhooks**
   - Notify on specific events
   - Custom integrations

5. **Multi-tenancy**
   - Organization-level key management
   - Team collaboration

6. **CDN Integration**
   - Cache static responses
   - Reduce backend load

---

## 📞 Support

For questions or issues:
- Documentation: https://docs.vaporfund.com/widget/api-keys
- Support: support@vaporfund.com
- GitHub Issues: https://github.com/vaporfund/vaporfund-staking-platform/issues

---

**Document Version:** 1.0
**Last Updated:** November 3, 2025
**Author:** VaporFund Engineering Team
