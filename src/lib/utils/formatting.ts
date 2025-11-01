/**
 * Formats a number as USD currency
 */
export function formatUSD(amount: string | number): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

/**
 * Formats a number with commas
 */
export function formatNumber(value: string | number, decimals: number = 2): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

/**
 * Truncates an Ethereum address
 */
export function truncateAddress(address: string, startLength: number = 6, endLength: number = 4): string {
  if (!address) return '';
  if (address.length <= startLength + endLength) return address;
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
}

/**
 * Formats a percentage
 */
export function formatPercentage(value: string | number, decimals: number = 2): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return `${num.toFixed(decimals)}%`;
}

/**
 * Formats a transaction hash with link
 */
export function formatTxHash(hash: string, blockExplorer: string): string {
  return `${blockExplorer}/tx/${hash}`;
}

/**
 * Parses a decimal amount to wei (for ethers.js)
 */
export function parseUnits(value: string, decimals: number): bigint {
  const [integer, fraction = ''] = value.split('.');
  const paddedFraction = fraction.padEnd(decimals, '0').slice(0, decimals);
  return BigInt(integer + paddedFraction);
}

/**
 * Formats wei to decimal amount
 */
export function formatUnits(value: bigint, decimals: number): string {
  const str = value.toString().padStart(decimals + 1, '0');
  const integer = str.slice(0, -decimals) || '0';
  const fraction = str.slice(-decimals).replace(/0+$/, '');
  return fraction ? `${integer}.${fraction}` : integer;
}

/**
 * Formats a date timestamp
 */
export function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp * 1000));
}

/**
 * Formats time ago (e.g., "2 hours ago")
 */
export function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor(Date.now() / 1000 - timestamp);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
}
