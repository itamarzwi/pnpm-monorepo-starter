import { type RequestHandler } from 'express';
import { type z, type ZodError, type ZodType } from 'zod';

import { AppBadRequestError } from '@falcon-analytics/errors';

// Code adapted from https://github.com/Aquila169/zod-express-middleware

export interface RequestValidationSchemas<ParamsSchema, QuerySchema, BodySchema> {
  params?: ParamsSchema;
  query?: QuerySchema;
  body?: BodySchema;
}

/** @returns Parsed object if valid, undefined otherwise */
const validate = <T extends ZodType<unknown>>(
  schema: T,
  obj: unknown,
  errors: ZodError[],
): z.infer<T> | undefined => {
  const parsed = schema.safeParse(obj);
  if (!parsed.success) {
    errors.push(parsed.error);
    return;
  }

  return parsed.data;
};

type ValidateRequest = <
  ParamsSchema extends ZodType = ZodType,
  QuerySchema extends ZodType = ZodType,
  BodySchema extends ZodType = ZodType,
>(schemas: RequestValidationSchemas<ParamsSchema, QuerySchema, BodySchema>)
// We are not enforcing the type of the response body
// eslint-disable-next-line @typescript-eslint/no-explicit-any
=> RequestHandler<z.infer<ParamsSchema>, any, z.infer<BodySchema>, z.infer<QuerySchema>>;

export const validateRequest: ValidateRequest = ({ params, query, body }) =>
  (req, res, next) => {
    const errors: ZodError[] = [];

    if (body) req.body = validate(body, req.body, errors) ?? req.body;
    if (params) req.params = validate(params, req.params, errors) ?? req.params;
    if (query) {
      Object.defineProperty(req, 'query', {
        value: { ...req.query as object },
        writable: true,
        enumerable: true,
        configurable: true,
      });
      req.query = validate(query, req.query, errors) ?? req.query;
    }

    if (errors.length > 0) {
      const errorMessage = errors
        .flatMap((error) => error.issues.map((issue) => `${issue.path.join('.')} is ${issue.message}`))
        .join(', ');

      throw new AppBadRequestError(errorMessage);
    }

    next();
  };

export const validateBody = <T extends ZodType>(bodySchema: T) => validateRequest({ body: bodySchema });
export const validateQuery = <T extends ZodType>(querySchema: T) => validateRequest({ query: querySchema });
export const validateParams = <T extends ZodType>(paramsSchema: T) => validateRequest({ params: paramsSchema });
