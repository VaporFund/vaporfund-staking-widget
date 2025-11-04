# VaporFund Staking Widget - CDN Usage Guide

**Version**: 0.1.0
**Bundle Size**: 470 KB (164 KB gzipped)
**Last Updated**: November 3, 2025

---

## 📦 Quick Start

Add the widget to your website with just 2 lines of code:

```html
<div id="vapor-staking"></div>
<script src="https://cdn.vaporfund.com/widget/v1.min.js"></script>
<script>
  VaporWidget.init({
    container: '#vapor-staking',
    apiKey: 'vf_test_xxxxx'
  });
</script>
```

---

## 📥 Installation Methods

### Method 1: JavaScript API (Recommended)

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Staking Page</title>
  <!-- Optional: Load CSS separately for better control -->
  <link rel="stylesheet" href="https://cdn.vaporfund.com/widget/v1/style.css">
</head>
<body>
  <!-- Widget Container -->
  <div id="vapor-staking-widget"></div>

  <!-- Load Widget Script -->
  <script src="https://cdn.vaporfund.com/widget/v1.min.js"></script>

  <!-- Initialize Widget -->
  <script>
    VaporWidget.init({
      container: '#vapor-staking-widget',
      apiKey: 'vf_test_9U15TPLnRHZz-TRpNi8guy3RzeH6xJp0RdQhnabq',
      network: 'sepolia',
      theme: 'dark',
      onSuccess: function(tx) {
        console.log('Staking successful!', tx);
      },
      onError: function(error) {
        console.error('Error:', error);
      }
    });
  </script>
</body>
</html>
```

### Method 2: Auto-Initialize with Data Attributes

Easiest method - just add data attributes:

```html
<!-- Widget will auto-initialize on page load -->
<div
  data-vapor-widget
  data-api-key="vf_test_xxxxx"
  data-network="sepolia"
  data-theme="dark"
  data-referral-code="partner_123"
></div>

<script src="https://cdn.vaporfund.com/widget/v1.min.js"></script>
```

### Method 3: Dynamic Loading

Load the widget dynamically with JavaScript:

```html
<div id="my-widget"></div>

<script>
  // Load widget script dynamically
  const script = document.createElement('script');
  script.src = 'https://cdn.vaporfund.com/widget/v1.min.js';
  script.onload = function() {
    VaporWidget.init({
      container: '#my-widget',
      apiKey: 'vf_test_xxxxx',
      network: 'sepolia'
    });
  };
  document.head.appendChild(script);
</script>
```

---

## ⚙️ Configuration Options

### Required Options

| Option | Type | Description |
|--------|------|-------------|
| `container` | `string \| HTMLElement` | CSS selector or DOM element for widget container |
| `apiKey` | `string` | Your VaporFund API key (`vf_test_xxx` or `vf_live_xxx`) |

### Optional Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `network` | `'mainnet' \| 'sepolia'` | `'mainnet'` | Ethereum network |
| `theme` | `'light' \| 'dark' \| 'auto'` | `'auto'` | Widget theme |
| `compact` | `boolean` | `false` | Enable compact layout |
| `defaultToken` | `string` | `'USDC'` | Pre-selected token |
| `defaultStrategy` | `string` | `undefined` | Pre-selected strategy |
| `referralCode` | `string` | `undefined` | Partner referral code |
| `customColors` | `object` | `undefined` | Custom color overrides |
| `locale` | `string` | `'en'` | Language (en only for now) |
| `onSuccess` | `function` | `undefined` | Success callback |
| `onError` | `function` | `undefined` | Error callback |

### Example with All Options

```javascript
VaporWidget.init({
  container: '#my-widget',
  apiKey: 'vf_test_xxxxx',
  network: 'sepolia',
  theme: 'dark',
  compact: false,
  defaultToken: 'USDC',
  referralCode: 'partner_123',
  customColors: {
    primary: '#6366f1',
    background: '#1a1a1a',
    text: '#ffffff'
  },
  onSuccess: function(tx) {
    console.log('Success!', {
      hash: tx.hash,
      amount: tx.amount,
      token: tx.token
    });
  },
  onError: function(error) {
    console.error('Error:', error.message);
  }
});
```

---

## 🎨 Theming

### Pre-built Themes

```javascript
// Light theme
VaporWidget.init({
  container: '#widget',
  apiKey: 'vf_test_xxxxx',
  theme: 'light'
});

// Dark theme
VaporWidget.init({
  container: '#widget',
  apiKey: 'vf_test_xxxxx',
  theme: 'dark'
});

// Auto (follows system preference)
VaporWidget.init({
  container: '#widget',
  apiKey: 'vf_test_xxxxx',
  theme: 'auto'
});
```

### Custom Colors

```javascript
VaporWidget.init({
  container: '#widget',
  apiKey: 'vf_test_xxxxx',
  customColors: {
    primary: '#6366f1',           // Main accent color
    background: '#ffffff',        // Widget background
    backgroundSecondary: '#f3f4f6', // Secondary surfaces
    text: '#111827',              // Primary text
    textSecondary: '#6b7280',     // Secondary text
    accent: '#8b5cf6',            // Accent elements
    success: '#10b981',           // Success messages
    error: '#ef4444',             // Error messages
    warning: '#f59e0b'            // Warning messages
  }
});
```

---

## 🔧 API Methods

### VaporWidget.init(config)

Initialize a new widget instance.

```javascript
const instance = VaporWidget.init({
  container: '#widget',
  apiKey: 'vf_test_xxxxx'
});
```

**Returns**: `WidgetInstance | null`

### VaporWidget.destroy(container)

Destroy a widget instance and clean up.

```javascript
VaporWidget.destroy('#widget');
```

**Returns**: `boolean` (true if successful)

### VaporWidget.update(container, config)

Update an existing widget's configuration.

```javascript
VaporWidget.update('#widget', {
  theme: 'dark',
  network: 'mainnet'
});
```

**Returns**: `boolean` (true if successful)

### VaporWidget.getInstances()

Get all active widget instances.

```javascript
const instances = VaporWidget.getInstances();
console.log(`${instances.length} widgets active`);
```

**Returns**: `WidgetInstance[]`

### VaporWidget.getVersion()

Get the widget version.

```javascript
console.log('Version:', VaporWidget.getVersion());
// Output: "0.1.0"
```

**Returns**: `string`

### VaporWidget.autoInit()

Manually trigger auto-initialization of widgets with data attributes.

```javascript
VaporWidget.autoInit();
```

**Note**: This is called automatically on page load.

---

## 📱 Responsive Design

The widget is fully responsive and works on all device sizes:

```css
/* The widget adapts to its container */
#vapor-staking-widget {
  width: 100%;
  max-width: 600px; /* Optional: constrain max width */
  margin: 0 auto;   /* Optional: center widget */
}

/* Mobile optimization */
@media (max-width: 768px) {
  #vapor-staking-widget {
    padding: 10px;
  }
}
```

---

## 🎯 Use Cases

### 1. Simple Integration

Perfect for landing pages or simple websites:

```html
<div id="staking"></div>
<script src="https://cdn.vaporfund.com/widget/v1.min.js"></script>
<script>
  VaporWidget.init({
    container: '#staking',
    apiKey: 'vf_test_xxxxx'
  });
</script>
```

### 2. WordPress Integration

Add to your WordPress theme:

```php
// In your theme's functions.php or plugin
function add_vapor_widget_shortcode($atts) {
    $atts = shortcode_atts(array(
        'api_key' => '',
        'theme' => 'auto',
        'network' => 'mainnet'
    ), $atts);

    wp_enqueue_script('vapor-widget',
        'https://cdn.vaporfund.com/widget/v1.min.js',
        array(), '1.0.0', true);

    $widget_id = 'vapor-widget-' . uniqid();

    ob_start();
    ?>
    <div id="<?php echo esc_attr($widget_id); ?>"></div>
    <script>
    document.addEventListener('DOMContentLoaded', function() {
        VaporWidget.init({
            container: '#<?php echo esc_js($widget_id); ?>',
            apiKey: '<?php echo esc_js($atts['api_key']); ?>',
            theme: '<?php echo esc_js($atts['theme']); ?>',
            network: '<?php echo esc_js($atts['network']); ?>'
        });
    });
    </script>
    <?php
    return ob_get_clean();
}
add_shortcode('vapor_staking', 'add_vapor_widget_shortcode');
```

**Usage**: `[vapor_staking api_key="vf_test_xxxxx" theme="dark"]`

### 3. Multiple Widgets

Add multiple widgets on the same page:

```html
<!-- Widget 1: Default -->
<div id="widget-1"></div>

<!-- Widget 2: Compact -->
<div id="widget-2"></div>

<script src="https://cdn.vaporfund.com/widget/v1.min.js"></script>
<script>
  // Default widget
  VaporWidget.init({
    container: '#widget-1',
    apiKey: 'vf_test_xxxxx',
    theme: 'light'
  });

  // Compact widget
  VaporWidget.init({
    container: '#widget-2',
    apiKey: 'vf_test_xxxxx',
    theme: 'dark',
    compact: true
  });
</script>
```

### 4. Dynamic Widget Management

Dynamically create and destroy widgets:

```javascript
let activeWidget = null;

function showWidget() {
  if (activeWidget) return; // Already showing

  activeWidget = VaporWidget.init({
    container: '#dynamic-widget',
    apiKey: 'vf_test_xxxxx',
    theme: 'dark'
  });
}

function hideWidget() {
  if (!activeWidget) return;

  VaporWidget.destroy('#dynamic-widget');
  activeWidget = null;
}

// Usage
document.getElementById('show-btn').addEventListener('click', showWidget);
document.getElementById('hide-btn').addEventListener('click', hideWidget);
```

---

## 🔐 Security Best Practices

### 1. API Key Management

```javascript
// ❌ BAD: Hardcoded API key
VaporWidget.init({
  container: '#widget',
  apiKey: 'vf_live_actual_key_here' // Don't do this!
});

// ✅ GOOD: Load from server/environment
VaporWidget.init({
  container: '#widget',
  apiKey: window.VAPOR_API_KEY // Set by server-side template
});
```

### 2. HTTPS Only

Always use HTTPS in production:

```html
<!-- ❌ BAD -->
<script src="http://cdn.vaporfund.com/widget/v1.min.js"></script>

<!-- ✅ GOOD -->
<script src="https://cdn.vaporfund.com/widget/v1.min.js"></script>
```

### 3. Content Security Policy

Add CSP headers to allow widget resources:

```
Content-Security-Policy:
  script-src 'self' https://cdn.vaporfund.com;
  connect-src 'self' https://staking-api.vaporfund.com;
  img-src 'self' data:;
```

---

## 🧪 Testing

### Test on Sepolia Testnet

Before going live, test on Sepolia:

```javascript
VaporWidget.init({
  container: '#widget',
  apiKey: 'vf_test_xxxxx', // Use test API key
  network: 'sepolia',       // Important!
  theme: 'dark'
});
```

**Get Test Tokens:**
- Sepolia ETH: https://sepoliafaucet.com/
- Test USDC: https://faucet.circle.com/

---

## 🐛 Troubleshooting

### Widget Not Loading

**Problem**: Container stays empty

**Solution**:
1. Check browser console for errors
2. Ensure container exists before script loads
3. Verify API key is valid
4. Check network tab for failed requests

```javascript
// Add error handling
if (typeof VaporWidget === 'undefined') {
  console.error('VaporWidget not loaded!');
} else {
  const instance = VaporWidget.init({
    container: '#widget',
    apiKey: 'vf_test_xxxxx'
  });

  if (!instance) {
    console.error('Widget failed to initialize');
  }
}
```

### API Key Errors

**Problem**: "Invalid API key" or "Origin not allowed"

**Solution**:
1. Verify API key format (`vf_test_xxx` or `vf_live_xxx`)
2. Check if your domain is whitelisted
3. Ensure test key is used with `network: 'sepolia'`
4. Contact support to add your domain

### Styling Issues

**Problem**: Widget styles not applying

**Solution**:
1. Ensure CSS is loaded
2. Check for CSS conflicts
3. Load widget CSS explicitly

```html
<link rel="stylesheet" href="https://cdn.vaporfund.com/widget/v1/style.css">
```

---

## 📊 Performance

### Bundle Size

- **JavaScript**: 470 KB raw, 164 KB gzipped
- **CSS**: 17.5 KB raw, 3.86 KB gzipped
- **Total**: ~168 KB gzipped

### Loading Optimization

```html
<!-- Load widget script asynchronously -->
<script async src="https://cdn.vaporfund.com/widget/v1.min.js"></script>

<!-- Or defer loading -->
<script defer src="https://cdn.vaporfund.com/widget/v1.min.js"></script>

<!-- Initialize after load -->
<script>
  window.addEventListener('load', function() {
    if (typeof VaporWidget !== 'undefined') {
      VaporWidget.init({
        container: '#widget',
        apiKey: 'vf_test_xxxxx'
      });
    }
  });
</script>
```

---

## 🔗 CDN URLs

### Production CDN (Coming Soon)

```
https://cdn.vaporfund.com/widget/v1.min.js
https://cdn.vaporfund.com/widget/v1/style.css
```

### Self-Hosted

Build and host yourself:

```bash
# Build CDN version
yarn build:cdn

# Output: dist/cdn/
# - vaporfund-widget.min.js
# - vaporfund-widget.min.js.map
# - style.css

# Host these files on your CDN/server
```

---

## 📖 Examples

See the `/examples` directory for complete examples:

- **simple-cdn.html** - Basic integration
- **auto-init-cdn.html** - Auto-initialization with data attributes
- **cdn-example.html** - Advanced features and controls

---

## 🆘 Support

- **Documentation**: [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)
- **Email**: partners@vaporfund.com
- **Discord**: [discord.com/invite/qWXfwMz4pP](https://discord.com/invite/qWXfwMz4pP)
- **Issues**: [GitHub Issues](https://github.com/vaporfund/vaporfund-staking-widget/issues)

---

## 📝 License

MIT © VaporFund

---

**Ready to integrate?** Get your API key: partners@vaporfund.com
