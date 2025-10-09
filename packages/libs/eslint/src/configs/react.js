import { defineConfig } from 'eslint/config';
import pluginReact from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';

import { orgBaseConfig } from './base.js';

export const orgReactEslintConfig = defineConfig(
  // Base
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  {
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
  orgBaseConfig,
  // React
  pluginReact.configs.flat.recommended,
  reactHooks.configs['recommended-latest'],
  reactRefresh.configs.vite,
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    rules: {
      '@typescript-eslint/only-throw-error': 'off', // tanstack router throws redirects
      '@typescript-eslint/no-floating-promises': 'off', // Allow fire-and-forget navigation
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',

      // React-only
      'react/react-in-jsx-scope': 'off',
      'react/no-unescaped-entities': 'off',
      'react/prop-types': 'off', // We have TypeScript
      '@stylistic/jsx-one-expression-per-line': ['warn', { allow: 'single-line' }],
    },
  },
  {
    files: ['**/*.{js,ts}'],
    rules: {
      'unicorn/filename-case': ['error', { case: 'kebabCase' }],
    },
  },
  {
    files: ['**/*.{jsx,tsx}'],
    rules: {
      'unicorn/filename-case': ['error', { case: 'pascalCase' }],
    },
  },
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
);

export default orgReactEslintConfig;
