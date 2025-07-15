import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Input } from '@ui/input';

export type AuthFormProps = {
  endpoint: 'login' | 'signup';
};

function AuthForm({ endpoint }: AuthFormProps) {
  const [email, setEmail] = useState('crystal.storm@gmail.com');
  const [password, setPassword] = useState('asdfasdfasdfasdfasdf');
  const auth = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: verify validation via UI messages
    if (email !== '' && password !== '') {
      auth?.doLogin({ email, password });
      return;
    }
  };

  return (
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
      <button type="submit">{endpoint}</button>
    </form>
  );
}

export default AuthForm;
