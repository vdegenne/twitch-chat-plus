import resolve from 'rollup-plugin-node-resolve'

export default {
  input: 'snackbar.mjs',
  output: { file: 'snackbar.js', format: 'iife' },
  plugins: [resolve()]
}
