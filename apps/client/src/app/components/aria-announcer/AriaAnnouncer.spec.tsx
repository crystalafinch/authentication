import { render, screen, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import AriaAnnouncerProvider, { useAnnouncer } from './AriaAnnouncer';

function TestComponent() {
  const announce = useAnnouncer();
  return (
    <div>
      <button onClick={() => announce('Test message', 'polite')}>
        Announce Polite
      </button>
      <button onClick={() => announce('Test message', 'assertive')}>
        Announce Assertive
      </button>
    </div>
  );
}

const mockAssertiveContainer = document.createElement('div');
mockAssertiveContainer.id = 'aria-live-assertive';
const mockPoliteContainer = document.createElement('div');
mockPoliteContainer.id = 'aria-live-polite';

describe('AriaAnnouncer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    document.getElementById = vi.fn((id: string) => {
      if (id === 'aria-live-assertive') return mockAssertiveContainer;
      if (id === 'aria-live-polite') return mockPoliteContainer;
      return null;
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render successfully', () => {
    const { baseElement } = render(
      <AriaAnnouncerProvider>
        <TestComponent />
      </AriaAnnouncerProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should provide announcer function to children', () => {
    render(
      <AriaAnnouncerProvider>
        <TestComponent />
      </AriaAnnouncerProvider>
    );

    expect(screen.getByText('Announce Polite')).toBeInTheDocument();
    expect(screen.getByText('Announce Assertive')).toBeInTheDocument();
  });

  it('should announce polite messages', async () => {
    render(
      <AriaAnnouncerProvider>
        <TestComponent />
      </AriaAnnouncerProvider>
    );

    const button = screen.getByText('Announce Polite');

    act(() => {
      button.click();
    });

    act(() => {
      vi.advanceTimersByTime(1010);
    });

    expect(mockPoliteContainer.textContent).toBe('Test message');
  });

  it('should announce assertive messages', async () => {
    render(
      <AriaAnnouncerProvider>
        <TestComponent />
      </AriaAnnouncerProvider>
    );

    const button = screen.getByText('Announce Assertive');

    act(() => {
      button.click();
    });

    act(() => {
      vi.advanceTimersByTime(1010);
    });

    expect(mockAssertiveContainer.textContent).toBe('Test message');
  });

  it('should queue multiple messages', async () => {
    render(
      <AriaAnnouncerProvider>
        <TestComponent />
      </AriaAnnouncerProvider>
    );

    const button = screen.getByText('Announce Polite');

    act(() => {
      button.click();
      button.click();
      button.click();
    });

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(mockPoliteContainer.textContent).toBe('Test message');
  });

  it('should handle missing containers gracefully', () => {
    document.getElementById = vi.fn(() => null);

    expect(() => {
      render(
        <AriaAnnouncerProvider>
          <TestComponent />
        </AriaAnnouncerProvider>
      );
    }).not.toThrow();
  });

  it('should clear previous messages before announcing new ones', async () => {
    render(
      <AriaAnnouncerProvider>
        <TestComponent />
      </AriaAnnouncerProvider>
    );

    const button = screen.getByText('Announce Polite');

    act(() => {
      button.click();
    });

    act(() => {
      vi.advanceTimersByTime(1010);
    });

    expect(mockPoliteContainer.textContent).toBe('Test message');

    act(() => {
      button.click();
    });

    act(() => {
      vi.advanceTimersByTime(1010);
    });

    expect(mockPoliteContainer.textContent).toBe('Test message');
  });

  it('should handle rapid successive announcements', async () => {
    render(
      <AriaAnnouncerProvider>
        <TestComponent />
      </AriaAnnouncerProvider>
    );

    const button = screen.getByText('Announce Polite');

    act(() => {
      for (let i = 0; i < 5; i++) {
        button.click();
      }
    });

    act(() => {
      vi.advanceTimersByTime(6000);
    });

    expect(mockPoliteContainer.textContent).toBe('Test message');
  });
});
