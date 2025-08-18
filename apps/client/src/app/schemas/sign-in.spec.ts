import { describe, it, expect } from 'vitest';
import { SignInSchema } from './sign-in';

describe('SignInSchema', () => {
  describe('email validation', () => {
    it('should validate valid email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        '123@numbers.com',
        'user@subdomain.example.com',
      ];

      validEmails.forEach((email) => {
        const result = SignInSchema.safeParse({
          email,
          password: 'password123',
        });
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid email addresses', () => {
      const invalidEmails = [
        'notanemail',
        'missing@',
        '@missingdomain',
        'spaces @example.com',
        'multiple@@example.com',
        'invalid@.com',
        'invalid@domain.',
        'invalid@domain..com',
        'invalid@-domain.com',
        'invalid@domain-.com',
      ];

      invalidEmails.forEach((email) => {
        const result = SignInSchema.safeParse({
          email,
          password: 'password123',
        });
        expect(result.success).toBe(false);
        if (!result.success && result.error.issues[0]) {
          expect(result.error.issues[0].message).toBe('Invalid email');
        }
      });
    });

    it('should provide custom error message for empty email', () => {
      const result = SignInSchema.safeParse({
        email: '',
        password: 'password123',
      });
      expect(result.success).toBe(false);
      if (!result.success && result.error.issues[0]) {
        expect(result.error.issues[0].message).toBe('Email is required');
      }
    });
  });

  describe('password validation', () => {
    it('should validate non-empty passwords', () => {
      const validPasswords = [
        'password',
        '123456',
        'a',
        'very long password with spaces',
        '!@#$%^&*()',
      ];

      validPasswords.forEach((password) => {
        const result = SignInSchema.safeParse({
          email: 'test@example.com',
          password,
        });
        expect(result.success).toBe(true);
      });
    });

    it('should reject empty passwords', () => {
      const result = SignInSchema.safeParse({
        email: 'test@example.com',
        password: '',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error?.issues[0]?.message).toBe('Password is required');
      }
    });

    it('should reject undefined passwords', () => {
      const result = SignInSchema.safeParse({
        email: 'test@example.com',
        password: undefined,
      });
      expect(result.success).toBe(false);
    });

    it('should reject null passwords', () => {
      const result = SignInSchema.safeParse({
        email: 'test@example.com',
        password: null,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('complete form validation', () => {
    it('should validate complete valid form data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = SignInSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('should reject form with missing email', () => {
      const invalidData = {
        password: 'password123',
      };

      const result = SignInSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject form with missing password', () => {
      const invalidData = {
        email: 'test@example.com',
      };

      const result = SignInSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject completely empty form', () => {
      const invalidData = {};

      const result = SignInSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject form with both fields invalid', () => {
      const result = SignInSchema.safeParse({
        email: 'invalid-email',
        password: '',
      });
      expect(result.success).toBe(false);
      if (!result.success && result.error.issues[0]) {
        expect(result.error.issues[0].message).toBe('Invalid email');
      }
    });
  });

  describe('edge cases', () => {
    it('should handle very long email addresses', () => {
      const longEmail = 'a'.repeat(100) + '@example.com';
      const result = SignInSchema.safeParse({
        email: longEmail,
        password: 'password123',
      });
      expect(result.success).toBe(true);
    });

    it('should handle very long passwords', () => {
      const longPassword = 'a'.repeat(1000);
      const result = SignInSchema.safeParse({
        email: 'test@example.com',
        password: longPassword,
      });
      expect(result.success).toBe(true);
    });

    it('should handle special characters in email', () => {
      const specialEmail = 'user+tag!#$%&*@example.com';
      const result = SignInSchema.safeParse({
        email: specialEmail,
        password: 'password123',
      });
      expect(result.success).toBe(true);
    });

    it('should handle special characters in password', () => {
      const specialPassword = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      const result = SignInSchema.safeParse({
        email: 'test@example.com',
        password: specialPassword,
      });
      expect(result.success).toBe(true);
    });
  });
});
