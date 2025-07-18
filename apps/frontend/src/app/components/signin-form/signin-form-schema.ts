import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.email({ pattern: z.regexes.html5Email }),
  password: z.string(), // TODO: add password criteria
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;
