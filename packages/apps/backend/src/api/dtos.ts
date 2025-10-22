import { type z, type ZodType } from 'zod';

import { logger } from '@org/logger';

export const toDtoSingle = <S extends ZodType>(item: z.input<S>, schema: S): z.output<S> => {
  try {
    return schema.parse(item);
  } catch (error) {
    logger.error('Invalid DTO passed', { error, item });
    return item as unknown as z.output<S>; // Fallback to raw item if validation fails
  }
};

export const toDtoArr = <S extends ZodType>(items: Array<z.input<S>>, schema: S): Array<z.output<S>> =>
  items.map((item) => toDtoSingle(item, schema));

export function toDto<S extends ZodType>(item: z.input<S>, schema: S): z.output<S>;
export function toDto<S extends ZodType>(items: Array<z.input<S>>, schema: S): Array<z.output<S>>;
export function toDto<S extends ZodType>(items: z.input<S> | Array<z.input<S>>, schema: S): z.output<S> | Array<z.output<S>> {
  if (Array.isArray(items)) {
    return toDtoArr(items, schema);
  }

  return toDtoSingle(items, schema);
};
