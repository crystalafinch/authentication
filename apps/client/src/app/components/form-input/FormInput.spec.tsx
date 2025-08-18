import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import FormInput from './FormInput';

describe('FormInput', () => {
  const defaultProps = {
    name: 'test',
    label: 'Test Label',
    value: '',
    changeFn: vi.fn(),
    required: false,
  };

  it('should render label correctly', () => {
    render(<FormInput {...defaultProps} />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('should render required asterisk when required is true', () => {
    render(<FormInput {...defaultProps} required={true} />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('should not render required asterisk when required is false', () => {
    render(<FormInput {...defaultProps} required={false} />);
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('should render input with correct attributes', () => {
    render(<FormInput {...defaultProps} />);
    const input = screen.getByRole('textbox');

    expect(input).toHaveAttribute('name', 'test');
    expect(input).toHaveAttribute('id', 'testInput');
    expect(input).toHaveAttribute('value', '');
    expect(input).toHaveAttribute('aria-required', 'false');
  });

  it('should render input with required attributes when required is true', () => {
    render(<FormInput {...defaultProps} required={true} />);
    const input = screen.getByRole('textbox');

    expect(input).toHaveAttribute('aria-required', 'true');
  });

  it('should call changeFn when input value changes', () => {
    const changeFn = vi.fn();
    render(<FormInput {...defaultProps} changeFn={changeFn} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'new value' } });

    expect(changeFn).toHaveBeenCalledWith('new value');
  });

  it('should call blurFn when input loses focus', () => {
    const blurFn = vi.fn();
    render(<FormInput {...defaultProps} blurFn={blurFn} />);

    const input = screen.getByRole('textbox');
    fireEvent.blur(input);

    expect(blurFn).toHaveBeenCalled();
  });

  it('should render error message when provided', () => {
    render(<FormInput {...defaultProps} errorMessage="This is an error" />);

    expect(screen.getByText('This is an error')).toBeInTheDocument();
    expect(screen.getByText('Error:')).toBeInTheDocument();
  });

  it('should not render error message when not provided', () => {
    render(<FormInput {...defaultProps} />);

    expect(screen.queryByText('Error:')).not.toBeInTheDocument();
  });

  it('should render description when provided', () => {
    render(<FormInput {...defaultProps} description="This is a description" />);

    expect(screen.getByText('This is a description')).toBeInTheDocument();
  });

  it('should render children when provided', () => {
    render(
      <FormInput {...defaultProps}>
        <span data-testid="child">Child content</span>
      </FormInput>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('should render with autoComplete attribute', () => {
    render(<FormInput {...defaultProps} autoComplete="email" />);
    const input = screen.getByRole('textbox');

    expect(input).toHaveAttribute('autoComplete', 'email');
  });

  it('should apply error styling when error message is present', () => {
    render(<FormInput {...defaultProps} errorMessage="Error message" />);
    const input = screen.getByRole('textbox');

    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('should not apply error styling when no error message', () => {
    render(<FormInput {...defaultProps} />);
    const input = screen.getByRole('textbox');

    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  it('should have correct aria-describedby when both error and description are present', () => {
    render(
      <FormInput
        {...defaultProps}
        errorMessage="Error message"
        description="Description"
      />
    );
    const input = screen.getByRole('textbox');

    expect(input).toHaveAttribute(
      'aria-describedby',
      'testError testInputDescription'
    );
  });

  it('should have correct aria-describedby when only error is present', () => {
    render(
      <FormInput
        {...defaultProps}
        errorMessage="This is an error"
        description=""
      />
    );

    const input = screen.getByRole('textbox');

    expect(input).toHaveAttribute('aria-describedby', 'testError');
  });

  it('should have correct aria-describedby when only description is present', () => {
    render(
      <FormInput
        {...defaultProps}
        errorMessage=""
        description="This is a description"
      />
    );

    const input = screen.getByRole('textbox');

    expect(input).toHaveAttribute('aria-describedby', 'testInputDescription');
  });

  it('should have correct aria-describedby when neither error nor description is present', () => {
    render(<FormInput {...defaultProps} errorMessage="" description="" />);

    const input = screen.getByRole('textbox');

    expect(input).toHaveAttribute('aria-describedby', '');
  });
});
