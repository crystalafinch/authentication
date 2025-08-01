declare namespace NodeJS {
  interface ProcessEnv {
    API_SCHEME: string;
    API_URL: string;
    API_PORT: string;
    FE_PORT: string;
    REFRESH_TOKEN_SECRET: string;
    ACCESS_TOKEN_SECRET: string;
    SENTRY_AUTH_TOKEN: string;
    SENTRY_DSN: string;
  }
}
