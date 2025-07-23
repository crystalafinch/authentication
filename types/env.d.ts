declare namespace NodeJS {
  interface ProcessEnv {
    API_SCHEME: string;
    API_URL: string;
    API_PORT: string;
    JWT_SECRET: string;
    FE_PORT: string;
  }
}
