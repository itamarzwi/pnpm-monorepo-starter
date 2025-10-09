import assert from 'node:assert/strict';
import { test } from 'node:test';

import { type IRouterMatcher, type Request, type Response } from 'express';
import { z } from 'zod';

import { AppBadRequestError } from '@falcon-analytics/errors';

import { validateBody, validateParams, validateQuery, validateRequest } from './index.js';

// Mocks
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockRequest = (data = {}) => ({ body: {}, query: {}, params: {}, ...data }) as unknown as Request<any, any, any, any>;
const mockResponse = () => ({} as unknown as Response);
const mockNext = () => {
  let called = false;
  const next = () => {
    called = true;
  };

  return { next, wasCalled: () => called };
};

// Tests
void test('validateRequest passes with valid data', () => {
  const schema = z.object({ name: z.string() });
  const middleware = validateRequest({
    body: schema,
    query: schema,
    params: schema,
  });

  const req = mockRequest({ body: { name: 'John Doe' }, query: { name: 'John Doe' }, params: { name: 'John Doe' } });
  const res = mockResponse();
  const { next, wasCalled } = mockNext();

  assert.doesNotThrow(() => middleware(req, res, next));
  assert.strictEqual(wasCalled(), true);
});

void test('validateRequest throws with invalid body', () => {
  const schema = z.object({ name: z.string() });
  const middleware = validateRequest({
    body: schema,
    query: schema,
    params: schema,
  });

  const req = mockRequest({ body: { name: 2 }, query: { name: 'John Doe' }, params: { name: 'John Doe' } });
  const res = mockResponse();
  const { next, wasCalled } = mockNext();

  assert.throws(() => middleware(req, res, next), AppBadRequestError);
  assert.strictEqual(wasCalled(), false);
});

void test('validateRequest throws with invalid query', () => {
  const schema = z.object({ name: z.string() });
  const middleware = validateRequest({
    body: schema,
    query: schema,
    params: schema,
  });

  const req = mockRequest({ body: { name: 'John Doe' }, query: {}, params: { name: 'John Doe' } });
  const res = mockResponse();
  const { next, wasCalled } = mockNext();

  assert.throws(() => middleware(req, res, next), AppBadRequestError);
  assert.strictEqual(wasCalled(), false);
});

void test('validateRequest throws with invalid params', () => {
  const schema = z.object({ name: z.string() });
  const middleware = validateRequest({
    body: schema,
    query: schema,
    params: schema,
  });

  const req = mockRequest({ body: { name: 'John Doe' }, query: { name: 'John Doe' }, params: { name1: 'John Doe' } });
  const res = mockResponse();
  const { next, wasCalled } = mockNext();

  assert.throws(() => middleware(req, res, next), AppBadRequestError);
  assert.strictEqual(wasCalled(), false);
});

void test('validateBody passes with valid body', () => {
  const schema = z.object({ name: z.string() });
  const middleware = validateBody(schema);

  const req = mockRequest({ body: { name: 'John Doe' } });
  const res = mockResponse();
  const { next, wasCalled } = mockNext();

  assert.doesNotThrow(() => middleware(req, res, next));
  assert.strictEqual(wasCalled(), true);
});

void test('validateBody throws with invalid body', () => {
  const schema = z.object({ name: z.string() });
  const middleware = validateBody(schema);

  const req = mockRequest({ body: { age: 25 } });
  const res = mockResponse();
  const { next, wasCalled } = mockNext();

  assert.throws(() => middleware(req, res, next), AppBadRequestError);
  assert.strictEqual(wasCalled(), false);
});

void test('validateQuery passes with valid query', () => {
  const schema = z.object({ search: z.string() });
  const middleware = validateQuery(schema);

  const req = mockRequest({ query: { search: 'query' } });
  const res = mockResponse();
  const { next, wasCalled } = mockNext();

  assert.doesNotThrow(() => middleware(req, res, next));
  assert.strictEqual(wasCalled(), true);
});

void test('validateQuery throws with invalid query', () => {
  const schema = z.object({ search: z.string() });
  const middleware = validateQuery(schema);

  const req = mockRequest({ query: { page: 1 } });
  const res = mockResponse();
  const { next, wasCalled } = mockNext();

  assert.throws(() => middleware(req, res, next), AppBadRequestError);
  assert.strictEqual(wasCalled(), false);
});

void test('validateParams passes with valid params', () => {
  const schema = z.object({ id: z.string() });
  const middleware = validateParams(schema);

  const req = mockRequest({ params: { id: '123' } });
  const res = mockResponse();
  const { next, wasCalled } = mockNext();

  assert.doesNotThrow(() => middleware(req, res, next));
  assert.strictEqual(wasCalled(), true);
});

void test('validateParams throws with invalid params', () => {
  const schema = z.object({ id: z.string() });
  const middleware = validateParams(schema);

  const req = mockRequest({ params: { id: 123 } });
  const res = mockResponse();
  const { next, wasCalled } = mockNext();

  assert.throws(() => middleware(req, res, next), AppBadRequestError);
  assert.strictEqual(wasCalled(), false);
});

// TypeScript compile time checks
// This block will never run, but it is here to ensure the types are correct at compile time
if (process.env.TYPE_CHECKS_BLOCK) {
  const routerMatcher = null as unknown as IRouterMatcher<'get'>;

  const schema = z.object({ name: z.string() });

  routerMatcher('/', validateRequest({ body: schema }), (req, res, next) => {
    // @ts-expect-error This should not exist
    console.log(req.body.notExists);

    // This should exist
    console.log(req.body.name);
  });

  routerMatcher('/', validateBody(schema), (req, res, next) => {
    // @ts-expect-error This should not exist
    console.log(req.body.notExists);

    // @ts-expect-error Type should be unknown
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    console.log(req.query.shouldBeUnknown.toUpperCase());

    // This should exist
    console.log(req.body.name);
  });

  routerMatcher('/', validateQuery(schema), (req, res, next) => {
    // @ts-expect-error This should not exist
    console.log(req.query.notExists);

    // This should exist
    console.log(req.query.name);
  });

  routerMatcher('/', validateParams(schema), (req, res, next) => {
    // @ts-expect-error This should not exist
    console.log(req.params.notExists);

    // This should exist
    console.log(req.params.name);
  });

  routerMatcher('/',
    validateQuery(z.object({
      date: z.string().datetime().pipe(z.coerce.date()),
    })),
    (req, res, next) => {
      // req.query.date should be a Date
      console.log(req.query.date.toISOString());
    });
}
