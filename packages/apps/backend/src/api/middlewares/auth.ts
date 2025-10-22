import type { NextFunction, Request, RequestHandler, Response } from 'express';

import { AppForbiddenError, AppUnauthorizedError } from '@org/errors';

export type UserRole = 'user' | 'backoffice' | 'admin';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user: {
        email: string;
        name: string;
        roles: UserRole[];
      };
    }
  }
}

// We absolutely must have `RequestHandler<any, any, any, any>` to make this work alongside our validateRequest middlewares
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const auth = (): RequestHandler<any, any, any, any> =>
  (req, res, next) => {
    // TODO: Auth logic. For now all users are considered authorized
    const isAuthorized = true;
    if (!isAuthorized) {
      throw new AppUnauthorizedError();
    }

    req.user = {
      email: 'john@test.com',
      name: 'John Doe',
      roles: ['admin', 'user'],
    };

    return next();
  };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RequestHandlerAny = (req: Request<any, any, any, any>, res: Response, next: NextFunction) => void;

export function requireRole(role: UserRole): RequestHandlerAny;
export function requireRole(roles: UserRole[]): RequestHandlerAny;
export function requireRole(roleOrRoles: UserRole | UserRole[]): RequestHandlerAny {
  const allowedRoles = Array.isArray(roleOrRoles)
    ? roleOrRoles
    : [roleOrRoles];

  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppUnauthorizedError();
    }

    const userHasRole = allowedRoles.some((role) => req.user.roles.includes(role));
    if (!userHasRole) {
      throw new AppForbiddenError('403', { allowedRoles, roles: req.user.roles });
    }

    return next();
  };
}
