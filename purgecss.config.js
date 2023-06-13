module.exports = {
  content: ['.output/public/**/*.html', '.output/public/**/*.js'],
  css: ['.output/public/**/*.css'],
  safelist: [/-(leave|enter|appear)(|-(to|from|active))$/, /^situation-level-/, /^fr-badge--/],
  output: ['.output/public/_nuxt']
}