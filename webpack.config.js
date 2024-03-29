const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: {
    index: './src/index.ts',
    background: './src/background.ts'
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname + '/dist'),
    // Reference: https://stackoverflow.com/questions/64294706/webpack5-automatic-publicpath-is-not-supported-in-this-browser?rq=1
    publicPath: ''
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
    }),
    new CleanWebpackPlugin()
  ]
};
