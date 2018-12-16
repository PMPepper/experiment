const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const config = {
  entry: './src/js/main.js',
  optimization: {

  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        use: [
          { loader: "style-loader" },
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
              modules: true,
              localIdentName: '[local]_[hash:base64:6]',
            }
          }
        ]
      },
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
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

module.exports = (env, argv) => {
  const mode = argv.mode || 'development';
  config.mode = mode;

  if (mode === 'development') {
    config.devtool = 'source-map';

    config.plugins.push(new webpack.HotModuleReplacementPlugin());
  } else if(mode === 'production') {
    config.devtool = 'hidden-source-map';
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
