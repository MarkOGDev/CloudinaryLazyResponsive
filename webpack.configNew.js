"use strict";

const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');


var config  = {
    watch: true,
    entry: {
        bundle: [path.resolve('./index.ts')]
        , demo: [path.resolve('./src/demo.ts')]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name]/[name].js',
        libraryTarget: 'umd',
        library: 'clri'
    },
    //in mode: production optimizations happen. here we add extra config for that optimization.
    optimization: {
        minimizer: [
            new UglifyJSPlugin({
                uglifyOptions: {
                    compress: {
                        drop_console: true
                    }
                }
            })
        ]
    },
    module: {
        rules: [{
            test: /\.ts$/,
            exclude: /node_modules/,
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env'],
                    cacheDirectory: true
                }
            },
            {
                loader: 'ts-loader'
            }]
        },
        {
            test: /\.js$/,
            exclude: /node_modules/,
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env'],
                    cacheDirectory: true
                }
            }]
        }]
    }, resolve: { extensions: ['.ts', '.tsx', '.js'] }

};

module.exports = (env, argv) => {

    //Get the 'mode' arg value and customize the file name
    //https://webpack.js.org/concepts/mode/
    if (argv.mode === 'development') {
        config.output.filename = '[name]/[name].js';
    }

    if (argv.mode === 'production') {
        config.output.filename = '[name]/[name].min.js';
    }

    return config;
};