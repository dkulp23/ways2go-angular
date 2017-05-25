'use strict';

const path = require('path');
const dotenv = require('dotenv');
const webpack = require('webpack');
const HTMLPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const production = process.env.NODE_ENV === 'production';

dotenv.load();

module.exports = () => {

  return {
    devtool: 'eval',
    entry: `${__dirname}/app/entry.js`,
    output: {
      filename: '[name].[chunkhash].js',
      path: path.resolve(__dirname, 'build')
    },
    plugins: [
      new HTMLPlugin({ template: path.resolve(__dirname, './app/index.html') }),
      new ExtractTextPlugin('bundle.css'),
      new webpack.DefinePlugin({
        __API_URL__: JSON.stringify(process.env.API_URL),
        __DEBUG__: JSON.stringify(!production)
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: function(module) {
          return module.context && module.context.indexOf('node_modules') !== -1;
        }
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'manifest'
      })
    ],
    module: {
      rules: [
        { //:::: babel ::::
          test: /\.js$/,
          exclude: /node_modules/,
          use: 'babel-loader',
        },
        {//:::: html ::::
          test: /\.html$/,
          use: 'html-loader',
        },
        {//:::: css ::::
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: 'css-loader'
          })
        },
        { //:::: sass ::::
          test: /\.scss$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader', 'sass-loader'],
          }),
        },
        { //:::: fonts ::::
          test: /\.(ttf|eot|woff|woff2)(\?.+)?$/,
          // test: /\.(ttf|eot|svg|woff|woff2)(\?.+)?$/,
          use: 'file-loader',
        },
        { //:::: png ::::
          test: /\.(png|svg|jpg)$/,
          use: 'file-loader',
          // use: 'file-loader?name=[name].[ext]',

        },
      ],
    },
  };
};
