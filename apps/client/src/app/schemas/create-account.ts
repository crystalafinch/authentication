import { z } from 'zod';
import PASSWORD_CRITERIA from '../consts/password-criteria';

export const CreateAccountSchema = z.object({
  email: z.email({ pattern: z.regexes.html5Email }),
  password: z.string().refine(
    (pwd) => {
      return PASSWORD_CRITERIA.every((c) => c.validator(pwd));
    },
    {
      message: 'Password does not meet the requirements',
    }
  ),
});

export type CreateAccountSchemaType = z.infer<typeof CreateAccountSchema>;
