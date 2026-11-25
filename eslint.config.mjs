// @ts-check
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  globalIgnores([
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/.expo/**',
    '**/coverage/**',
    'apps/mobile/ios/**',
    'apps/mobile/android/**',
    '**/expo-env.d.ts',
    '**/nativewind-env.d.ts',
    '**/src/generated/**',
  ]),

  js.configs.recommended,
  tseslint.configs.strict,

  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
    },
  },

  // Node: API, shared package, and root/config JS files
  {
    files: ['apps/api/**/*.ts', 'packages/**/*.ts', '**/*.{js,cjs,mjs}'],
    languageOptions: { globals: globals.node },
  },
  // CommonJS config files (babel, metro, tailwind for the mobile app)
  {
    files: ['**/*.{js,cjs}'],
    languageOptions: { sourceType: 'commonjs' },
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },

  // React apps
  {
    files: ['apps/mobile/**/*.{ts,tsx}', 'apps/admin/**/*.{ts,tsx}'],
    ...reactHooks.configs.flat['recommended-latest'],
  },
  {
    files: ['apps/admin/src/**/*.{ts,tsx}'],
    languageOptions: { globals: globals.browser },
  },

  // Must be last: turns off formatting rules that conflict with Prettier.
  prettier,
);
