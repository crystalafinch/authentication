import { useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@ui/button';
import { Link } from 'react-router-dom';
import ErrorSummary from '../error-summary/ErrorSummary';
import { FormErrors } from '@/lib/types';
import RequiredAsterisk from '../required-asterisk/RequiredAsterisk';
import FormInput from '../form-input/FormInput';
import PasswordCriteria from '../password-criteria/PasswordCriteria';
import { CreateAccountSchema } from '@/schemas/create-account';
import { validate } from '@/lib/forms';

function CreateAccountForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const errorSummary = useRef<HTMLDivElement>(null);
  const auth = useAuth();

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const errors = validate({ email, password }, CreateAccountSchema);
    if (errors) {
      setErrors(errors);
    } else {
      setErrors({});
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoading) return;

    setIsLoading(true);

    const errors = validate({ email, password }, CreateAccountSchema);
    if (errors) {
      setErrors(errors);
      if (errorSummary.current) {
        errorSummary.current.focus();
      }
      return;
    }

    // TODO: expand onboarding flow, not just email/password
    await auth?.createAccount({ email, password });
    setIsLoading(false);
  };

  return (
    <div className="flex grow justify-center">
      <div className="w-sm p-6">
        <h1 className="font-medium mb-1 text-2xl text-center">
          Create account
        </h1>

        <p className="mb-4 text-xs text-center text-gray-500">
          Already have an account?{' '}
          <Link to="/signin" className="underline">
            Sign in
          </Link>
        </p>

        <div className="mb-4">
          <Button
            type="button"
            variant="outline"
            className="rounded-sm w-full mb-2"
          >
            Continue with Google
          </Button>
          <Button
            type="button"
            variant="outline"
            className="rounded-sm w-full mb-2"
          >
            Continue with Github
          </Button>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <p className="before:content-[''] before:block before:w-full before:h-[1px] before:bg-gray-200 after:content-[''] after:block after:w-full after:h-[1px] after:bg-gray-200 flex gap-2 items-center relative mb-1 text-sm text-center text-gray-500 whitespace-nowrap">
            Create account with email
          </p>
          <p className="mb-4 text-xs text-center text-gray-500">
            Required fields are marked with an asterisk{' '}
            <RequiredAsterisk showSrOnly={false} />
          </p>

          <ErrorSummary errorMessages={errors} ref={errorSummary} />

          <FormInput
            name="email"
            type="email"
            label="Email"
            value={email}
            changeFn={setEmail}
            blurFn={handleBlur}
            required={true}
            autoComplete="email"
            errorMessage={errors['emailInput']}
          />
          <FormInput
            name="password"
            type="password"
            label="Password"
            value={password}
            changeFn={setPassword}
            blurFn={handleBlur}
            required={true}
            autoComplete="password"
            errorMessage={errors['passwordInput']}
            description={<PasswordCriteria password={password} />}
          />
          <Button type="submit" loading={isLoading}>
            {isLoading ? <>Creating account&hellip;</> : 'Create account'}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default CreateAccountForm;
