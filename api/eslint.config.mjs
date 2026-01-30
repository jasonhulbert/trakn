// @ts-check
import { defineConfig } from 'eslint/config';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import nodePlugin from 'eslint-plugin-n';

export default defineConfig(
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**', '**/*.spec.ts', '**/*.test.ts'],
  },
  {
    files: ['**/*.ts'],
    extends: [eslint.configs.recommended, ...tseslint.configs.recommended],
    plugins: {
      prettier: prettierPlugin,
      n: nodePlugin,
    },
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      'prettier/prettier': 'error',
      'n/file-extension-in-import': ['error', 'always', { '.ts': 'always' }],
    },
  },
  prettierConfig
);
