const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


const config = {
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

const cssLoaderConfig = {
  loader: "css-loader",
  options: {
    sourceMap: true,
    modules: true,
    localIdentName: '[local]_[hash:base64:6]',
  }
};

module.exports = (env, argv) => {
  const mode = argv.mode || 'development';
  config.mode = mode;

  if (mode === 'development') {
    /////////////////
    // Development //
    /////////////////
    config.devtool = 'source-map';

    config.module.rules.push({
      test: /\.css$/,
      use: [
        { loader: "style-loader" },
        //MiniCssExtractPlugin.loader,
        cssLoaderConfig
      ]
    });

    config.plugins.push(new webpack.HotModuleReplacementPlugin());
  } else if(mode === 'production') {
    ////////////////
    // PRODUCTION //
    ////////////////
    config.devtool = 'hidden-source-map';

    config.module.rules.push({
      test: /\.css$/,
      use: [
        //{ loader: "style-loader" },
        MiniCssExtractPlugin.loader,
        cssLoaderConfig,
        'postcss-loader'
      ]
    });

    config.plugins.push(new MiniCssExtractPlugin({
      filename: '../css/style.css',
    }));

    config.optimization.minimizer = [new UglifyJsPlugin({
      uglifyOptions: {
        output: {
          comments: false,
        },
      },
      extractComments: true
    })]
  } else {
	   throw new Error('Invalid mode: '+argv.mode);
  }

  console.log(config);

  return config;
};
