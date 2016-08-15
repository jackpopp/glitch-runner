import buble from 'rollup-plugin-buble';

export default {
  entry: './main.js',
  dest: './bundle.js',
  format: 'umd',
  plugins: [ buble() ]
}