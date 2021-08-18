module.exports = {
  mode: 'development',
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
  }
}
