import { render, screen, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import AuthProvider, { useAuth } from './AuthContext';

vi.mock('@sentry/react', () => ({
  default: {
    captureException: vi.fn(),
    setContext: vi.fn(),
  },
  captureException: vi.fn(),
  setContext: vi.fn(),
  Sentry: {
    captureException: vi.fn(),
    setContext: vi.fn(),
  },
}));

vi.mock('../aria-announcer/AriaAnnouncer', () => ({
  useAnnouncer: () => ({
    announce: vi.fn(),
  }),
}));

vi.mock('import.meta', () => ({
  env: {
    VITE_API_URL: 'http://localhost:3000',
  },
}));

function TestComponent() {
  const auth = useAuth();
  return (
    <div>
      <div data-testid="user">
        {auth?.user ? JSON.stringify(auth.user) : 'no-user'}
      </div>
      <div data-testid="loading">{auth?.loading.toString()}</div>
      <button
        onClick={() =>
          auth?.signIn({ email: 'test@test.com', password: 'password' })
        }
      >
        Sign In
      </button>
      <button onClick={() => auth?.signOut()}>Sign Out</button>
      <button
        onClick={() =>
          auth?.createAccount({ email: 'test@test.com', password: 'password' })
        }
      >
        Create Account
      </button>
    </div>
  );
}

const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
    mockFetch.mockClear();
  });

  it('should provide auth context with initial loading state', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByTestId('loading')).toHaveTextContent('true');
    expect(screen.getByTestId('user')).toHaveTextContent('no-user');
  });

  it('should check auth on mount', async () => {
    const mockUser = {
      id: '1',
      email: 'test@test.com',
      password: 'hash',
      refreshTokenVersion: 1,
    };

    mockFetch.mockResolvedValueOnce({
      json: async () => ({ ok: true, data: { user: mockUser } }),
    });

    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/auth/check-auth',
        { credentials: 'include' }
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
      expect(screen.getByTestId('user')).toHaveTextContent(
        JSON.stringify(mockUser)
      );
    });
  });

  it('should handle auth check error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(
      () => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      },
      { timeout: 3000 }
    );

    expect(screen.getByTestId('user')).toHaveTextContent('no-user');
  });

  it('should handle auth check with error response', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ ok: false, error: 'Unauthorized' }),
    });

    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(
      () => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      },
      { timeout: 3000 }
    );

    expect(screen.getByTestId('user')).toHaveTextContent('no-user');
  });

  it('should sign in successfully', async () => {
    const mockUser = {
      id: '1',
      email: 'test@test.com',
      password: 'hash',
      refreshTokenVersion: 1,
    };

    mockFetch.mockResolvedValueOnce({
      json: async () => ({ ok: true, data: { user: null } }),
    });

    mockFetch.mockResolvedValueOnce({
      json: async () => ({ ok: true, data: { user: mockUser } }),
    });

    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    const signInButton = screen.getByText('Sign In');
    await act(async () => {
      signInButton.click();
    });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/auth/signin',
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'test@test.com',
            password: 'password',
          }),
        }
      );
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should handle sign in error', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ ok: true, data: { user: null } }),
    });

    mockFetch.mockRejectedValueOnce(new Error('Invalid credentials'));

    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    const signInButton = screen.getByText('Sign In');
    await act(async () => {
      signInButton.click();
    });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/auth/signin',
        expect.any(Object)
      );
    });
  });

  it('should sign out successfully', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ ok: true, data: { user: null } }),
    });

    mockFetch.mockResolvedValueOnce({
      json: async () => ({ ok: true }),
    });

    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    const signOutButton = screen.getByText('Sign Out');
    await act(async () => {
      signOutButton.click();
    });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/auth/signout',
        { method: 'POST', credentials: 'include' }
      );
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/signin');
    });
  });

  it('should create account successfully', async () => {
    const mockUser = {
      id: '1',
      email: 'test@test.com',
      password: 'hash',
      refreshTokenVersion: 1,
    };

    mockFetch.mockResolvedValueOnce({
      json: async () => ({ ok: true, data: { user: null } }),
    });

    mockFetch.mockResolvedValueOnce({
      json: async () => ({ ok: true, data: { user: mockUser } }),
    });

    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    const createAccountButton = screen.getByText('Create Account');
    await act(async () => {
      createAccountButton.click();
    });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/auth/create-account',
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'test@test.com',
            password: 'password',
          }),
        }
      );
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should handle create account error', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ ok: true, data: { user: null } }),
    });

    mockFetch.mockRejectedValueOnce(new Error('Email already exists'));

    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    const createAccountButton = screen.getByText('Create Account');
    await act(async () => {
      createAccountButton.click();
    });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/auth/create-account',
        expect.any(Object)
      );
    });
  });

  it('should sync auth across tabs', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ ok: true, data: { user: null } }),
    });

    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    const storageEvent = new StorageEvent('storage', {
      key: 'auth-event',
      newValue: JSON.stringify({ type: 'signed-out', timestamp: Date.now() }),
    });

    act(() => {
      window.dispatchEvent(storageEvent);
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/signin');
    });
  });
});
