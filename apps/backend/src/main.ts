import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = process.env.API_URL;
const API_PORT = Number(process.env.API_PORT);
const FE_PORT = process.env.FE_PORT;

const app = express();

const corsOptions = {
  origin: `${API_URL}:${FE_PORT}`,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json());

app.use('/api/auth', authRouter);

app.listen(API_PORT, API_URL, () => {
  console.log(`[ ready ] ${API_URL}:${API_PORT}`);
});
