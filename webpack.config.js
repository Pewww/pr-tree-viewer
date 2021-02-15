const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    main: './src/index.ts'
  },
  output: {
    filename: 'index.js',
    path: path.join(__dirname + '/dist')
  },
  resolve: {
    extensions: [
      '.ts',
      '.js',
      '.svg'
    ],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: require.resolve('ts-loader')
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
