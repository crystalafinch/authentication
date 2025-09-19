export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const API_SCHEME = process.env.API_SCHEME;
export const API_URL = process.env.API_URL;
export const API_PORT = Number(process.env.API_PORT);
export const FE_PORT = process.env.FE_PORT;

export const ERRORS = {
  INVALID_CREDENTIALS: 'Invalid credentials',
  INVALID_EMAIL: 'Invalid email',
  NO_USER_EXISTS: 'No user exists with this email',
  ACCOUNT_ALREADY_EXISTS: 'An account with this email already exists',
  ACCOUNT_RESET: 'Your account has been reset. Please sign in',
};

export const ERROR_CONTEXT = {
  SIGNIN_ATTEMPT: 'signin_attempt',
  CREATE_ACCOUNT_ATTEMPT: 'create_account_attempt',
  DELETE_ACCOUNT_ATTEMPT: 'delete_account_attempt',
};
