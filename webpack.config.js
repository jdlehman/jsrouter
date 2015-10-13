var webpack = require('webpack');

module.exports = {
  entry: './src/router',
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel', exclude: /node_modules/ }
    ]
  },
  output: {
    filename: 'dist/jsrouter.min.js',
    libraryTarget: 'umd',
    library: 'jsrouter'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin()
  ]
};
