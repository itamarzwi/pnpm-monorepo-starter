import { StatusCodes } from 'http-status-codes';

import { AppError, type ErrorMeta } from './app-error.js';
import { type ErrorType } from './error-types.js';

// Common errors get a dedicated class for easier throwing

export class AppBadRequestError extends AppError {
  constructor(message?: string, type?: ErrorType, meta?: ErrorMeta);
  constructor(message?: string, meta?: ErrorMeta);
  constructor(message = '', typeOrMeta: ErrorType | ErrorMeta = `${StatusCodes.BAD_REQUEST}`, maybeMeta?: ErrorMeta) {
    const type = typeof typeOrMeta === 'string' ? typeOrMeta : `${StatusCodes.BAD_REQUEST}`;
    const meta = typeof typeOrMeta === 'object' ? typeOrMeta : maybeMeta;
    super(message, type, StatusCodes.BAD_REQUEST, meta);
  }
}

export class AppUnauthorizedError extends AppError {
  constructor(message?: string, type?: ErrorType, meta?: ErrorMeta);
  constructor(message?: string, meta?: ErrorMeta);
  constructor(message = '', typeOrMeta: ErrorType | ErrorMeta = `${StatusCodes.UNAUTHORIZED}`, maybeMeta?: ErrorMeta) {
    const type = typeof typeOrMeta === 'string' ? typeOrMeta : `${StatusCodes.UNAUTHORIZED}`;
    const meta = typeof typeOrMeta === 'object' ? typeOrMeta : maybeMeta;
    super(message, type, StatusCodes.UNAUTHORIZED, meta);
  }
}

export class AppForbiddenError extends AppError {
  constructor(message?: string, type?: ErrorType, meta?: ErrorMeta);
  constructor(message?: string, meta?: ErrorMeta);
  constructor(message = '', typeOrMeta: ErrorType | ErrorMeta = `${StatusCodes.FORBIDDEN}`, maybeMeta?: ErrorMeta) {
    const type = typeof typeOrMeta === 'string' ? typeOrMeta : `${StatusCodes.FORBIDDEN}`;
    const meta = typeof typeOrMeta === 'object' ? typeOrMeta : maybeMeta;
    super(message, type, StatusCodes.FORBIDDEN, meta);
  }
}

export class AppNotFoundError extends AppError {
  constructor(message?: string, type?: ErrorType, meta?: ErrorMeta);
  constructor(message?: string, meta?: ErrorMeta);
  constructor(message = '', typeOrMeta: ErrorType | ErrorMeta = `${StatusCodes.NOT_FOUND}`, maybeMeta?: ErrorMeta) {
    const type = typeof typeOrMeta === 'string' ? typeOrMeta : `${StatusCodes.NOT_FOUND}`;
    const meta = typeof typeOrMeta === 'object' ? typeOrMeta : maybeMeta;
    super(message, type, StatusCodes.NOT_FOUND, meta);
  }
}

export class AppConflictError extends AppError {
  constructor(message?: string, type?: ErrorType, meta?: ErrorMeta);
  constructor(message?: string, meta?: ErrorMeta);
  constructor(message = '', typeOrMeta: ErrorType | ErrorMeta = `${StatusCodes.CONFLICT}`, maybeMeta?: ErrorMeta) {
    const type = typeof typeOrMeta === 'string' ? typeOrMeta : `${StatusCodes.CONFLICT}`;
    const meta = typeof typeOrMeta === 'object' ? typeOrMeta : maybeMeta;
    super(message, type, StatusCodes.CONFLICT, meta);
  }
}
