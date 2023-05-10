module.exports = {
  all: true,
  extension: ['.js', '.vue'],
  exclude: ['**/*.{spec,test}.{js,ts}'],
  include: [
    'client/pages/**/*.{vue,ts}',
    'client/layouts/**/*.{vue,ts}',
    'client/components/**/*.{vue,ts}',
    'client/module/**/*.js',
    'client/utils/**/*.js',
    'client/api/**/*.js',
  ],
}
