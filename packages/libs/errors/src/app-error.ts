import { type ErrorType } from './error-types.js';

export interface ErrorMeta {
  originalError?: Error;
  [key: string]: unknown;
}

export interface AppErrorArgs {
  message?: string;
  type?: ErrorType;
  status?: number;
  meta?: ErrorMeta | undefined;
}

export class AppError extends Error {
  status: number;
  type: ErrorType;
  meta?: ErrorMeta;

  constructor(message: string, meta: ErrorMeta);
  constructor(message: string, type?: ErrorType, status?: number, meta?: ErrorMeta);
  constructor(args: AppErrorArgs);
  constructor(messageOrArgs: string | AppErrorArgs, metaOrType?: ErrorMeta | ErrorType, maybeStatus?: number, maybeMeta?: ErrorMeta) {
    let message = '';
    let type: ErrorType = 'internal-server-error';
    let status = 500;
    let meta: ErrorMeta | undefined;

    if (typeof messageOrArgs === 'object') {
      // new AppError({ message, type, status, meta })
      message = messageOrArgs.message ?? '';
      type = messageOrArgs.type ?? type;
      status = messageOrArgs.status ?? status;
      meta = messageOrArgs.meta;
    } else {
      // new AppError(message, meta) or new AppError(message, type?, status?)
      message = messageOrArgs;

      if (typeof metaOrType === 'object') {
        // new AppError(message, meta)
        meta = metaOrType;
      } else {
        // new AppError(message, type?, status?)
        type = metaOrType ?? type;
        status = maybeStatus ?? status;
        meta = maybeMeta;
      }
    }

    super(message);
    this.meta = meta;
    this.status = status;
    this.type = type;

    Object.defineProperty(this, 'message', { enumerable: true });
    Object.defineProperty(this, 'stack', { enumerable: true });
  }

  /** Returns a serialized object to be sent back to the client */
  serialize() {
    return {
      message: this.message,
      type: this.type,
    };
  }
}
