/* eslint-env node */
module.exports = {
  env: {
    jest: true,
    browser: true,
    node: true,
    cypress: true
  },
  extends: ['plugin:@typescript-eslint/recommended', 'eslint:recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'cypress'],
  root: true,
  rules: {
    "semi": "warn",
    "eqeqeq": "warn",
    "no-unused-vars": "warn",
    "prefer-const": "warn"
  }
}
