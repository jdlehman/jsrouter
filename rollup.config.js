import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  input: 'src/router.js',
  plugins: [
    nodeResolve(),
    babel({
      babelrc: false,
      presets: ['es2015-rollup', 'stage-0'],
      exclude: 'node_modules/**',
    }),
    replace({
      'process.env.NODE_DEBUG': false,
      'process.env.NODE_ENV': '"production"'
    })
  ],
  moduleId: 'jsrouter',
  output: [
    {name: 'jsrouter', format: 'umd', file: 'dist/jsrouter.umd.js', globals: 'React'},
    {name: 'jsrouter', format: 'iife', file: 'dist/jsrouter.browser.js', globals: 'React'},
    {name: 'jsrouter', format: 'amd', file: 'dist/jsrouter.amd.js', globals: 'React'},
    {name: 'jsrouter', format: 'cjs', file: 'dist/jsrouter.cjs.js', globals: 'React'},
    {name: 'jsrouter', format: 'es', file: 'dist/jsrouter.es-modules.js', globals: 'React'}
  ]
};
