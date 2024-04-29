const antfu = require('@antfu/eslint-config').default;

module.exports = antfu(
  {
    typescript: true,
    vue: true,
  },
  {
    parserOptions: {
      sourceType: 'module',
    },
  },
);
