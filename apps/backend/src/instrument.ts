import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  release: 'auth-service@1.0.0',
  tracesSampleRate: 1.0,
});
