import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';

export default {
  entry: 'src/router.js',
  plugins: [
    babel({
      babelrc: false,
      presets: ['es2015-rollup', 'stage-0'],
      plugins: ['babel-plugin-bucklescript'],
      exclude: 'node_modules/**',
    }),
    replace({
      'process.env.NODE_DEBUG': false,
      'process.env.NODE_ENV': '"production"'
    })
  ],
  globals: {
    react: 'React'
  },
  moduleName: 'jsrouter',
  moduleId: 'jsrouter',
  targets: [
    {format: 'umd', dest: 'dist/jsrouter.umd.js'},
    {format: 'iife', dest: 'dist/jsrouter.browser.js'},
    {format: 'amd', dest: 'dist/jsrouter.amd.js'},
    {format: 'cjs', dest: 'dist/jsrouter.cjs.js'},
    {format: 'es', dest: 'dist/jsrouter.es-modules.js'}
  ]
};
