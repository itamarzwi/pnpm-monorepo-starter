import { cloneDeep } from 'lodash-es';
import winston from 'winston';

const getCleanStack = (stack: string) =>
  stack
    .split('\n')
    .filter((line) => !line.includes('node_modules') && !line.includes('node:internal'))
    .join('\n');

const keysToRedact: RegExp[] = [
  /secret/i,
  /token/i,
  /password/i,
  /credentials/i,
];

const processLog = (obj: Record<string, unknown>, path: string[] = []) => {
  if (path.length > 10) {
    // eslint-disable-next-line no-console
    console.error('Maximum log depth exceeded', { path });
    return obj;
  }

  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Error) {
    Object.defineProperty(obj, 'name', { enumerable: true });
    Object.defineProperty(obj, 'message', { enumerable: true });
    if (obj.stack) {
      Object.defineProperty(obj, 'stack', { enumerable: true });
      obj.stack = getCleanStack(obj.stack);
    }

    return obj;
  }

  for (const key of Object.keys(obj)) {
    if (keysToRedact.some((re) => re.test(key))) {
      obj[key] = '***';
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      // Support logging mongoose models
      if ('toJSON' in obj[key] && typeof obj[key]?.toJSON === 'function') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        obj[key] = obj[key].toJSON();
      }

      processLog(obj[key] as Record<string, unknown>, [...path, key]);
    }
  }
};

export const logFormatter = winston.format((info) => {
  info = cloneDeep(info);
  processLog(info);
  return info;
});
