/* globals require, module, __dirname */
const path = require('path');
// const webpack = require('webpack');
var HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

module.exports = {
    entry: './src/index.jsx',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'main.bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['stage-0']
                    }
                }
            },
            {
                test: /\.jsx$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['stage-0', 'react']
                    }
                }
            }
        ]
    },

    plugins: [
        new HardSourceWebpackPlugin()
    ],

    devtool: 'cheap-module-eval-source-map',

    devServer: {
      port: 8085
    }
};

