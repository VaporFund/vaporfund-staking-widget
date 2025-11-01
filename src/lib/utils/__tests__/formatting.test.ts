import { describe, it, expect } from 'vitest';
import {
  formatUSD,
  formatNumber,
  truncateAddress,
  formatPercentage,
  formatTxHash,
  parseUnits,
  formatUnits,
  formatDate,
  formatTimeAgo,
} from '../formatting';

describe('Formatting Utils', () => {
  describe('formatUSD', () => {
    it('should format numbers as USD', () => {
      expect(formatUSD(1000)).toBe('$1,000.00');
      expect(formatUSD('1234.56')).toBe('$1,234.56');
      expect(formatUSD(0)).toBe('$0.00');
    });

    it('should handle decimals', () => {
      expect(formatUSD(1234.567)).toBe('$1,234.57'); // Rounds
      expect(formatUSD(0.99)).toBe('$0.99');
    });
  });

  describe('formatNumber', () => {
    it('should format numbers with commas', () => {
      expect(formatNumber(1000)).toBe('1,000.00');
      expect(formatNumber(1234567.89)).toBe('1,234,567.89');
    });

    it('should respect decimal places', () => {
      expect(formatNumber(123.456, 0)).toBe('123');
      expect(formatNumber(123.456, 3)).toBe('123.456');
      expect(formatNumber(123.456, 1)).toBe('123.5');
    });
  });

  describe('truncateAddress', () => {
    it('should truncate Ethereum address', () => {
      const address = '0x1234567890123456789012345678901234567890';
      expect(truncateAddress(address)).toBe('0x1234...7890');
    });

    it('should handle custom lengths', () => {
      const address = '0x1234567890123456789012345678901234567890';
      expect(truncateAddress(address, 8, 6)).toBe('0x123456...567890');
    });

    it('should return original if too short', () => {
      expect(truncateAddress('0x123')).toBe('0x123');
    });

    it('should handle empty string', () => {
      expect(truncateAddress('')).toBe('');
    });
  });

  describe('formatPercentage', () => {
    it('should format percentage', () => {
      expect(formatPercentage(5.5)).toBe('5.50%');
      expect(formatPercentage('10')).toBe('10.00%');
    });

    it('should respect decimal places', () => {
      expect(formatPercentage(5.555, 1)).toBe('5.6%');
      expect(formatPercentage(5.555, 3)).toBe('5.555%');
    });
  });

  describe('formatTxHash', () => {
    it('should format transaction hash with explorer link', () => {
      const hash = '0x1234567890abcdef';
      const explorer = 'https://etherscan.io';
      expect(formatTxHash(hash, explorer)).toBe(`${explorer}/tx/${hash}`);
    });
  });

  describe('parseUnits', () => {
    it('should parse decimal to wei', () => {
      expect(parseUnits('1', 18)).toBe(BigInt('1000000000000000000'));
      expect(parseUnits('0.5', 18)).toBe(BigInt('500000000000000000'));
      expect(parseUnits('1000', 6)).toBe(BigInt('1000000000'));
    });

    it('should handle decimal precision', () => {
      expect(parseUnits('1.234567', 6)).toBe(BigInt('1234567'));
      expect(parseUnits('1.23456789', 6)).toBe(BigInt('1234567')); // Truncates
    });
  });

  describe('formatUnits', () => {
    it('should format wei to decimal', () => {
      expect(formatUnits(BigInt('1000000000000000000'), 18)).toBe('1');
      expect(formatUnits(BigInt('500000000000000000'), 18)).toBe('0.5');
      expect(formatUnits(BigInt('1000000000'), 6)).toBe('1000');
    });

    it('should remove trailing zeros', () => {
      expect(formatUnits(BigInt('1000000'), 6)).toBe('1');
      expect(formatUnits(BigInt('1500000'), 6)).toBe('1.5');
    });
  });

  describe('formatDate', () => {
    it('should format Unix timestamp', () => {
      const timestamp = 1640995200; // Jan 1, 2022 00:00:00 UTC
      const formatted = formatDate(timestamp);
      expect(formatted).toMatch(/Jan/);
      expect(formatted).toMatch(/2022/);
    });
  });

  describe('formatTimeAgo', () => {
    it('should format recent time', () => {
      const now = Math.floor(Date.now() / 1000);
      expect(formatTimeAgo(now - 30)).toBe('just now');
      expect(formatTimeAgo(now - 120)).toMatch(/2 minutes ago/);
      expect(formatTimeAgo(now - 7200)).toMatch(/2 hours ago/);
      expect(formatTimeAgo(now - 172800)).toMatch(/2 days ago/);
    });
  });
});
