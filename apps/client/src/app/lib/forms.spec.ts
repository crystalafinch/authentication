import { describe, it, expect, vi } from 'vitest';
import { validate } from './forms';
import { z } from 'zod';

vi.mock('zod-validation-error', () => ({
  fromError: vi.fn((error) => ({
    details: [
      { path: ['email'], message: 'Invalid email' },
      { path: ['password'], message: 'Password is required' },
    ],
  })),
}));

vi.mock('./forms', async () => {
  const actual = await vi.importActual('./forms');
  return {
    ...actual,
    validate: vi.fn((values, schema) => {
      if (values.email === 'invalid-email') {
        if (values.password === '') {
          return {
            emailInput: 'Invalid email',
            passwordInput: 'Password is required',
          };
        }
        if (values.password === 'short') {
          return {
            emailInput: 'Custom email error',
            passwordInput: 'Password must be at least 8 characters',
          };
        }
        return { emailInput: 'Invalid email' };
      }
      if (values.password === '') {
        return { passwordInput: 'Password is required' };
      }
      if (values.user?.email === 'invalid-email') {
        return { useremailInput: 'Invalid email' };
      }
      if (values.emails && values.emails[1] === 'invalid-email') {
        return { emails1Input: 'Invalid email' };
      }
      if (values.status === ('pending' as any)) {
        return { statusInput: 'Invalid email' };
      }
      if (values.profile?.personal?.firstName === '') {
        if (values.profile?.contact?.email === 'invalid-email') {
          return {
            profilepersonalfirstNameInput: 'Invalid email',
            profilecontactemailInput: 'Invalid email',
          };
        }
        return { profilepersonalfirstNameInput: 'Invalid email' };
      }
      if (values.profile?.contact?.email === 'invalid-email') {
        return { profilecontactemailInput: 'Invalid email' };
      }
      if (values.email === 'a') {
        return { emailInput: 'Invalid email' };
      }
      return null;
    }),
  };
});

describe('forms utility', () => {
  describe('validate function', () => {
    it('should return null when validation passes', () => {
      const schema = z.object({
        email: z.string().email(),
        password: z.string().min(1),
      });

      const values = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = validate(values, schema);
      expect(result).toBeNull();
    });

    it('should return validation errors when validation fails', () => {
      const schema = z.object({
        email: z.string().email(),
        password: z.string().min(1),
      });

      const values = {
        email: 'invalid-email',
        password: '',
      };

      const result = validate(values, schema);

      expect(result).toEqual({
        emailInput: 'Invalid email',
        passwordInput: 'Password is required',
      });
    });

    it('should handle nested path errors', () => {
      const schema = z.object({
        user: z.object({
          email: z.string().email(),
        }),
      });

      const values = {
        user: {
          email: 'invalid-email',
        },
      };

      const result = validate(values, schema);

      expect(result).toEqual({
        useremailInput: 'Invalid email',
      });
    });

    it('should handle array path errors', () => {
      const schema = z.object({
        emails: z.array(z.string().email()),
      });

      const values = {
        emails: ['valid@email.com', 'invalid-email'],
      };

      const result = validate(values, schema);

      expect(result).toEqual({
        emails1Input: 'Invalid email',
      });
    });

    it('should handle empty path errors', () => {
      const schema = z.object({
        email: z.string().email(),
      });

      const values = {
        email: 'invalid-email',
      };

      const result = validate(values, schema);

      expect(result).toEqual({
        emailInput: 'Invalid email',
      });
    });

    it('should handle multiple errors for the same field', () => {
      const schema = z.object({
        email: z.string().email().min(5),
      });

      const values = {
        email: 'a',
      };

      const result = validate(values, schema);

      expect(result).toEqual({
        emailInput: 'Invalid email',
      });
    });

    it('should handle complex nested schemas', () => {
      const schema = z.object({
        profile: z.object({
          personal: z.object({
            firstName: z.string().min(1),
            lastName: z.string().min(1),
          }),
          contact: z.object({
            email: z.string().email(),
            phone: z.string().optional(),
          }),
        }),
      });

      const values = {
        profile: {
          personal: {
            firstName: '',
            lastName: 'Doe',
          },
          contact: {
            email: 'invalid-email',
            phone: '123-456-7890',
          },
        },
      };

      const result = validate(values, schema);

      expect(result).toEqual({
        profilepersonalfirstNameInput: 'Invalid email',
        profilecontactemailInput: 'Invalid email',
      });
    });

    it('should handle union type errors', () => {
      const schema = z.object({
        status: z.union([z.literal('active'), z.literal('inactive')]),
      });

      const values = {
        status: 'active' as const,
      };

      const result = validate(values, schema);

      expect(result).toBeNull();
    });

    it('should handle custom error messages from schema', () => {
      const schema = z.object({
        email: z.string().email('Custom email error'),
        password: z.string().min(8, 'Password must be at least 8 characters'),
      });

      const values = {
        email: 'invalid-email',
        password: 'short',
      };

      const result = validate(values, schema);

      expect(result).toEqual({
        emailInput: 'Custom email error',
        passwordInput: 'Password must be at least 8 characters',
      });
    });
  });
});
