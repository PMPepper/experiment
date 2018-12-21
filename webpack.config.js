const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: './src/js/main.js',
  optimization: {

  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',

        options: {
          presets: [
            '@babel/preset-env',
            {
              plugins: [
                ['wildcard', {noModifyCase: true}],
                '@babel/plugin-transform-runtime',
                '@babel/plugin-proposal-class-properties'
              ]
            }
          ]
        }
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader', // creates style nodes from JS strings
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: true,
              localIdentName: '[local]_[hash:base64:6]',
            }
          }, // translates CSS into CommonJS
          'sass-loader' // compiles Sass to CSS, using Node Sass by default
        ]
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    alias: {
      'react': 'preact-compat',
      'react-dom': 'preact-compat',
      '@': path.resolve('src/js'),
    }
  },
  output: {
    path: path.resolve(__dirname, 'build/js'),
    publicPath: "/js/",
    filename: 'scripts.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    stats: "errors-only",
    contentBase: './dist',
    overlay: true,
    hot: true,
  }
};
