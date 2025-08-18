import { render, screen, cleanup } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import PasswordCriteria from './PasswordCriteria';

vi.mock('@/consts/password-criteria', () => ({
  default: [
    {
      text: 'At least 12 characters',
      validator: (pwd: string) => pwd.length >= 12,
    },
    {
      text: 'A mix of uppercase and lowercase letters',
      validator: (pwd: string) => /[a-z]/.test(pwd) && /[A-Z]/.test(pwd),
    },
    {
      text: 'At least one number',
      validator: (pwd: string) => /\d/.test(pwd),
    },
    {
      text: 'At least one special character e.g. ! $',
      validator: (pwd: string) =>
        /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
    },
  ],
}));

describe('PasswordCriteria', () => {
  it('should display the title text', () => {
    render(<PasswordCriteria password="" />);

    expect(screen.getByText('Your password should be:')).toBeInTheDocument();
  });

  it('should display all password criteria', () => {
    render(<PasswordCriteria password="" />);

    expect(screen.getByText('At least 12 characters')).toBeInTheDocument();
    expect(
      screen.getByText('A mix of uppercase and lowercase letters')
    ).toBeInTheDocument();
    expect(screen.getByText('At least one number')).toBeInTheDocument();
    expect(
      screen.getByText('At least one special character e.g. ! $')
    ).toBeInTheDocument();
  });

  it('should show check marks for valid criteria', () => {
    const validPassword = 'ValidPass1!@';
    render(<PasswordCriteria password={validPassword} />);

    const checkIcons = screen.getAllByTestId('check');
    expect(checkIcons).toHaveLength(4);
  });

  it('should show minus marks for invalid criteria', () => {
    const invalidPassword = 'short';
    render(<PasswordCriteria password={invalidPassword} />);

    const minusIcons = screen.getAllByTestId('minus');
    expect(minusIcons).toHaveLength(4);
  });

  it('should show mixed validation states', () => {
    const mixedPassword = 'MixedCase123'; // Valid case mix and numbers, but no special chars
    render(<PasswordCriteria password={mixedPassword} />);

    const checkIcons = screen.getAllByTestId('check');
    const minusIcons = screen.getAllByTestId('minus');

    expect(checkIcons).toHaveLength(3);
    expect(minusIcons).toHaveLength(1);
  });

  it('should handle empty password', () => {
    render(<PasswordCriteria password="" />);

    const minusIcons = screen.getAllByTestId('minus');
    expect(minusIcons).toHaveLength(4);
  });

  it('should handle very short password', () => {
    render(<PasswordCriteria password="a" />);

    const minusIcons = screen.getAllByTestId('minus');
    expect(minusIcons).toHaveLength(4);
  });

  it('should handle password with only lowercase letters', () => {
    render(<PasswordCriteria password="lowercase" />);

    const minusIcons = screen.getAllByTestId('minus');
    expect(minusIcons).toHaveLength(4);
  });

  it('should handle password with only uppercase letters', () => {
    render(<PasswordCriteria password="UPPERCASE" />);

    const minusIcons = screen.getAllByTestId('minus');
    expect(minusIcons).toHaveLength(4);
  });

  it('should handle password with only numbers', () => {
    render(<PasswordCriteria password="123456789012" />);

    const checkIcons = screen.getAllByTestId('check');
    const minusIcons = screen.getAllByTestId('minus');

    expect(checkIcons).toHaveLength(2);
    expect(minusIcons).toHaveLength(2);
  });

  it('should handle password with only special characters', () => {
    render(<PasswordCriteria password="!@#$%^&*()_+" />);

    const checkIcons = screen.getAllByTestId('check');
    const minusIcons = screen.getAllByTestId('minus');

    expect(checkIcons).toHaveLength(2);
    expect(minusIcons).toHaveLength(2);
  });

  it('should handle password with mixed case but no numbers or special chars', () => {
    render(<PasswordCriteria password="MixedCasePassword" />);

    const checkIcons = screen.getAllByTestId('check');
    const minusIcons = screen.getAllByTestId('minus');

    expect(checkIcons).toHaveLength(2);
    expect(minusIcons).toHaveLength(2);
  });

  it('should handle password with case mix and numbers but no special chars', () => {
    render(<PasswordCriteria password="MixedCase123" />);

    const checkIcons = screen.getAllByTestId('check');
    const minusIcons = screen.getAllByTestId('minus');

    expect(checkIcons).toHaveLength(3);
    expect(minusIcons).toHaveLength(1);
  });

  it('should handle password with case mix and special chars but no numbers', () => {
    render(<PasswordCriteria password="MixedCase!@#" />);

    const checkIcons = screen.getAllByTestId('check');
    const minusIcons = screen.getAllByTestId('minus');

    expect(checkIcons).toHaveLength(3);
    expect(minusIcons).toHaveLength(1);
  });

  it('should handle password with numbers and special chars but no case mix', () => {
    render(<PasswordCriteria password="123456789012!@#" />);

    const checkIcons = screen.getAllByTestId('check');
    const minusIcons = screen.getAllByTestId('minus');

    expect(checkIcons).toHaveLength(3);
    expect(minusIcons).toHaveLength(1);
  });

  it('should handle valid password with all criteria met', () => {
    const validPassword = 'ValidPass1!@';
    render(<PasswordCriteria password={validPassword} />);

    const checkIcons = screen.getAllByTestId('check');
    expect(checkIcons).toHaveLength(4);
  });

  it('should handle very long valid password', () => {
    const longPassword = 'ValidPass1!' + 'a'.repeat(100);
    render(<PasswordCriteria password={longPassword} />);

    const checkIcons = screen.getAllByTestId('check');
    expect(checkIcons).toHaveLength(4);
  });

  it('should have correct styling classes', () => {
    render(<PasswordCriteria password="" />);

    const container = screen
      .getByText('Your password should be:')
      .closest('div');
    expect(container).toHaveClass('mb-2', 'text-xs');

    const list = container?.querySelector('ul');
    expect(list).toHaveClass('leading-5', 'list-disc', 'list-inside', 'mt-1');
  });

  it('should have correct list structure', () => {
    render(<PasswordCriteria password="" />);

    const list = screen
      .getByText('Your password should be:')
      .parentElement?.querySelector('ul');
    const listItems = list?.querySelectorAll('li');

    expect(listItems).toHaveLength(4);
    listItems?.forEach((item) => {
      expect(item).toHaveClass('flex', 'items-center', 'gap-2');
    });
  });
});
