const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


module.exports = {
  mode: 'production',
  devtool: 'hidden-source-map',
  entry: './src/js/main.js',
  optimization: {
    minimizer: [new UglifyJsPlugin({
      uglifyOptions: {
        output: {
          comments: false,
        },
      },
      extractComments: true
    })]
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
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-syntax-dynamic-import',
                'transform-remove-console',
              ]
            }
          ]
        }
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
              modules: true,
              localIdentName: '[local]_[hash:base64:6]',
            }
          },
          'postcss-loader',
          'sass-loader', // compiles Sass to CSS, using Node Sass by default
        ]
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true, // webpack@1.x
              disable: true, // webpack@2.x and newer
            },
          },
        ],
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    alias: {
      '@': path.resolve('src/js'),
    }
  },
  output: {
    path: path.resolve(__dirname, 'build/js'),
    publicPath: "js/",
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '../css/style.css',
    })
  ],
  devServer: {
    stats: "errors-only",
    contentBase: './dist',
    overlay: true,
    hot: true,
  }
};
//plugins: [['wildcard', {noModifyCase: true}], 'transform-runtime', 'transform-object-rest-spread', 'transform-class-properties']

/*
plugins: [
              ['wildcard', {noModifyCase: true}],
              'transform-runtime',
              'transform-object-rest-spread',
              'transform-class-properties',
              'transform-remove-console',
            ]
*/
