import { describe, it, expect } from 'vitest';
import { CreateAccountSchema } from './create-account';
import PASSWORD_CRITERIA from '@/consts/password-criteria';

describe('CreateAccountSchema', () => {
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
        const result = CreateAccountSchema.safeParse({
          email,
          password: 'ValidPassword123!',
        });
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid email addresses', () => {
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'user@',
        'user@.com',
        'user@example..com',
        'user name@example.com',
        'user@example com',
        '',
      ];

      invalidEmails.forEach((email) => {
        const result = CreateAccountSchema.safeParse({
          email,
          password: 'ValidPassword123!',
        });
        expect(result.success).toBe(false);
        expect(result.error?.issues[0]?.message).toBe('Invalid email address');
      });
    });
  });

  describe('password validation', () => {
    it('should validate passwords that meet all criteria', () => {
      const validPasswords = [
        'ValidPassword123!',
        'AnotherPass456@',
        'SecurePwd789#',
        'ComplexPwd2024$',
      ];

      validPasswords.forEach((password) => {
        const result = CreateAccountSchema.safeParse({
          email: 'test@example.com',
          password,
        });
        expect(result.success).toBe(true);
      });
    });

    it('should reject passwords that are too short', () => {
      const shortPasswords = ['Short1!', 'Abc123!', 'Test1!', 'A1!'];

      shortPasswords.forEach((password) => {
        const result = CreateAccountSchema.safeParse({
          email: 'test@example.com',
          password,
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0]?.message).toBe(
            'Password does not meet the requirements'
          );
        }
      });
    });

    it('should reject passwords without uppercase letters', () => {
      const noUppercasePasswords = [
        'lowercase123!',
        'alllowercase!',
        'lower123!',
      ];

      noUppercasePasswords.forEach((password) => {
        const result = CreateAccountSchema.safeParse({
          email: 'test@example.com',
          password,
        });
        expect(result.success).toBe(false);
      });
    });

    it('should reject passwords without lowercase letters', () => {
      const noLowercasePasswords = [
        'UPPERCASE123!',
        'ALLUPPERCASE!',
        'UPPER123!',
      ];

      noLowercasePasswords.forEach((password) => {
        const result = CreateAccountSchema.safeParse({
          email: 'test@example.com',
          password,
        });
        expect(result.success).toBe(false);
      });
    });

    it('should reject passwords without numbers', () => {
      const noNumberPasswords = ['NoNumbers!', 'OnlyLetters!', 'JustSymbols!'];

      noNumberPasswords.forEach((password) => {
        const result = CreateAccountSchema.safeParse({
          email: 'test@example.com',
          password,
        });
        expect(result.success).toBe(false);
      });
    });

    it('should reject passwords without special characters', () => {
      const noSpecialCharPasswords = [
        'NoSpecialChars123',
        'OnlyLettersAndNumbers123',
        'JustAlphanumeric123',
      ];

      noSpecialCharPasswords.forEach((password) => {
        const result = CreateAccountSchema.safeParse({
          email: 'test@example.com',
          password,
        });
        expect(result.success).toBe(false);
      });
    });

    it('should reject passwords missing multiple criteria', () => {
      const invalidPasswords = [
        'short',
        'SHORT',
        '123456',
        '!@#$%^',
      ];

      invalidPasswords.forEach((password) => {
        const result = CreateAccountSchema.safeParse({
          email: 'test@example.com',
          password,
        });
        expect(result.success).toBe(false);
      });
    });
  });

  describe('password criteria validation', () => {
    it('should validate password with exactly 12 characters', () => {
      const password = 'ValidPass1!@';
      expect(password.length).toBe(12);

      const result = CreateAccountSchema.safeParse({
        email: 'test@example.com',
        password,
      });

      expect(result.success).toBe(true);
    });

    it('should validate password with mixed case letters', () => {
      const password = 'MixedCase123!';

      const result = CreateAccountSchema.safeParse({
        email: 'test@example.com',
        password,
      });
      expect(result.success).toBe(true);
    });

    it('should validate password with various special characters', () => {
      const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

      specialChars.split('').forEach((char) => {
        const password = `ExampleValidPass1${char}`;
        const result = CreateAccountSchema.safeParse({
          email: 'test@example.com',
          password,
        });
        expect(result.success).toBe(true);
      });
    });

    it('should validate password with various numbers', () => {
      const numbers = '0123456789';

      numbers.split('').forEach((num) => {
        const password = `ExampleValidPass${num}!`;
        const result = CreateAccountSchema.safeParse({
          email: 'test@example.com',
          password,
        });
        expect(result.success).toBe(true);
      });
    });
  });

  describe('complete form validation', () => {
    it('should validate complete valid form data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'ValidPassword123!',
      };

      const result = CreateAccountSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('should reject form with missing email', () => {
      const invalidData = {
        password: 'ValidPassword123!',
      };

      const result = CreateAccountSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject form with missing password', () => {
      const invalidData = {
        email: 'test@example.com',
      };

      const result = CreateAccountSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject completely empty form', () => {
      const invalidData = {};

      const result = CreateAccountSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject form with both fields invalid', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'short',
      };

      const result = CreateAccountSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toHaveLength(2);
      }
    });
  });

  describe('edge cases', () => {
    it('should handle very long email addresses', () => {
      const longEmail = 'a'.repeat(100) + '@example.com';
      const result = CreateAccountSchema.safeParse({
        email: longEmail,
        password: 'ValidPassword123!',
      });
      expect(result.success).toBe(true);
    });

    it('should handle very long valid passwords', () => {
      const longPassword = 'ValidPassword123!' + 'a'.repeat(100);
      const result = CreateAccountSchema.safeParse({
        email: 'test@example.com',
        password: longPassword,
      });
      expect(result.success).toBe(true);
    });

    it('should handle special characters in email', () => {
      const specialEmail = 'user+tag!#$%&*@example.com';
      const result = CreateAccountSchema.safeParse({
        email: specialEmail,
        password: 'ValidPassword123!',
      });
      expect(result.success).toBe(true);
    });

    it('should handle complex password patterns', () => {
      const complexPasswords = [
        'ExampleP@ssw0rd!',
        'ExampleStr0ng#P@ss',
        'ExampleC0mpl3x!P@ss',
        'ExampleS3cur3!P@ssw0rd',
      ];

      complexPasswords.forEach((password) => {
        const result = CreateAccountSchema.safeParse({
          email: 'test@example.com',
          password,
        });
        expect(result.success).toBe(true);
      });
    });
  });
});
