import express from 'express';
import cors from 'cors';
import authRoutes from '../src/routes/auth.routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);

export { app }; 