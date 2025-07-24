import { fromError } from 'zod-validation-error';
import { FormErrors } from './types';
import { z } from 'zod';

export const validate = <T extends z.ZodTypeAny>(
  values: z.infer<T>,
  schema: T
): FormErrors | null => {
  const validated = schema.safeParse(values);
  if (!validated.success) {
    const validationError = fromError(validated.error);
    let errors: FormErrors = {};
    validationError.details.forEach((detail) => {
      const key = `${detail.path.join('')}Input`;
      errors[key] = detail.message;
    });
    return errors;
  }
  return null;
};
