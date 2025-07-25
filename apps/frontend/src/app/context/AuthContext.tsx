import { useContext, createContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnnouncer } from '../components/aria-announcer/AriaAnnouncer';
import * as Sentry from '@sentry/react';

const API_URL = import.meta.env.VITE_API_URL;

interface AuthContextType {
  token: string;
  user: any; // TODO: define type
  signIn: (data: { email: string; password: string }) => Promise<void>;
  signOut: () => void;
  createAccount: (data: { email: string; password: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('userToken') ?? '');
  const navigate = useNavigate();
  const announce = useAnnouncer();

  const signIn = async (data: { email: string; password: string }) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const res = await response.json();

      if (!res.ok) {
        throw Error(res.error);
      }

      if (res.data) {
        setUser(res.data.user);
        setToken(res.data.token);
        localStorage.setItem('userToken', res.token);
        navigate('/dashboard');
        return;
      }
    } catch (err) {
      console.error(err);
      Sentry.setContext('login_attempt', {
        email: data.email,
      });
      Sentry.captureException(err);
      announce(`${err}`, 'assertive');
    }
  };

  const signOut = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('userToken');
    navigate('/signin');
  };

  // TODO: expand onboarding flow, not just email/password
  const createAccount = async (data: { email: string; password: string }) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/create-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const res = await response.json();

      if (!res.ok) {
        throw Error(res.error);
      }

      if (res.data) {
        setUser(res.data.user);
        setToken(res.data.token);
        localStorage.setItem('userToken', res.token);
        navigate('/dashboard');
        return;
      }
    } catch (err) {
      console.error(err);
      Sentry.setContext('create_account_attempt', {
        email: data.email,
      });
      Sentry.captureException(err);
      announce(`${err}`, 'assertive');
    }
  };

  return (
    <AuthContext value={{ token, user, signIn, signOut, createAccount }}>
      {children}
    </AuthContext>
  );
}

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
