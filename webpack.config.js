const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: 'production',
  entry: {
    main: './src/index.js'
  },
  output: {
    filename: 'index.js',
    path: path.join(__dirname + '/dist')
  },
  resolve: {
    extensions: [
      '.js',
      '.svg'
    ],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: require.resolve('babel-loader')
      },
      {
        test: /\.svg$/,
        loader: require.resolve('svg-url-loader'),
        options: {
          encoding: 'base64'
        }
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        loader: require.resolve('url-loader'),
        options: {
          name: '[hash].[ext]',
          limit: 10000,
          esModule: false
        }
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: './manifest.json',
          to: './'
        }
      ]
    })
  ]
};
