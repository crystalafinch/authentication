import { describe, it, expect } from 'vitest';
import PASSWORD_CRITERIA from './password-criteria';

describe('PASSWORD_CRITERIA', () => {
  it('should have 4 criteria', () => {
    expect(PASSWORD_CRITERIA).toHaveLength(4);
  });

  it('should have correct structure for each criterion', () => {
    PASSWORD_CRITERIA.forEach((criterion, index) => {
      expect(criterion).toHaveProperty('text');
      expect(criterion).toHaveProperty('validator');
      expect(typeof criterion.text).toBe('string');
      expect(typeof criterion.validator).toBe('function');
    });
  });

  describe('length criterion', () => {
    const lengthCriterion = PASSWORD_CRITERIA[0];

    it('should have correct text', () => {
      expect(lengthCriterion?.text).toBe('At least 12 characters');
    });

    it('should validate passwords with 12 or more characters', () => {
      const validPasswords = [
        '123456789012',
        'abcdefghijkl',
        '!@#$%^&*()_+',
        'a'.repeat(12),
        'a'.repeat(100),
      ];

      validPasswords.forEach((password) => {
        expect(lengthCriterion?.validator(password)).toBe(true);
      });
    });

    it('should reject passwords with fewer than 12 characters', () => {
      const invalidPasswords = [
        '',
        'a',
        'ab',
        'abc',
        'abcd',
        'abcde',
        'abcdef',
        'abcdefg',
        'abcdefgh',
        'abcdefghi',
        'abcdefghij',
        'abcdefghijk',
      ];

      invalidPasswords.forEach((password) => {
        expect(lengthCriterion?.validator(password)).toBe(false);
      });
    });
  });

  describe('case mix criterion', () => {
    const caseCriterion = PASSWORD_CRITERIA[1];

    it('should have correct text', () => {
      expect(caseCriterion?.text).toBe(
        'A mix of uppercase and lowercase letters'
      );
    });

    it('should validate passwords with both uppercase and lowercase letters', () => {
      const validPasswords = [
        'aB',
        'Ab',
        'aBc',
        'AbC',
        'abcDEF',
        'ABCdef',
        'aBcDeF',
        'MixedCase',
        'UPPERlower',
        'lowerUPPER',
      ];

      validPasswords.forEach((password) => {
        expect(caseCriterion?.validator(password)).toBe(true);
      });
    });

    it('should reject passwords with only lowercase letters', () => {
      const invalidPasswords = [
        'a',
        'ab',
        'abc',
        'lowercase',
        'onlylowercase',
        'lower123',
        'lower!@#',
      ];

      invalidPasswords.forEach((password) => {
        expect(caseCriterion?.validator(password)).toBe(false);
      });
    });

    it('should reject passwords with only uppercase letters', () => {
      const invalidPasswords = [
        'A',
        'AB',
        'ABC',
        'UPPERCASE',
        'ONLYUPPERCASE',
        'UPPER123',
        'UPPER!@#',
      ];

      invalidPasswords.forEach((password) => {
        expect(caseCriterion?.validator(password)).toBe(false);
      });
    });

    it('should reject passwords with no letters', () => {
      const invalidPasswords = [
        '123',
        '!@#',
        '123!@#',
        '123456789',
        '!@#$%^&*()',
      ];

      invalidPasswords.forEach((password) => {
        expect(caseCriterion?.validator(password)).toBe(false);
      });
    });
  });

  describe('number criterion', () => {
    const numberCriterion = PASSWORD_CRITERIA[2];

    it('should have correct text', () => {
      expect(numberCriterion?.text).toBe('At least one number');
    });

    it('should validate passwords with at least one number', () => {
      const validPasswords = [
        '1',
        'a1',
        '1a',
        'a1b',
        'abc123',
        '123abc',
        'a1b2c3',
        'Password1',
        'MyPass123',
        '123!@#',
        '!@#123',
      ];

      validPasswords.forEach((password) => {
        expect(numberCriterion?.validator(password)).toBe(true);
      });
    });

    it('should reject passwords with no numbers', () => {
      const invalidPasswords = [
        '',
        'a',
        'ab',
        'abc',
        'password',
        'PASSWORD',
        'Password',
        '!@#',
        'abc!@#',
        '!@#abc',
      ];

      invalidPasswords.forEach((password) => {
        expect(numberCriterion?.validator(password)).toBe(false);
      });
    });

    it('should validate passwords with multiple numbers', () => {
      const validPasswords = [
        '12',
        '123',
        '1234',
        'a12',
        '12a',
        'a12b34',
        'Password123',
        'My123Pass',
      ];

      validPasswords.forEach((password) => {
        expect(numberCriterion?.validator(password)).toBe(true);
      });
    });
  });

  describe('special character criterion', () => {
    const specialCharCriterion = PASSWORD_CRITERIA[3];

    it('should have correct text', () => {
      expect(specialCharCriterion?.text).toBe(
        'At least one special character e.g. ! $'
      );
    });

    it('should validate passwords with at least one special character', () => {
      const validPasswords = [
        '!',
        'a!',
        '!a',
        'a!b',
        'abc!@#',
        '!@#abc',
        'a!b@c#',
        'Password!',
        'MyPass@',
        '123!',
        '!123',
      ];

      validPasswords.forEach((password) => {
        expect(specialCharCriterion?.validator(password)).toBe(true);
      });
    });

    it('should reject passwords with no special characters', () => {
      const invalidPasswords = [
        '',
        'a',
        'ab',
        'abc',
        'password',
        'PASSWORD',
        'Password',
        '123',
        'abc123',
        '123abc',
        'Password123',
      ];

      invalidPasswords.forEach((password) => {
        expect(specialCharCriterion?.validator(password)).toBe(false);
      });
    });

    it('should validate passwords with various special characters', () => {
      const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

      specialChars.split('').forEach((char) => {
        const password = `a${char}`;
        expect(specialCharCriterion?.validator(password)).toBe(true);
      });
    });

    it('should validate passwords with multiple special characters', () => {
      const validPasswords = [
        '!@',
        '!@#',
        '!@#$',
        'a!@',
        '!@a',
        'a!@b#',
        'Password!@',
        'MyPass#@',
        '123!@',
        '!@123',
      ];

      validPasswords.forEach((password) => {
        expect(specialCharCriterion?.validator(password)).toBe(true);
      });
    });
  });

  describe('combined validation', () => {
    it('should validate passwords that meet all criteria', () => {
      const validPasswords = [
        'ValidPass1!',
        'AnotherPass2@',
        'SecurePwd3#',
        'ComplexPwd4$',
        'MyPwd5%',
        'TestPass6^',
        'SamplePwd7&',
        'ExamplePwd8*',
      ];

      const validPasswords12Plus = validPasswords.filter(
        (pwd) => pwd.length >= 12
      );

      validPasswords12Plus.forEach((password) => {
        const allValid = PASSWORD_CRITERIA.every((criterion) =>
          criterion.validator(password)
        );
        expect(allValid).toBe(true);
      });
    });

    it('should reject passwords that fail any criterion', () => {
      const invalidPasswords = [
        'short', 
        'SHORT',
        '123456',
        '!@#$%^',
        'lowercase123!',
        'UPPERCASE123!',
        'MixedCase!',
        'MixedCase123',
        'MixedCase!@#',
      ];

      invalidPasswords.forEach((password) => {
        const allValid = PASSWORD_CRITERIA.every((criterion) =>
          criterion.validator(password)
        );
        expect(allValid).toBe(false);
      });
    });

    it('should work with the every method as expected', () => {
      const validPassword = 'ValidPass1!@';
      const lengthValid = PASSWORD_CRITERIA[0]?.validator(validPassword);
      const caseValid = PASSWORD_CRITERIA[1]?.validator(validPassword);
      const numberValid = PASSWORD_CRITERIA[2]?.validator(validPassword);
      const specialValid = PASSWORD_CRITERIA[3]?.validator(validPassword);

      expect(lengthValid).toBe(true);
      expect(caseValid).toBe(true);
      expect(numberValid).toBe(true);
      expect(specialValid).toBe(true);

      const isValid = PASSWORD_CRITERIA.every((criterion) =>
        criterion.validator(validPassword)
      );
      expect(isValid).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle empty string', () => {
      PASSWORD_CRITERIA.forEach((criterion) => {
        expect(criterion.validator('')).toBe(false);
      });
    });

    it('should handle very long passwords', () => {
      const longPassword = 'ValidPass1!' + 'a'.repeat(1000);

      PASSWORD_CRITERIA.forEach((criterion) => {
        expect(criterion.validator(longPassword)).toBe(true);
      });
    });

    it('should handle passwords with only special characters and numbers', () => {
      const specialPassword = '!@#$%^&*()123';

      const caseCriterion = PASSWORD_CRITERIA[1];
      expect(caseCriterion?.validator(specialPassword)).toBe(false);

      const lengthCriterion = PASSWORD_CRITERIA[0];
      const numberCriterion = PASSWORD_CRITERIA[2];
      const specialCharCriterion = PASSWORD_CRITERIA[3];

      expect(lengthCriterion?.validator(specialPassword)).toBe(true);
      expect(numberCriterion?.validator(specialPassword)).toBe(true);
      expect(specialCharCriterion?.validator(specialPassword)).toBe(true);
    });

    it('should handle passwords with only letters and numbers', () => {
      const alphanumericPassword = 'Password1234';

      const specialCharCriterion = PASSWORD_CRITERIA[3];
      expect(specialCharCriterion?.validator(alphanumericPassword)).toBe(false);

      const lengthCriterion = PASSWORD_CRITERIA[0];
      const caseCriterion = PASSWORD_CRITERIA[1];
      const numberCriterion = PASSWORD_CRITERIA[2];

      expect(lengthCriterion?.validator(alphanumericPassword)).toBe(true);
      expect(caseCriterion?.validator(alphanumericPassword)).toBe(true);
      expect(numberCriterion?.validator(alphanumericPassword)).toBe(true);
    });
  });
});
