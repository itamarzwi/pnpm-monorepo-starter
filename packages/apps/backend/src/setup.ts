import { logger } from '@org/logger';

// Wow so pretty AI emojis

// eslint-disable-next-line @typescript-eslint/require-await
export const dbSetup = async() => {
  logger.info('🔌 Connecting to database...');

  // TODO: DB Setup

  logger.info('✅ Database connected');
};

// eslint-disable-next-line @typescript-eslint/require-await
export const dbTeardown = async() => {
  logger.info('🔌 Disconnecting from database...');

  // TODO: DB Teardown

  logger.info('✅ Database disconnected');
};

export const setup = async() => {
  logger.info('🚀 Starting application setup...');

  await dbSetup();

  logger.info('✅ Application setup complete');
};

export const teardown = async() => {
  logger.info('🛑 Starting application teardown...');

  await dbTeardown();

  logger.info('✅ Application teardown complete');
};
