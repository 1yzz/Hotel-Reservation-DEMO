import { Request, Response, NextFunction } from 'express';
import Logger from '../config/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const message = `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`;
    
    if (res.statusCode >= 400) {
      Logger.error(message);
    } else {
      Logger.http(message);
    }
  });

  next();
};

export const errorLogger = (err: Error, req: Request, res: Response, next: NextFunction) => {
  Logger.error(`${err.name}: ${err.message}`);
  Logger.error(err.stack);
  next(err);
}; 