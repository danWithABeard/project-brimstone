const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: './js/index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'dwab.js',
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: [
          { loader: 'babel-loader' },
        ],
      }
    ]
  },
  optimization: {
    minimizer: [new UglifyJsPlugin()],
  }
}
