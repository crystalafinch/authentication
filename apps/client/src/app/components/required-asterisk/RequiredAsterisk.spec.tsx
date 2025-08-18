import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import RequiredAsterisk from './RequiredAsterisk';

describe('RequiredAsterisk', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<RequiredAsterisk />);
    expect(baseElement).toBeTruthy();
  });

  it('should render the asterisk symbol', () => {
    render(<RequiredAsterisk />);

    const asterisk = screen.getByText('*');
    expect(asterisk).toBeInTheDocument();
  });

  it('should render screen reader text by default', () => {
    render(<RequiredAsterisk />);

    const srText = screen.getByText('required');
    expect(srText).toBeInTheDocument();
  });

  it('should hide screen reader text when showSrOnly is false', () => {
    render(<RequiredAsterisk showSrOnly={false} />);

    const srText = screen.queryByText('required');
    expect(srText).not.toBeInTheDocument();
  });

  it('should have correct accessibility attributes on asterisk', () => {
    render(<RequiredAsterisk />);

    const asterisk = screen.getByText('*');
    expect(asterisk).toHaveAttribute('aria-hidden', 'true');
  });

  it('should have correct styling classes on asterisk', () => {
    render(<RequiredAsterisk />);

    const asterisk = screen.getByText('*');
    expect(asterisk).toHaveClass('font-medium', 'text-red-700');
  });

  it('should have correct styling classes on screen reader text', () => {
    render(<RequiredAsterisk />);

    const srText = screen.getByText('required');
    expect(srText).toHaveClass('sr-only');
  });

  it('should render both elements when showSrOnly is true', () => {
    render(<RequiredAsterisk showSrOnly={true} />);

    const asterisk = screen.getByText('*');
    const srText = screen.getByText('required');

    expect(asterisk).toBeInTheDocument();
    expect(srText).toBeInTheDocument();
  });

  it('should render only asterisk when showSrOnly is false', () => {
    render(<RequiredAsterisk showSrOnly={false} />);

    const asterisk = screen.getByText('*');
    const srText = screen.queryByText('required');

    expect(asterisk).toBeInTheDocument();
    expect(srText).not.toBeInTheDocument();
  });

  it('should handle undefined showSrOnly prop', () => {
    render(<RequiredAsterisk showSrOnly={undefined} />);

    const asterisk = screen.getByText('*');
    const srText = screen.getByText('required');

    expect(asterisk).toBeInTheDocument();
    expect(srText).toBeInTheDocument();
  });

  it('should handle null showSrOnly prop', () => {
    render(<RequiredAsterisk showSrOnly={null as any} />);

    const asterisk = screen.getByText('*');
    const srText = screen.queryByText('required');

    expect(asterisk).toBeInTheDocument();
    expect(srText).not.toBeInTheDocument();
  });

  it('should handle explicit true showSrOnly prop', () => {
    render(<RequiredAsterisk showSrOnly={true} />);

    const asterisk = screen.getByText('*');
    const srText = screen.getByText('required');

    expect(asterisk).toBeInTheDocument();
    expect(srText).toBeInTheDocument();
  });

  it('should handle explicit false showSrOnly prop', () => {
    render(<RequiredAsterisk showSrOnly={false} />);

    const asterisk = screen.getByText('*');
    const srText = screen.queryByText('required');

    expect(asterisk).toBeInTheDocument();
    expect(srText).not.toBeInTheDocument();
  });

  it('should have correct DOM structure', () => {
    const { container } = render(<RequiredAsterisk />);

    const asterisk = container.querySelector('span[aria-hidden="true"]');
    const srText = container.querySelector('.sr-only');

    expect(asterisk).toBeInTheDocument();
    expect(srText).toBeInTheDocument();
  });

  it('should render without crashing when no props are passed', () => {
    expect(() => {
      render(<RequiredAsterisk />);
    }).not.toThrow();
  });

  it('should render without crashing when showSrOnly is explicitly set', () => {
    expect(() => {
      render(<RequiredAsterisk showSrOnly={true} />);
    }).not.toThrow();

    expect(() => {
      render(<RequiredAsterisk showSrOnly={false} />);
    }).not.toThrow();
  });
});
