import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const portFE = process.env.PORT_FE ? Number(process.env.PORT_FE) : 4200;

const app = express();

const corsOptions = {
  origin: `http://${host}:${portFE}`,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json());

app.use('/api/auth', authRouter);

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
