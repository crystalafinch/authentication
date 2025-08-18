import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect } from 'vitest';
import AppProviders from './AppProviders';

vi.mock('@/context/AuthContext', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-provider">{children}</div>
  ),
}));

vi.mock('../aria-announcer/AriaAnnouncer', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="aria-announcer-provider">{children}</div>
  ),
}));

describe('AppProviders', () => {
  it('should render children wrapped in providers', () => {
    render(
      <BrowserRouter>
        <AppProviders>
          <div data-testid="test-content">Test Content</div>
        </AppProviders>
      </BrowserRouter>
    );

    expect(screen.getByTestId('aria-announcer-provider')).toBeInTheDocument();
    expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
  });

  it('should maintain provider hierarchy', () => {
    const { container } = render(
      <BrowserRouter>
        <AppProviders>
          <div data-testid="test-content">Test Content</div>
        </AppProviders>
      </BrowserRouter>
    );

    const ariaAnnouncer = screen.getByTestId('aria-announcer-provider');
    const authProvider = screen.getByTestId('auth-provider');
    const testContent = screen.getByTestId('test-content');

    expect(ariaAnnouncer).toContainElement(authProvider);
    expect(authProvider).toContainElement(testContent);
  });

  it('should render without children', () => {
    render(
      <BrowserRouter>
        <AppProviders />
      </BrowserRouter>
    );

    expect(screen.getByTestId('aria-announcer-provider')).toBeInTheDocument();
    expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
  });
});
