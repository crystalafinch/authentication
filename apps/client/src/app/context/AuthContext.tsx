import {
  useContext,
  createContext,
  useReducer,
  ReactNode,
  useEffect,
  useCallback,
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

// Pure types for authentication state
export interface AuthState {
  user: User | null;
  loading: boolean;
}

// Pure action types
export type AuthAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'RESET_AUTH' };

// Pure reducer function
export const authReducer = (
  state: AuthState,
  action: AuthAction
): AuthState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'RESET_AUTH':
      return { user: null, loading: false };
    default:
      return state;
  }
};

// Pure initial state
export const initialAuthState: AuthState = {
  user: null,
  loading: true,
};

// Pure service interface for external dependencies
export interface AuthService {
  checkAuth: () => Promise<User | null>;
  signIn: (data: UserSignInData) => Promise<User>;
  signOut: () => Promise<void>;
  createAccount: (data: UserSignInData) => Promise<User>;
}

// Pure navigation service interface
export interface NavigationService {
  navigate: (to: string) => void;
  navigateToSignIn: () => void;
}

// Pure storage service interface
export interface StorageService {
  syncTabs: (type: 'signed-in' | 'signed-out') => void;
  addStorageListener: (callback: (event: StorageEvent) => void) => () => void;
}

// Pure error handling service interface
export interface ErrorService {
  captureException: (error: unknown, context?: Record<string, unknown>) => void;
  announce: (message: string, priority?: 'assertive' | 'polite') => void;
}

// Pure context interface
interface AuthContextType {
  state: AuthState;
  signIn: (data: UserSignInData, from: string) => Promise<void>;
  signOut: () => Promise<void>;
  createAccount: (data: UserSignInData, from: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Pure hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Pure hook for accessing auth state
export const useAuthState = () => {
  const { state } = useAuth();
  return state;
};

// Pure hook for accessing auth actions
export const useAuthActions = () => {
  const { signIn, signOut, createAccount } = useAuth();
  return { signIn, signOut, createAccount };
};

// Pure component that manages state
function AuthStateManager({
  children,
  authService,
  navigationService,
  storageService,
  errorService,
}: {
  children: ReactNode;
  authService: AuthService;
  navigationService: NavigationService;
  storageService: StorageService;
  errorService: ErrorService;
}) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  // Pure effect for initial auth check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const user = await authService.checkAuth();
        dispatch({ type: 'SET_USER', payload: user });
      } catch (err) {
        errorService.captureException(err);
        errorService.announce(`${err}`, 'assertive');
        dispatch({ type: 'SET_USER', payload: null });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkAuth();
  }, [authService, errorService]);

  // Pure effect for storage sync
  useEffect(() => {
    const removeListener = storageService.addStorageListener((event) => {
      if (event.key === 'auth-event' && event.newValue) {
        const { type } = JSON.parse(event.newValue);

        if (type === 'signed-out') {
          dispatch({ type: 'RESET_AUTH' });
          navigationService.navigateToSignIn();
        }

        if (type === 'signed-in') {
          // Re-check auth when signed in from another tab
          const checkAuth = async () => {
            try {
              const user = await authService.checkAuth();
              dispatch({ type: 'SET_USER', payload: user });
            } catch (err) {
              errorService.captureException(err);
            }
          };
          checkAuth();
        }
      }
    });

    return removeListener;
  }, [storageService, navigationService, authService, errorService]);

  // Pure sign in function
  const signIn = useCallback(
    async (data: UserSignInData, from: string) => {
      try {
        const user = await authService.signIn(data);
        dispatch({ type: 'SET_USER', payload: user });
        navigationService.navigate(from);
        storageService.syncTabs('signed-in');
      } catch (err) {
        errorService.captureException(err, {
          login_attempt: { email: data.email },
        });
        errorService.announce(`${err}`, 'assertive');
      }
    },
    [authService, navigationService, storageService, errorService]
  );

  // Pure sign out function
  const signOut = useCallback(async () => {
    try {
      await authService.signOut();
    } catch (err) {
      errorService.captureException(err);
      errorService.announce(`${err}`, 'assertive');
    }

    dispatch({ type: 'RESET_AUTH' });
    navigationService.navigateToSignIn();
    storageService.syncTabs('signed-out');
  }, [authService, navigationService, storageService, errorService]);

  // Pure create account function
  const createAccount = useCallback(
    async (data: UserSignInData, from: string) => {
      try {
        const user = await authService.createAccount(data);
        dispatch({ type: 'SET_USER', payload: user });
        navigationService.navigate(from);
        storageService.syncTabs('signed-in');
      } catch (err) {
        errorService.captureException(err, {
          create_account_attempt: { email: data.email },
        });
        errorService.announce(`${err}`, 'assertive');
      }
    },
    [authService, navigationService, storageService, errorService]
  );

  const contextValue: AuthContextType = {
    state,
    signIn,
    signOut,
    createAccount,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

// Pure provider component that injects dependencies
function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const announce = useAnnouncer();

  // Create service implementations
  const authService: AuthService = {
    checkAuth: async () => {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/api/auth/check-auth`, {
        credentials: 'include',
      });
      const res = await response.json();

      if (!res.ok) {
        throw Error(res.error);
      }

      return res.data?.user || null;
    },
    signIn: async (data: UserSignInData) => {
      const API_URL = import.meta.env.VITE_API_URL;
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

      if (!res.data?.user) {
        throw Error('No user data received');
      }

      return res.data.user;
    },
    signOut: async () => {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/api/auth/signout`, {
        method: 'POST',
        credentials: 'include',
      });
      const res = await response.json();

      if (!res.ok) {
        throw Error(res.error);
      }
    },
    createAccount: async (data: UserSignInData) => {
      const API_URL = import.meta.env.VITE_API_URL;
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

      if (!res.data?.user) {
        throw Error('No user data received');
      }

      return res.data.user;
    },
  };

  const navigationService: NavigationService = {
    navigate: (to: string) => navigate(to),
    navigateToSignIn: () => navigate('/signin'),
  };

  const storageService: StorageService = {
    syncTabs: (type: 'signed-in' | 'signed-out') => {
      localStorage.setItem(
        'auth-event',
        JSON.stringify({ type, timestamp: Date.now() })
      );
    },
    addStorageListener: (callback: (event: StorageEvent) => void) => {
      window.addEventListener('storage', callback);
      return () => window.removeEventListener('storage', callback);
    },
  };

  const errorService: ErrorService = {
    captureException: (error: unknown, context?: Record<string, unknown>) => {
      if (context) {
        Sentry.setContext('auth_context', context);
      }
      Sentry.captureException(error);
    },
    announce: (message: string, priority?: 'assertive' | 'polite') =>
      announce(message, priority || 'polite'),
  };

  return (
    <AuthStateManager
      authService={authService}
      navigationService={navigationService}
      storageService={storageService}
      errorService={errorService}
    >
      {children}
    </AuthStateManager>
  );
}

export default AuthProvider;
