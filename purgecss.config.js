module.exports = {
  content: ['.output/public/**/*.html', '.output/public/**/*.js'],
  css: ['.output/public/**/*.css'],
  safelist: [/-(leave|enter|appear)(|-(to|from|active))$/, /^situation-level-/, /^fr-p/, /^fr-col/, /^fr-btn/],
  output: ['.output/public/_nuxt']
}