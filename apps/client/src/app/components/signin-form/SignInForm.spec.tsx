import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import SignInForm from './SignInForm';

const mockSignIn = vi.fn();
const mockUseAuth = vi.fn(() => ({
  signIn: mockSignIn,
}));
const mockValidate = vi.hoisted(() => vi.fn());

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock('@/lib/forms', () => ({
  validate: mockValidate,
}));

vi.mock('@/schemas/sign-in', () => ({
  SignInSchema: {},
}));

describe('SignInForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({
      signIn: mockSignIn,
    });
  });

  it('should render successfully', () => {
    const { baseElement } = render(
      <BrowserRouter>
        <SignInForm />
      </BrowserRouter>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should render sign in title', () => {
    render(
      <BrowserRouter>
        <SignInForm />
      </BrowserRouter>
    );

    const title = screen.getByRole('heading', { level: 1 });

    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('Sign in');
  });

  it('should render create account link', () => {
    render(
      <BrowserRouter>
        <SignInForm />
      </BrowserRouter>
    );

    const link = screen.getByText('Create account');
    expect(link).toBeInTheDocument();
    expect(link.closest('a')).toHaveAttribute('href', '/create-account');
  });

  it('should render social sign in buttons', () => {
    render(
      <BrowserRouter>
        <SignInForm />
      </BrowserRouter>
    );

    expect(screen.getByText('Sign in with Google')).toBeInTheDocument();
    expect(screen.getByText('Sign in with Github')).toBeInTheDocument();
  });

  it('should render email and password inputs', () => {
    render(
      <BrowserRouter>
        <SignInForm />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  it('should render required fields note', () => {
    render(
      <BrowserRouter>
        <SignInForm />
      </BrowserRouter>
    );

    expect(screen.getByText('All fields are required')).toBeInTheDocument();
  });

  it('should render sign in button', () => {
    render(
      <BrowserRouter>
        <SignInForm />
      </BrowserRouter>
    );

    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('should render privacy policy and terms links', () => {
    render(
      <BrowserRouter>
        <SignInForm />
      </BrowserRouter>
    );

    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Terms and Conditions')).toBeInTheDocument();
  });

  it('should call signIn when form is submitted with valid data', async () => {
    mockValidate.mockReturnValue(null);

    render(
      <BrowserRouter>
        <SignInForm />
      </BrowserRouter>
    );

    const signInButton = screen.getByRole('button', { name: 'Sign in' });
    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledTimes(1);
    });
  });

  it('should not submit when form has validation errors', async () => {
    mockValidate.mockReturnValue({
      emailInput: 'Invalid email',
      passwordInput: 'Password is required',
    });

    render(
      <BrowserRouter>
        <SignInForm />
      </BrowserRouter>
    );

    const signInButton = screen.getByRole('button', { name: 'Sign in' });
    fireEvent.click(signInButton);

    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it('should display validation errors when form is submitted', async () => {
    const errors = {
      emailInput: 'Invalid email',
      passwordInput: 'Password is required',
    };
    mockValidate.mockReturnValue(errors);

    render(
      <BrowserRouter>
        <SignInForm />
      </BrowserRouter>
    );

    const signInButton = screen.getByRole('button', { name: 'Sign in' });
    fireEvent.click(signInButton);

    const errorSummary = screen.getByRole('group');

    expect(errorSummary).toBeInTheDocument();
    expect(errorSummary).toHaveTextContent('Invalid email');
    expect(errorSummary).toHaveTextContent('Password is required');
  });

  it('should validate on blur', () => {
    mockValidate.mockReturnValue({
      emailInput: 'Invalid email',
    });

    render(
      <BrowserRouter>
        <SignInForm />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/Email/i);
    fireEvent.blur(emailInput);

    expect(mockValidate).toHaveBeenCalledTimes(1);
  });

  it('should clear errors when validation passes on blur', () => {
    mockValidate.mockReturnValue(null);

    render(
      <BrowserRouter>
        <SignInForm />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/Email/i);
    fireEvent.blur(emailInput);

    // Errors should be cleared
    expect(screen.queryByText('Invalid email')).not.toBeInTheDocument();
  });

  it('should show loading state during submission', async () => {
    mockValidate.mockReturnValue(null);
    mockSignIn.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(
      <BrowserRouter>
        <SignInForm />
      </BrowserRouter>
    );

    const signInButton = screen.getByRole('button', { name: 'Sign in' });
    fireEvent.click(signInButton);

    expect(screen.getByText('Signing in…')).toBeInTheDocument();
  });

  it('should not allow multiple submissions while loading', async () => {
    mockValidate.mockReturnValue(null);
    mockSignIn.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(
      <BrowserRouter>
        <SignInForm />
      </BrowserRouter>
    );

    const signInButton = screen.getByRole('button', { name: 'Sign in' });
    fireEvent.click(signInButton);
    fireEvent.click(signInButton);

    expect(mockSignIn).toHaveBeenCalledTimes(1);
  });

  it('should handle form submission with updated values', async () => {
    mockValidate.mockReturnValue(null);

    render(
      <BrowserRouter>
        <SignInForm />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    fireEvent.change(emailInput, { target: { value: 'new@email.com' } });
    fireEvent.change(passwordInput, { target: { value: 'newpassword' } });

    const signInButton = screen.getByRole('button', { name: 'Sign in' });
    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        email: 'new@email.com',
        password: 'newpassword',
      });
    });
  });
});
