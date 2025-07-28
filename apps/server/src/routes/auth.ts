import { Router } from 'express';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sleep } from '../utils';
import * as Sentry from '@sentry/node';

const users = new Map<string, { password: string }>();
const JWT_SECRET = process.env.JWT_SECRET;
const ERRORS = {
  INVALID_CREDENTIALS: 'Invalid credentials',
  INVALID_EMAIL: 'Invalid email',
  NO_USER_EXISTS: 'No user exists with this email',
  ACCOUNT_ALREADY_EXISTS: 'An account with this email already exists',
};

export const authRouter = Router();

authRouter.post('/create-account', async (req, res) => {
  const { email, password } = req.body;
  await sleep(3000);

  if (users.has(email)) {
    Sentry.setContext('create_account_attempt', {
      email,
    });
    Sentry.captureException(new Error(ERRORS.ACCOUNT_ALREADY_EXISTS));
    return res.status(400).json({ error: ERRORS.INVALID_CREDENTIALS });
  }

  const hash = await bcrypt.hash(password, 10);
  users.set(email, { password: hash });

  const token = jwt.sign({ email }, JWT_SECRET);
  res.status(201).json({ ok: true, data: { user: { email }, token } });
});

authRouter.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  await sleep(3000);

  if (!validator.isEmail(email)) {
    Sentry.setContext('signin_attempt', {
      email,
    });
    Sentry.captureException(new Error(ERRORS.INVALID_EMAIL));
    return res.status(400).json({ error: ERRORS.INVALID_EMAIL });
  }

  const user = users.get(email);

  if (!user) {
    Sentry.setContext('signin_attempt', {
      email,
    });
    Sentry.captureException(new Error(ERRORS.NO_USER_EXISTS));
    return res.status(400).json({ error: ERRORS.INVALID_CREDENTIALS });
  }

  if (!(await bcrypt.compare(password, user.password))) {
    Sentry.setContext('signin_attempt', {
      email,
    });
    Sentry.captureException(new Error(ERRORS.INVALID_CREDENTIALS));
    return res.status(400).json({ error: ERRORS.INVALID_CREDENTIALS });
  }
  const token = jwt.sign({ email }, JWT_SECRET);
  res.json({ ok: true, data: { user: { email }, token } });
});
