// TODO: Make all the errors

import { AppError, type ErrorMeta } from './app-error.js';
import { type ErrorType } from './error-types.js';

export class AppBadRequestError extends AppError {
  constructor(message?: string, type?: ErrorType, meta?: ErrorMeta);
  constructor(message?: string, meta?: ErrorMeta);
  constructor(message = '', typeOrMeta: ErrorType | ErrorMeta = 'bad-request', maybeMeta?: ErrorMeta) {
    const type = typeof typeOrMeta === 'string' ? typeOrMeta : 'bad-request';
    const meta = typeof typeOrMeta === 'object' ? typeOrMeta : maybeMeta;

    super(message, type, 400, meta);
  }
};
