/* eslint-disable no-undef */
/**
 * @type {import("eslint").Linter.Config}
 */
module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  rules: {
    'prettier/prettier': 'error',
    'react/prop-types': 'off',
    'no-empty-pattern': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
