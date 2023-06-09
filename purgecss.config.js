module.exports = {
  content: ['.output/public/**/*.html', '.output/public/**/*.js'],
  css: ['.output/public/**/*.css'],
  safelist: [/-(leave|enter|appear)(|-(to|from|active))$/, /^situation-level-/],
  output: ['.output/public/_nuxt']
}