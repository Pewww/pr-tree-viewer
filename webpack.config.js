const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

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
      '.css',
      '.svg'
    ],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader'
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.svg$/,
        loader: 'svg-url-loader',
        options: {
          encoding: 'base64'
        }
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        loader: 'url-loader',
        options: {
          name: '[hash].[ext]',
          limit: 10000,
          esModule: false
        }
      },
      {
        test: /\.(woff2)$/,
        loader: 'file-loader'
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
