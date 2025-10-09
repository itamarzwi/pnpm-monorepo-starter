import { defineConfig } from 'eslint/config';
import globals from 'globals';

import { mongooseUseExec } from '../rules/mongoose-use-exec.js';
import { orgBaseEslintConfig } from './base.js';

export const orgNodeEslintConfig = defineConfig(
  // Base
  orgBaseEslintConfig,
  // Node
  { languageOptions: { globals: globals.node } },
  // Imports
  {
    ignores: ['eslint.config.mjs'],
    rules: {
      'import/no-default-export': 'error',
    },
  },
  // Other
  {
    plugins: {
      'mongoose-use-exec': {
        rules: {
          'mongoose-use-exec': mongooseUseExec,
        },
      },
    },
    rules: {
      'mongoose-use-exec/mongoose-use-exec': 'warn',
    },
  },
  {
    ignores: ['**/*.test.ts'],
    rules: {
      'no-console': 'warn',
    },
  },
  {
    rules: {
      'unicorn/filename-case': ['error', { case: 'kebabCase' }],
    },
  },
);

export default orgNodeEslintConfig;
