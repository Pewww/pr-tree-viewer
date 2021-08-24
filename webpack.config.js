const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    index: './src/index.ts',
    background: './src/background.ts'
  },
  output: {
    filename: '[name].js',
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
        test: /\.(woff2)$/,
        loader: 'file-loader',
        options: {
          name: '/fonts/[name].[ext]'
        }
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: './logo.png',
          to: './'
        },
        {
          from: './manifest.json',
          to: './'
        }
      ]
    })
  ]
};
