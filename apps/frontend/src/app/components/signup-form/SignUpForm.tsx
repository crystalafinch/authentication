import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Input } from '@ui/input';
import { Button } from '@ui/button';

function SignUpForm() {
  const [email, setEmail] = useState('crystal.storm@gmail.com');
  const [password, setPassword] = useState('asdfasdfasdfasdfasdf');
  const auth = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: expand onboarding flow, not just email/password
    // TODO: verify validation via UI messages
    if (email !== '' && password !== '') {
      auth?.signUp({ email, password });
      return;
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Sign Up</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="emailInput">Email</label>
        <Input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          id="emailInput"
          required
        />
        <label htmlFor="passwordInput">Password</label>
        <Input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="password"
          id="passwordInput"
          required
        />
        <Button type="submit">Sign Up</Button>
      </form>
    </div>
  );
}

export default SignUpForm;
