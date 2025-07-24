import { Router } from 'express';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const users = new Map<string, { password: string }>();
const JWT_SECRET = process.env.JWT_SECRET;

export const authRouter = Router();

authRouter.post('/create-account', async (req, res) => {
  const { email, password } = req.body;
  if (users.has(email)) {
    return res.status(409).json({ error: 'User already exists' });
  }

  const hash = await bcrypt.hash(password, 10);
  users.set(email, { password: hash });

  const token = jwt.sign({ email }, JWT_SECRET);
  res.status(201).json({ ok: true, data: { user: { email }, token } });
});

authRouter.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  const user = users.get(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ email }, JWT_SECRET);
  res.json({ ok: true, data: { user: { email }, token } });
});
