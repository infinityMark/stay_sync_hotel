// src/app.ts
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import routes from './routes/index';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();

app.use('/', routes);

export default app;
