if (!process.env.NODE_ENV) {
  // eslint-disable-next-line no-console
  console.error('Cannot run without NODE_ENV set');
  process.exit(1);
}

export const NODE_ENV = process.env.NODE_ENV;
export const IS_DEV = process.env.NODE_ENV === 'development';
export const IS_PROD = process.env.NODE_ENV === 'production';
