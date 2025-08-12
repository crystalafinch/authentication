import { z } from 'zod';
import PASSWORD_CRITERIA from '@/consts/password-criteria';

const checkPassword = (password: string): boolean => {
  return PASSWORD_CRITERIA.every((c) => c.validator(password));
};

export const CreateAccountSchema = z.object({
  email: z.email({ pattern: z.regexes.html5Email }),
  password: z.string().refine(checkPassword, {
    message: 'Password does not meet the requirements',
  }),
});

export type CreateAccountSchemaType = z.infer<typeof CreateAccountSchema>;
