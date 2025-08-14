module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'n8n-nodes-base'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  env: {
    es6: true,
    node: true,
  },
  overrides: [
    {
      files: ['nodes/**/*.ts'],
      extends: ['plugin:n8n-nodes-base/nodes'],
      rules: {},
    },
    {
      files: ['credentials/**/*.ts'],
      extends: ['plugin:n8n-nodes-base/credentials'],
      rules: {},
    },
  ],
  ignorePatterns: ['dist/**'],
};
