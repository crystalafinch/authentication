import './instrument';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { authRouter } from './routes/auth';
import dotenv from 'dotenv';
import * as Sentry from '@sentry/node';
import { API_SCHEME, API_URL, API_PORT, FE_PORT } from './consts';

dotenv.config();

const app = express();

const corsOptions = {
  origin: `${API_SCHEME}://${API_URL}:${FE_PORT}`,
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));

app.use(cookieParser());

app.use(express.json());

app.use('/api/auth', authRouter);

// Add this after all routes,
// but before any and other error-handling middlewares are defined
Sentry.setupExpressErrorHandler(app);

app.listen(API_PORT, API_URL, () => {
  console.log(`[ ready ] ${API_URL}:${API_PORT}`);
});
