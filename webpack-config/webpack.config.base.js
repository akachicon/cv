const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebappWebpackPlugin = require('webapp-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const project = require('../project.config.js');

const inProject = path.resolve.bind(path, project.basePath); // TODO: make utils
const inProjectSrc = (...files) => inProject(project.srcDir, ...files);

const __DEV__ = project.env === 'development';

module.exports = {
  context: inProjectSrc(''),
  entry: {
    main: [
      inProjectSrc(project.bootstrap),
      inProjectSrc(project.main)
    ]
  },
  output: {
    path: inProject(project.outDir),
    publicPath: project.publicPath
  },
  resolve: {
    extensions: ['*', '.js', '.json', '.css', '.scss'] // TODO: add fonts
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              // cacheDirectory: __DEV__,
            }
          }
        ]
      },
      {
        test: /\.pug$/,
        use: ['pug-loader']
      },
      {
        test: /\.(woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 8192
        }
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name][hash:8].[ext]',
          outputPath: 'img'
        }
      }
    ]
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      minSize: 0,
      maxSize: Infinity,
      name: true,
      chunks: 'all',
      cacheGroups: {
        default: false,
        vendors: false,
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          minChunks: 1,
          enforce: true,
          priority: 5
        },
        shim: {
          test: /[\\/](core-js|regenerator-runtime|@babel)[\\/]/,
          minChunks: 1,
          enforce: true,
          priority: 10
        },
        style: {
          name: 'style',
          test: /\.(css|scss)$/,
          minChunks: 1,
          enforce: true,
          priority: 15
        }
      }
    },
  },
  plugins: [
    new CleanWebpackPlugin(['dist'], { root: project.basePath }),
    new HtmlWebpackPlugin({
      inlineSource: 'runtime',
      filename: 'index.html',
      template: inProjectSrc(project.html.template),
      templateParameters: project.html.templateParameters,
    }),
    new WebappWebpackPlugin({
      logo: inProjectSrc('app-logo.png'),
      prefix: 'favicons/',
      cache: true,
      favicons: {
        appName: project.html.title,
        developerName: null,
        developerURL: null, // prevent retrieving from the nearest package.json
        icons: {
          android: false,
          appleIcon: false,
          appleStartup: false,
          coast: false,
          favicons: true,
          firefox: false,
          windows: false,
          yandex: false
        }
      }
    }),
    new HtmlWebpackInlineSourcePlugin(),
    new MiniCssExtractPlugin({
      filename: __DEV__ ? '[name].css' : '[name].[contenthash].css',
      chunkFilename: __DEV__ ? '[id].css' : '[id].[contenthash].css',
    }),
    new webpack.DefinePlugin(project.globals)
  ]
};
