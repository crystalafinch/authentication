import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '@ui/button';
import RequiredAsterisk from '../required-asterisk/RequiredAsterisk';
import FormInput from '../form-input/FormInput';
import PasswordCriteria from '../password-criteria/PasswordCriteria';
import ErrorSummary from '../error-summary/ErrorSummary';
import { FormErrors } from '../../lib/types';
import { LoginSchema } from './signin-form-schema';

const ERROR_MESSAGES = {
  'email-required': 'Email is required',
  'password-required': 'Password is required',
  'password-invalid': 'Password does not meet the requirements',
};

function SignInForm() {
  const [email, setEmail] = useState('crystal.storm@gmail.com');
  const [password, setPassword] = useState('asdfasdfasdfasdfasdfA1!');
  const [errors, setErrors] = useState<FormErrors>({});
  const auth = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = LoginSchema.safeParse({ email, password });
    if (!result.success) {
      console.error(result.error);

      // const errorSummaryTitle = document.getElementById('errorSummaryTitle');
      // if (errorSummaryTitle) {
      //   errorSummaryTitle.focus();
      // }
    } else {
      console.log(result.data);
      auth?.signIn({ email, password });
    }
  };

  return (
    <div className="flex grow justify-center">
      <div className="w-sm p-6">
        <h1 className="font-medium mb-1 text-2xl text-center">
          Sign in to your account
        </h1>

        <form onSubmit={handleSubmit} noValidate>
          <p className="mb-4 text-xs text-center text-gray-500">
            Required fields are marked with an asterisk{' '}
            <RequiredAsterisk showSrOnly={false} />
          </p>

          <ErrorSummary errorMessages={errors} />

          <FormInput
            name="email"
            type="email"
            label="Email"
            value={email}
            changeFn={setEmail}
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
            required={true}
            autoComplete="password"
            errorMessage={errors['passwordInput']}
            description={<PasswordCriteria password={password} />}
          />

          <Button type="submit" className="rounded-4xl w-full">
            Sign In
          </Button>
        </form>
        <ul className="justify-center flex gap-4 mt-4 text-xs text-center text-gray-500">
          <li>
            <a href="#">Privacy Policy</a>
          </li>
          <li>
            <a href="#">Terms and Conditions</a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default SignInForm;
