import { render, screen } from '@testing-library/react';
import { MemoryRouter, BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect } from 'vitest';
import AppRoutes from './AppRoutes';

const mockUseAuth = vi.fn();
vi.mock('@/context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock('../authorized-route/AuthorizedRoute', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="authorized-route">{children}</div>
  ),
}));

vi.mock('../auth-layout/AuthLayout', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-layout">{children}</div>
  ),
}));

vi.mock('../signin-form/SignInForm', () => ({
  default: () => <div data-testid="signin-form">Sign In Form</div>,
}));

vi.mock('../create-account-form/CreateAccountForm', () => ({
  default: () => (
    <div data-testid="create-account-form">Create Account Form</div>
  ),
}));

vi.mock('../home/Home', () => ({
  default: () => <div data-testid="home">Home</div>,
}));

vi.mock('../public-route/PublicRoute', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="public-route">{children}</div>
  ),
}));

vi.mock('../dashboard/Dashboard', () => ({
  default: () => <div data-testid="dashboard">Dashboard</div>,
}));

vi.mock('../profile/Profile', () => ({
  default: () => <div data-testid="profile">Profile</div>,
}));

describe('AppRoutes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state when auth is loading', () => {
    mockUseAuth.mockReturnValue({ loading: true });

    render(
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    );

    expect(screen.queryByTestId('home')).not.toBeInTheDocument();
  });

  it('should render routes when not loading', () => {
    mockUseAuth.mockReturnValue({ loading: false });

    render(
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    );

    expect(screen.getByTestId('home')).toBeInTheDocument();
  });

  it('should render home route by default', () => {
    mockUseAuth.mockReturnValue({ loading: false });

    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByTestId('home')).toBeInTheDocument();
  });

  it('should handle undefined auth context', () => {
    mockUseAuth.mockReturnValue(undefined);

    render(
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    );

    expect(screen.getByTestId('home')).toBeInTheDocument();
  });

  it('should render public route structure', () => {
    mockUseAuth.mockReturnValue({ loading: false });

    render(
      <MemoryRouter initialEntries={['/signin']}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByTestId('public-route')).toBeInTheDocument();
  });

  it('should render authorized route structure', () => {
    mockUseAuth.mockReturnValue({ loading: false });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByTestId('authorized-route')).toBeInTheDocument();
  });
});
