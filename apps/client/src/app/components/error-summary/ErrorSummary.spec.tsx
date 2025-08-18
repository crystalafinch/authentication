import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import ErrorSummary from './ErrorSummary';

describe('ErrorSummary', () => {
  it('should be hidden when no error messages are provided', () => {
    render(<ErrorSummary />);

    const errorSummary = screen.getByRole('group', { hidden: true });
    expect(errorSummary).toHaveAttribute('hidden');
  });

  it('should be visible when error messages are provided', () => {
    const errorMessages = {
      emailInput: 'Email is required',
      passwordInput: 'Password is required',
    };

    render(<ErrorSummary errorMessages={errorMessages} />);

    const errorSummary = screen.getByRole('group');
    expect(errorSummary).not.toHaveAttribute('hidden');
  });

  it('should display the error summary title', () => {
    const errorMessages = {
      emailInput: 'Email is required',
    };

    render(<ErrorSummary errorMessages={errorMessages} />);

    expect(
      screen.getByText('There were errors with your submission')
    ).toBeInTheDocument();
  });

  it('should display all error messages as links', () => {
    const errorMessages = {
      emailInput: 'Email is required',
      passwordInput: 'Password is required',
    };

    render(<ErrorSummary errorMessages={errorMessages} />);

    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });

  it('should have correct accessibility attributes', () => {
    const errorMessages = {
      emailInput: 'Email is required',
    };

    render(<ErrorSummary errorMessages={errorMessages} />);

    const errorSummary = screen.getByRole('group');
    expect(errorSummary).toHaveAttribute('role', 'group');
    expect(errorSummary).toHaveAttribute(
      'aria-labelledby',
      'errorSummaryTitle'
    );
    expect(errorSummary).toHaveAttribute('tabIndex', '-1');
  });

  it('should have correct ID and title ID', () => {
    const errorMessages = {
      emailInput: 'Email is required',
    };

    render(<ErrorSummary errorMessages={errorMessages} />);

    const errorSummary = screen.getByRole('group');
    const title = screen.getByText('There were errors with your submission');

    expect(errorSummary).toHaveAttribute('id', 'errorSummary');
    expect(title).toHaveAttribute('id', 'errorSummaryTitle');
  });

  it('should render error links with correct href attributes', () => {
    const errorMessages = {
      emailInput: 'Email is required',
      passwordInput: 'Password is required',
    };

    render(<ErrorSummary errorMessages={errorMessages} />);

    const emailLink = screen.getByText('Email is required');
    const passwordLink = screen.getByText('Password is required');

    expect(emailLink.closest('a')).toHaveAttribute('href', '#emailInput');
    expect(passwordLink.closest('a')).toHaveAttribute('href', '#passwordInput');
  });

  it('should handle empty error messages object', () => {
    render(<ErrorSummary errorMessages={{}} />);

    const errorSummary = screen.getByRole('group', { hidden: true });
    expect(errorSummary).toHaveAttribute('hidden');
  });

  it('should handle undefined error messages', () => {
    render(<ErrorSummary errorMessages={undefined} />);

    const errorSummary = screen.getByRole('group', { hidden: true });
    expect(errorSummary).toHaveAttribute('hidden');
  });

  it('should handle multiple error messages', () => {
    const errorMessages = {
      field1: 'First error',
      field2: 'Second error',
      field3: 'Third error',
      field4: 'Fourth error',
    };

    render(<ErrorSummary errorMessages={errorMessages} />);

    expect(screen.getByText('First error')).toBeInTheDocument();
    expect(screen.getByText('Second error')).toBeInTheDocument();
    expect(screen.getByText('Third error')).toBeInTheDocument();
    expect(screen.getByText('Fourth error')).toBeInTheDocument();
  });
});
