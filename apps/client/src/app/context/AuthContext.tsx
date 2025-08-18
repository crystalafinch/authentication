import {
  useContext,
  createContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnnouncer } from '../components/aria-announcer/AriaAnnouncer';
import * as Sentry from '@sentry/react';

// TODO: Move to shared lib
export type User = {
  id: string;
  email: string;
  password: string;
  refreshTokenVersion: number;
};

export type UserSignInData = Pick<User, 'email' | 'password'>;

const API_URL = import.meta.env.VITE_API_URL;

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (data: UserSignInData) => Promise<void>;
  signOut: () => void;
  createAccount: (data: UserSignInData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const announce = useAnnouncer();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    window.addEventListener('storage', syncAuth);
    return () => window.removeEventListener('storage', syncAuth);
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/check-auth`, {
        credentials: 'include',
      });
      const res = await response.json();

      if (!res.ok) {
        throw Error(res.error);
      }

      if (res.data) {
        setUser(res.data.user);
        setLoading(false);
      }
    } catch (err) {
      Sentry.captureException(err);
      announce(`${err}`, 'assertive');
      setUser(null);
      setLoading(false);
    }
  };

  const syncAuth = (event: StorageEvent) => {
    if (event.key === 'auth-event' && event.newValue) {
      const { type } = JSON.parse(event.newValue);

      if (type === 'signed-out') {
        setUser(null);
        navigate('/signin');
      }

      if (type === 'signed-in') {
        checkAuth();
      }
    }
  };

  const syncTabs = (type: 'signed-in' | 'signed-out') => {
    localStorage.setItem(
      'auth-event',
      JSON.stringify({ type, timestamp: Date.now() })
    );
  };

  const signIn = async (data: UserSignInData) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/signin`, {
        method: 'POST',
        credentials: 'include',
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
        navigate('/dashboard');
        syncTabs('signed-in');
        return;
      }
    } catch (err) {
      Sentry.setContext('login_attempt', {
        email: data.email,
      });
      Sentry.captureException(err);
      announce(`${err}`, 'assertive');
    }
  };

  const signOut = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/signout`, {
        method: 'POST',
        credentials: 'include',
      });
      const res = await response.json();

      if (!res.ok) {
        throw Error(res.error);
      }
    } catch (err) {
      Sentry.captureException(err);
      announce(`${err}`, 'assertive');
    }

    setUser(null);
    navigate('/signin');
    syncTabs('signed-out');
  };

  // TODO: expand onboarding flow, not just email/password
  const createAccount = async (data: UserSignInData) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/create-account`, {
        method: 'POST',
        credentials: 'include',
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
        navigate('/dashboard');
        syncTabs('signed-in');
        return;
      }
    } catch (err) {
      Sentry.setContext('create_account_attempt', {
        email: data.email,
      });
      Sentry.captureException(err);
      announce(`${err}`, 'assertive');
    }
  };

  return (
    <AuthContext
      value={{
        user,
        loading,
        signIn,
        signOut,
        createAccount,
      }}
    >
      {children}
    </AuthContext>
  );
}

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
