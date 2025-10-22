import { z } from 'zod';

const configSchema = z.object({
  nodeEnv: z.string(),
  port: z.coerce.number().min(1025).max(65_535),
});

export type Config = z.infer<typeof configSchema>;

const envVarsToCamelCase = () => {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (value === undefined) continue;

    const lowerCasedKey = key.toLowerCase();
    const camelCasedKey = lowerCasedKey.replaceAll(/[^a-z0-9]+([a-z0-9])/g, (_match, group: string) => group.toUpperCase());
    result[camelCasedKey] = value;
  }

  return result;
};

export const config = configSchema.parse(envVarsToCamelCase());
