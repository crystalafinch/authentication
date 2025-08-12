import { Router, Response } from 'express';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sleep, handleError } from '../utils';
import { ERRORS, IS_PRODUCTION, API_URL, ERROR_CONTEXT } from '../consts';
import { randomUUID } from 'crypto';

// TODO: Move to shared lib
export type User = {
  id: string;
  email: string;
  passwordHash?: string;
  refreshTokenVersion: number;
};

export type AuthTokens = {
  refreshToken: string;
  accessToken: string;
};

export type TokenData = {
  userId: string;
  refreshTokenVersion?: number;
};

const users = new Map<string, User>(); // TODO: use db

export const authRouter = Router();

const createAuthTokens = (tokenData: TokenData): AuthTokens => {
  const { userId, refreshTokenVersion = 1 } = tokenData;
  const refreshToken = jwt.sign(
    { userId, refreshTokenVersion },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '30d' }
  );

  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15min',
  });

  return { refreshToken, accessToken };
};

const cookieOptions = {
  httpOnly: true,
  secure: IS_PRODUCTION,
  sameSite: 'lax',
  path: '/',
  domain: IS_PRODUCTION ? `.${API_URL}` : '',
} as const;

export const setAuthCookies = (res: Response, tokenData: TokenData): void => {
  const { accessToken, refreshToken } = createAuthTokens(tokenData);
  res.cookie('id', accessToken, cookieOptions);
  res.cookie('rid', refreshToken, cookieOptions);
};

export const clearAuthCookies = (res: Response): void => {
  res.clearCookie('id', cookieOptions);
  res.clearCookie('rid', cookieOptions);
};

export const getUser = (
  identifier: string
): { user: User; passwordHash: string | undefined } | undefined => {
  const getByEmail = validator.isEmail(identifier);

  const user = getByEmail
    ? Array.from(users.values()).find((user) => user.email === identifier)
    : users.get(identifier);

  if (!user) return;

  const values = { user: { ...user }, passwordHash: user.passwordHash };
  delete values.user.passwordHash;

  return values;
};

export const checkTokens = (
  res: Response,
  accessToken: string = '',
  refreshToken: string
): { user: User | null } => {
  // verify access token
  try {
    const data = <TokenData>(
      jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!)
    );
    const user = getUser(data.userId)?.user ?? null;
    return { user };
  } catch {
    // token is expired, check refresh token
  }

  if (!refreshToken) {
    return { user: null };
  }

  // verify refresh token
  const data = <TokenData>(
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!)
  );
  const user = getUser(data.userId)?.user ?? null;

  if (!user || user.refreshTokenVersion !== data?.refreshTokenVersion) {
    clearAuthCookies(res);
    return { user };
  }

  setAuthCookies(res, {
    userId: user.id,
    refreshTokenVersion: user.refreshTokenVersion,
  });
  return { user };
};

authRouter.get('/check-auth', async (req, res) => {
  const { id, rid } = req.cookies;

  try {
    const { user } = checkTokens(res, id, rid);
    res.json({ ok: true, data: { user } });
  } catch (error) {
    handleError(error);
    // TODO: Pass error message into json
    return res.status(400).json({ error: ERRORS.INVALID_CREDENTIALS });
  }
});

authRouter.post('/create-account', async (req, res) => {
  const { email, password } = req.body;
  await sleep(1000); // TODO: remove

  if (!validator.isEmail(email)) {
    handleError(new Error(ERRORS.INVALID_EMAIL), ERROR_CONTEXT.SIGNIN_ATTEMPT, {
      email,
    });
    return res.status(400).json({ error: ERRORS.INVALID_EMAIL });
  }

  const exists = getUser(email)?.user;

  if (exists) {
    handleError(
      new Error(ERRORS.ACCOUNT_ALREADY_EXISTS),
      ERROR_CONTEXT.CREATE_ACCOUNT_ATTEMPT,
      {
        email,
      }
    );
    return res.status(400).json({ error: ERRORS.INVALID_CREDENTIALS });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    id: randomUUID(),
    email,
    refreshTokenVersion: 1,
  };
  users.set(user.id, { ...user, passwordHash });

  setAuthCookies(res, {
    userId: user.id,
    refreshTokenVersion: user.refreshTokenVersion,
  });
  res.status(201).json({
    ok: true,
    data: { user },
  });
});

authRouter.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  await sleep(1000); // TODO: remove

  const userData = getUser(email);
  const user = userData?.user;
  const passwordHash = userData?.passwordHash;

  if (!user) {
    handleError(
      new Error(ERRORS.NO_USER_EXISTS),
      ERROR_CONTEXT.SIGNIN_ATTEMPT,
      {
        email,
      }
    );
    return res.status(400).json({
      error: ERRORS.INVALID_CREDENTIALS,
    });
  }

  if (!(await bcrypt.compare(password, passwordHash))) {
    handleError(
      new Error(ERRORS.INVALID_CREDENTIALS),
      ERROR_CONTEXT.SIGNIN_ATTEMPT,
      {
        email,
      }
    );
    return res.status(400).json({
      error: ERRORS.INVALID_CREDENTIALS,
    });
  }

  setAuthCookies(res, {
    userId: user.id,
    refreshTokenVersion: user.refreshTokenVersion,
  });
  res.json({ ok: true, data: { user } });
});

authRouter.post('/signout', (req, res) => {
  clearAuthCookies(res);
  res.json({ ok: true });
});
