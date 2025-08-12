import { z } from 'zod';

const getEmailError = (issue: { input: unknown; code: string }): string =>
  issue.input === '' ? 'Email is required' : 'Invalid email';

export const SignInSchema = z.object({
  email: z.email({
    pattern: z.regexes.html5Email,
    error: getEmailError,
  }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export type SignInSchemaType = z.infer<typeof SignInSchema>;
