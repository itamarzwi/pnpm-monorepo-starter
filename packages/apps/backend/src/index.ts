import 'dotenv/config';

import path from 'node:path';

import express from 'express';
import helmet from 'helmet';

import { logger, requestLogger } from '@org/logger';
import { IS_DEV } from '@org/utils';

import { errorHandler } from './api/middlewares/error-handler.js';
import { apiRouter } from './api/routes/index.js';
import { config } from './config.js';
import { setup, teardown } from './setup.js';

await setup();

const app = express();
app.set('query parser', 'extended');

app.use(helmet());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(import.meta.dirname, '../public')));

// API routes
app.use(requestLogger());
app.use('/api', apiRouter);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
  logger.info(`🚀 Server running`, {
    port: config.port,
    environment: process.env.NODE_ENV || 'development',
  });

  if (IS_DEV) {
    logger.info(`🌍 API available at: http://localhost:${config.port}/api`);
  }
});

const shutdown = async () => {
  await teardown();

  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
