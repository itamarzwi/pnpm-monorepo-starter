import path from 'node:path';

import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import { defineConfig } from 'eslint/config';
import importPlugin from 'eslint-plugin-import';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import unusedImports from 'eslint-plugin-unused-imports';
import tseslint from 'typescript-eslint';

export const orgBaseEslintConfig = defineConfig([
  // Base
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { ignores: ['**/dist', '**/build', '**/bin', '**/coverage', '**/out', '**/.next'] },
  { plugins: { js }, extends: ['js/recommended'] },
  {
    languageOptions: {
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
  },
  // TypeScript
  ...tseslint.configs.recommendedTypeChecked.map((config) => ({
    ...config,
    files: ['**/*.{ts,tsx}'],
  })),
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: path.resolve(import.meta.dirname, '../../../'),
        projectService: true,
      },
    },
    rules: {
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { fixStyle: 'inline-type-imports', prefer: 'type-imports' },
      ],
      '@typescript-eslint/return-await': ['error', 'always'],
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: false },
      ],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^(req$|res$|next$|reject$|_)',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/unbound-method': ['error', { ignoreStatic: true }],
    },
  },
  // Unicorn
  // TODO: CHANGE. Remove recommended, pick and choose rules manually
  eslintPluginUnicorn.configs.recommended,
  {
    rules: {
      'unicorn/consistent-function-scoping': 'off',
      'unicorn/explicit-length-check': 'off',
      'unicorn/filename-case': 'off',
      'unicorn/import-style': 'off',
      'unicorn/no-array-for-each': 'off',
      'unicorn/no-array-callback-reference': 'off', // This is the dumbest rule in the history of humankind
      'unicorn/no-array-reverse': 'off',
      'unicorn/no-null': 'off',
      'unicorn/prefer-query-selector': 'off',
      'unicorn/prefer-string-raw': 'off',
      'unicorn/prefer-switch': 'off',
      'unicorn/prevent-abbreviations': 'off',
    },
  },
  // Style
  stylistic.configs.customize({
    braceStyle: '1tbs',
    semi: true,
  }),
  {
    rules: {
      'arrow-body-style': 'warn',
      '@stylistic/arrow-parens': ['warn', 'always'],
      '@stylistic/space-before-function-paren': 'off',
    },
  },
  // Imports
  importPlugin.flatConfigs.recommended,
  {
    // This object must be set after importPlugin.flatConfigs.recommended to override its default ecmaVersion
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
  {
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      'import/namespace': ['error', { allowComputed: true }],
      'import/no-duplicates': 'warn',
      'import/named': 'off', // TypeScript handles this
      'import/no-unresolved': 'off', // TypeScript handles this
      'unused-imports/no-unused-imports': 'warn',
    },
  },
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/exports': 'warn',
      'simple-import-sort/imports': ['warn', {
        groups: [
          // Side effect imports.
          ['^\\u0000'],
          // Node.js builtins prefixed with `node:`.
          ['^node:'],
          // Packages.
          ['^@?\\w'],
          // Internal packages
          ['^@org/'],
          // Absolute imports and other imports such as Vue-style `@/foo`.
          // Anything not matched in another group.
          ['^'],
          // Relative imports.
          // Anything that starts with a dot.
          ['^\\.'],
        ],
      }],
    },
  },
  // Others
  {
    rules: {
      'prefer-arrow-callback': 'error',
      'eqeqeq': 'error',
      'no-empty-pattern': ['error', { allowObjectPatternsAsParameters: true }],
      'no-sequences': 'error',
    },
  },
  // Special case for eslint.config.mjs
  {
    files: ['eslint.config.mjs'],
    rules: {
      'import/no-default-export': 'off',
      'unicorn/prefer-export-from': 'off',
    },
  },
]);

export default orgBaseEslintConfig;
