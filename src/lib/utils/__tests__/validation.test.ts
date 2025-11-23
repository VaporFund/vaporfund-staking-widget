import { describe, it, expect } from 'vitest';
import {
  validateStakeAmount,
  isValidAddress,
  isValidApiKey,
  isValidTxHash,
  sanitizeInput,
} from '../validation';
import { ErrorCode } from '@/types';

describe('Validation Utils', () => {
  describe('validateStakeAmount', () => {
    it('should validate minimum stake amount', () => {
      const result = validateStakeAmount('5', '100');
      expect(result).not.toBeNull();
      expect(result?.code).toBe(ErrorCode.AMOUNT_TOO_LOW);
    });

    it('should validate maximum stake amount', () => {
      const result = validateStakeAmount('200000', '100');
      expect(result).not.toBeNull();
      expect(result?.code).toBe(ErrorCode.AMOUNT_TOO_HIGH);
    });

    it('should validate insufficient balance', () => {
      const result = validateStakeAmount('100', '50');
      expect(result).not.toBeNull();
      expect(result?.code).toBe(ErrorCode.INSUFFICIENT_BALANCE);
    });

    it('should pass valid amount', () => {
      const result = validateStakeAmount('50', '100');
      expect(result).toBeNull();
    });

    it('should reject invalid numbers', () => {
      const result = validateStakeAmount('abc', '100');
      expect(result).not.toBeNull();
      expect(result?.code).toBe(ErrorCode.AMOUNT_TOO_LOW);
    });

    it('should reject zero amount', () => {
      const result = validateStakeAmount('0', '100');
      expect(result).not.toBeNull();
    });

    it('should reject negative amount', () => {
      const result = validateStakeAmount('-10', '100');
      expect(result).not.toBeNull();
    });
  });

  describe('isValidAddress', () => {
    it('should validate correct Ethereum address', () => {
      expect(isValidAddress('0x1234567890123456789012345678901234567890')).toBe(true);
    });

    it('should reject invalid address format', () => {
      expect(isValidAddress('0x123')).toBe(false);
      expect(isValidAddress('1234567890123456789012345678901234567890')).toBe(false);
      expect(isValidAddress('0xGGGG567890123456789012345678901234567890')).toBe(false);
    });

    it('should accept mixed case addresses', () => {
      expect(isValidAddress('0xAbCdEf1234567890123456789012345678901234')).toBe(true);
    });
  });

  describe('isValidApiKey', () => {
    it('should validate live API key', () => {
      // Format: vf_live_<40 base64url chars>
      expect(isValidApiKey('vf_live_9U15TPLnRHZz-TRpNi8guy3RzeH6xJp0RdQhnabq')).toBe(true);
      expect(isValidApiKey('vf_live_AbCdEf123456789012345678901234567890')).toBe(true);
    });

    it('should validate test API key', () => {
      // Format: vf_test_<40 base64url chars>
      expect(isValidApiKey('vf_test_9U15TPLnRHZz-TRpNi8guy3RzeH6xJp0RdQhnabq')).toBe(true);
      expect(isValidApiKey('vf_test_AbCdEf123456789012345678901234567890')).toBe(true);
    });

    it('should reject invalid format', () => {
      expect(isValidApiKey('invalid_key')).toBe(false);
      expect(isValidApiKey('vf_live_short')).toBe(false); // Too short
      expect(isValidApiKey('vf_test_9U15TPLnRHZz-TRpNi8guy3RzeH6xJp0RdQhnabqX')).toBe(false); // Too long (41 chars)
      expect(isValidApiKey('pk_live_12345678901234567890123456789012')).toBe(false); // Wrong prefix
      expect(isValidApiKey('vf_prod_12345678901234567890123456789012')).toBe(false); // Wrong environment
      expect(isValidApiKey('vf_live_9U15TPLnRHZz-TRpNi8guy3RzeH6xJp0RdQhnab!')).toBe(false); // Invalid character
    });
  });

  describe('isValidTxHash', () => {
    it('should validate transaction hash', () => {
      const hash = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
      expect(isValidTxHash(hash)).toBe(true);
    });

    it('should reject invalid hash', () => {
      expect(isValidTxHash('0x123')).toBe(false);
      expect(isValidTxHash('invalid')).toBe(false);
    });
  });

  describe('sanitizeInput', () => {
    it('should escape HTML characters', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe(
        '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;'
      );
    });

    it('should escape quotes', () => {
      expect(sanitizeInput('He said "hello"')).toBe('He said &quot;hello&quot;');
      expect(sanitizeInput("It's working")).toBe('It&#x27;s working');
    });

    it('should handle normal text', () => {
      expect(sanitizeInput('Normal text 123')).toBe('Normal text 123');
    });
  });
});
