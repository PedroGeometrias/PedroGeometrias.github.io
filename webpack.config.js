const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');

module.exports = {
  entry: './index.html', // Use the HTML file as the entry point
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: { minimize: true }
          }
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
        use: ['file-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html'
    }),
    new Dotenv(),
    new webpack.DefinePlugin({
      'process.env.GOOGLE_ANALYTICS_ID': JSON.stringify(process.env.GOOGLE_ANALYTICS_ID)
    })
  ],
  devServer: {
    static: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000
  },
  mode: 'development'
};

