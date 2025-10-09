import chalk, { type ChalkInstance } from 'chalk';
import { colorize } from 'json-colorizer';
import stringify from 'safe-stable-stringify';
import winston from 'winston';

// This is just a good amount of spaces that looks good
const spaces = ' '.repeat(0);
const hasError = (obj: Record<string, unknown>) =>
  Object.entries(obj).some(([key, value]) =>
    key === 'error'
    && typeof value === 'object'
    && value !== null
    && 'message' in value
    && 'stack' in value,
  );

const metadataFormatter = (metadata: Record<string, unknown>) => {
  const keys = Object.keys(metadata);

  const metadataHasError = hasError(metadata);

  let formatted = ` ${colorize(stringify(metadata), {
    indent: (keys.length > 1 || typeof metadata[keys[0]] === 'object') ? 4 : 0,
    colors: {
      StringKey: metadataHasError ? chalk.red : chalk.hex('#7bbdfc'),
      StringLiteral: metadataHasError ? chalk.redBright : chalk.hex('#fd81e5'),
      BooleanLiteral: chalk.greenBright,
      NumberLiteral: chalk.yellow,
      NullLiteral: chalk.hex('#AAA'),
      Brace: chalk.white,
      Bracket: chalk.white,
      Colon: chalk.white,
      Whitespace: chalk.white,
      Comma: chalk.white,
    },
  })}`
    .replaceAll('\n', `\n${spaces}`);

  formatted = formatted.includes('\n')
    ? `\n${spaces}${formatted.slice(1)}`
    : formatted.replace('{', '{ ').replace('}', ' }');

  if (metadataHasError) {
    // We want to make the stack trace more readable for errors so we replace lines that start with "at ..."
    // If you ever need to work on this, regex101.com is your friend - https://regex101.com/r/HPw4Si/2
    formatted = formatted
      .replaceAll('\\n', '\n')
      .replaceAll(/(\s+at.*)\(((.*:)(.+:.+)|.*)\)/g, (line, ...groups) => {
        if (groups[3]) {
          return `${chalk.white(`${groups[0]}(`)}${chalk.cyan(groups[2])}${chalk.cyanBright(groups[3])}${chalk.white(')')}`;
        }

        return `${chalk.white(`${groups[0]}(`)}${chalk.cyan(groups[1])}${chalk.white(')')}`;
      });
  }

  return formatted;
};

const levelToColor: Record<string, ChalkInstance> = {
  error: chalk.red,
  warn: chalk.yellow,
  info: chalk.green,
  debug: chalk.magenta,
  silly: chalk.cyan,
};

export const prettyFormatter = winston.format.printf((info) => {
  const { timestamp, level, message, location, ...rest } = info;

  const timeStr = `[${timestamp as string}]`;
  const levelStr = levelToColor[level](level.toUpperCase());
  const restStr = Object.keys(rest).length > 0 ? metadataFormatter(rest) : '';
  const locationStr = typeof location === 'string' ? ` ${location}` : '';

  return `${timeStr} ${levelStr}${chalk.cyan(locationStr)} ${chalk.white(message)}${restStr}`;
});
