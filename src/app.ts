require('dotenv').config();
import express, { NextFunction, Request, Response } from 'express';
import config from 'config';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import AppError from './utils/appError';
import authRouter from './routes/auth.routes';
import userRouter from './routes/user.routes';
import fileRouter from './routes/file.routes';
import folderRouter from './routes/folder.routes';
import streamRouter from './routes/stream.routes';
import validateEnv from './utils/validateEnv';
import redisClient from './utils/connectRedis';


// VALIDATE ENV
validateEnv();

const app = express();

// PAGES

app.get('/audio', (req, res) => {
  res.sendFile('audio.html', { root: './src/views' });
});

// Route for serving video HTML
app.get('/video', (req, res) => {
  res.sendFile('video.html', { root: './src/views' });
});

// MIDDLEWARE

// 1. Body parser
app.use(express.json({ limit: '10kb' }));

// 2. Logger
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// 3. Cookie Parser
app.use(cookieParser());

// 4. Cors
app.use(
  cors({
    origin: config.get<string>('origin'),
    credentials: true,
  })
);

// ROUTES
app.use('/api/auth', authRouter);
app.use('/api/stream', streamRouter);
app.use('/api/users', userRouter);
app.use('/api/folders', folderRouter);
app.use('/api/files', fileRouter);

// HEALTH CHECKER
app.get('/api/healthChecker', async (_, res: Response) => {
  const message = await redisClient.get('try');

  res.status(200).json({
    status: 'success',
    message,
  });
});

// UNHANDLED ROUTE
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(404, `Route ${req.originalUrl} not found`));
});

// GLOBAL ERROR HANDLER
app.use(
  (error: AppError, req: Request, res: Response, next: NextFunction) => {
    error.status = error.status || 'error';
    error.statusCode = error.statusCode || 500;

    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  }
);

export default app;