import { Router } from 'express';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const users = new Map<string, { password: string }>();
const JWT_SECRET = process.env.JWT_SECRET ?? 'secret'; // TODO: Remove

export const authRouter = Router();

authRouter.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  if (users.has(email)) {
    return res.status(409).json({ error: 'User already exists' });
  }

  const hash = await bcrypt.hash(password, 10);
  users.set(email, { password: hash });

  res.status(201).json({ message: 'User created' });
});

authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  const user = users.get(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ email }, JWT_SECRET);
  res.json({ token });
});
