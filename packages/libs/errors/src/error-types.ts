export type ErrorType
    = | 'internal-server-error'
      | 'bad-request'
      | 'unauthorized'
      | 'forbidden'
      | 'not-found'
      | 'conflict';

// TODO: pnpm add http-status-codes