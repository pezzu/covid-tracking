module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: [
    './pages/**/*.html',
    './pages/**/*.js',
    './pages/**/*.jsx',
    './pages/**/*.ts',
    './pages/**/*.tsx',
    './components/**/*.js',
    './components/**/*.jsx',
    './components/**/*.ts',
    './components/**/*.tsx',
  ],
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [],
}
