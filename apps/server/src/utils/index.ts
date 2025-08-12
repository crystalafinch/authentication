import * as Sentry from '@sentry/node';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const handleError = (
  error: unknown,
  context?: string,
  contextData: { [key: string]: unknown } | null = null
): unknown => {
  Sentry.captureException(error);
  if (context && contextData) {
    Sentry.setContext(context, contextData);
  }
  return error;
};

export { sleep, handleError };
