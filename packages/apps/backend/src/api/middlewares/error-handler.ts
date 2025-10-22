import { type NextFunction, type Request, type Response } from 'express';

import { AppError } from '@org/errors';
import { logger } from '@org/logger';

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof AppError) {
    logger.debug('AppError', { error, url: req.originalUrl });
    return res.status(error.status).json({
      error: error.message,
    });
  }

  logger.error('Unexpected server error', { error, url: req.originalUrl });

  res.status(500).json({
    error: 'Internal server error',
  });
};
