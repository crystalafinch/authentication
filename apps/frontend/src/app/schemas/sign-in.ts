import { z } from 'zod';

export const SignInSchema = z.object({
  email: z.email({
    pattern: z.regexes.html5Email,
    error: (issue) =>
      issue.input === '' ? 'Email is required' : 'Invalid email',
  }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export type SignInSchemaType = z.infer<typeof SignInSchema>;
