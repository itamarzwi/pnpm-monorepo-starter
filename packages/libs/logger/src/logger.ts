import chalk from 'chalk';
import { type RequestHandler } from 'express';
import winston, { type Logger } from 'winston';

import { IS_DEV } from '@org/utils';

import { logFormatter } from './log-formatter.js';
import { prettyFormatter } from './pretty-formatter.js';

const getAutoLocation = () => {
  // The magic number 4:
  // [0] Error:
  // [1]   at getAutoLocation
  // [2]   at logWithLocation
  // [3]   at Object.info/warn/error
  // [4]   at ActualCallingFunction
  const location = new Error('_').stack!.split('\n')[4];
  if (!location) {
    return;
  }

  // Support ESM & CJS stack traces for development (tsx cjs) and deployments (node esm)
  // https://regex101.com/r/rMoLss/1
  const re = /^\s*at\s*(?<caller>[^\s]*)?\s+.*(?:packages\/)(?<location>.*:\d+)/;
  const rematch = re.exec(location);
  if (!rematch?.groups) {
    // weird, should not happen
    return location;
  }

  if (!rematch.groups.caller || rematch.groups.caller.includes('<anonymous>')) {
    return rematch.groups.location;
  }

  return `${rematch.groups.location} (${rematch.groups.caller})`;
};

export const LOG_LEVELS = ['error', 'warn', 'info', 'debug', 'silly'] as const;
export type LogLevel = typeof LOG_LEVELS[number];
export const isLogLevel = (level: string): level is LogLevel => LOG_LEVELS.includes(level as LogLevel);
type Tail<T extends unknown[]> = T extends [unknown, ...infer Rest] ? Rest : never;
const getLoggerFunctions = (logger: Logger) => {
  const logWithLocation = (level: LogLevel, message: string, meta: Record<string, unknown> = {}) => {
    const location = getAutoLocation();
    logger.log({
      level,
      message,
      location,
      ...meta,
    });
  };

  const fns: Record<LogLevel, (...args: Tail<Parameters<typeof logWithLocation>>) => void> = {
    /* eslint-disable @stylistic/no-multi-spaces, @stylistic/key-spacing */
    error: (...args: Tail<Parameters<typeof logWithLocation>>) => logWithLocation('error', ...args),
    warn:  (...args: Tail<Parameters<typeof logWithLocation>>) => logWithLocation('warn',  ...args),
    info:  (...args: Tail<Parameters<typeof logWithLocation>>) => logWithLocation('info',  ...args),
    debug: (...args: Tail<Parameters<typeof logWithLocation>>) => logWithLocation('debug', ...args),
    silly: (...args: Tail<Parameters<typeof logWithLocation>>) => logWithLocation('silly', ...args),
    /* eslint-enable @stylistic/no-multi-spaces, @stylistic/key-spacing */
  };

  return fns;
};

export const createLogger = (level: string, pretty: boolean) => {
  const driver = winston.createLogger({
    level,
    format: winston.format.combine(
      winston.format.timestamp(),
      logFormatter(),
      pretty ? prettyFormatter : winston.format.json(),
    ),
    transports: [
      new winston.transports.Console(),
    ],
  });

  return {
    driver,
    ...getLoggerFunctions(driver),
  };
};

const level = IS_DEV ? 'debug' : 'info';
export const logger = createLogger(level, IS_DEV);

const getLogLevel = (statusCode: number) => {
  if (statusCode >= 500) return 'error';

  return 'info';
};

const statusCodeColorized = (statusCode: number) => {
  if (statusCode >= 500) return chalk.red(statusCode);
  if (statusCode >= 400) return chalk.yellow(statusCode);
  if (statusCode >= 300) return chalk.cyan(statusCode);
  return chalk.green(statusCode);
};

const methodColorized = (method: string) => {
  if (method === 'GET') return chalk.greenBright(method);
  if (method === 'POST') return chalk.yellowBright(method);
  if (method === 'PUT') return chalk.cyanBright(method);
  if (method === 'DELETE') return chalk.redBright(method);
  return chalk.white(method);
};

export const requestLogger = (): RequestHandler =>
  (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      // We access the winston logger directly because we want to skip getAutoLocation
      const level = getLogLevel(res.statusCode);
      if (IS_DEV && level !== 'error') {
        logger.driver.log(level, `${methodColorized(req.method)} ${req.originalUrl} ${statusCodeColorized(res.statusCode)} - ${duration}ms`);
        return;
      }

      logger.driver.log(level, 'request completed', {
        // query: req.query,
        // body: req.body,
        headers: {
          'host': req.headers.host,
          'content-length': req.headers['content-length'],
          'content-type': req.headers['content-type'],
          'user-agent': req.headers['user-agent'],
          'ip': (req.headers['x-forwarded-for'] || req.ip),
        },

        res: {
          statusCode: res.statusCode,
        },

        responseTime: duration,
      });
    });

    next();
  };
