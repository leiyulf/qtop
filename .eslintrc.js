module.exports = {
  // extends: [require.resolve('@umijs/fabric/dist/eslint')],
  globals: {
    page: true,
    REACT_APP_ENV: true,
  },
  rules: {
    'no-console': 'off',
    'no-alert': 'off',
    'no-return-assign': 'off',
  },
};