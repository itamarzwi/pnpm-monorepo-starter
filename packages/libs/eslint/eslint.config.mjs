import { defineConfig } from 'eslint/config';

import { orgNodeEslintConfig } from './src/configs/node.js';

export default defineConfig([
  { ignores: ['src/configs/*.d.ts'] },
  orgNodeEslintConfig,
  {
    rules: {
      'import/no-default-export': 'off',
    },
  },
]);
