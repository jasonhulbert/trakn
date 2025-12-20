// @ts-check
import { defineConfig } from 'eslint/config';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

export default defineConfig(
  {
    ignores: ['node_modules/**', '.branches/**', '.temp/**', 'migrations/**'],
  },
  {
    files: ['**/*.ts'],
    extends: [eslint.configs.recommended, ...tseslint.configs.recommended],
    plugins: {
      prettier: prettierPlugin,
    },
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        Deno: 'readonly',
      },
    },
    rules: {
      'prettier/prettier': 'error',
      // Allow console logs in Supabase functions
      'no-console': 'off',
    },
  },
  prettierConfig
);
