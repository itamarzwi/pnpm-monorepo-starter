import { type StatusCodes } from 'http-status-codes';

export type ErrorType =
  // First, common http status codes
  | `${StatusCodes.BAD_REQUEST}`
  | `${StatusCodes.UNAUTHORIZED}`
  | `${StatusCodes.FORBIDDEN}`
  | `${StatusCodes.NOT_FOUND}`
  | `${StatusCodes.CONFLICT}`
  | `${StatusCodes.TOO_MANY_REQUESTS}`
  | `${StatusCodes.INTERNAL_SERVER_ERROR}`
    // Then, custom error types that the frontend can translate to error messages
  | 'unknown_error';
