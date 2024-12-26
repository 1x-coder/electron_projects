 var path = require('path');
 var webpack = require('webpack');
 var babreg = require("babel-core/register");
 var polyfill = require("babel-polyfill");

 module.exports = {
    entry: {
         app: ['babel-polyfill', './js/app.js'],

    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].bundle.js'
    },
     module: {
         loaders: [
             {
                 test: /\.js$/,
                 loader: 'babel-loader',
                 query: {
                     plugins: [ 'transform-decorators-legacy', 'syntax-async-functions', 'transform-async-to-generator', 'transform-es2015-function-name'],
                     presets: ['es2015'],
                 }
             }
         ]
     },
     stats: {
         colors: true
     },
     devtool: 'source-map'
 };