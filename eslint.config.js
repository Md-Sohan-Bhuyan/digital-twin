import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      // Many components intentionally use Framer Motion member expressions like <motion.div />
      // and demo code may include placeholder handlers; keep lint strict for real bugs while
      // reducing false positives.
      'no-unused-vars': [
        'warn',
        {
          varsIgnorePattern: '^(motion|[A-Z_])',
          argsIgnorePattern: '^(_|err|e)$',
          caughtErrorsIgnorePattern: '^(_|err|e)$',
        },
      ],
      'react-refresh/only-export-components': 'off',
      'react-hooks/purity': 'off',
    },
  },
])
