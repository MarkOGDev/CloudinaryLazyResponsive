"use strict";

//const webpack = require('webpack');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

//We could pass env info via npm script command.
//const IS_DEV = process.env.NODE_ENV === 'development';   
//const IS_PROD = process.env.NODE_ENV === 'production';

module.exports = {
    mode: 'production',
    watch: true,

    entry: {
        bundle: [path.resolve('./index.ts')]
        , demo: [path.resolve('./src/demo.ts')]    
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name]/[name].min.js',
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
           // exclude: /node_modules/,
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: 'env',
                    cacheDirectory: true
                }
            },
            {
                loader: 'ts-loader'
            }]
        },
        {
            test: /\.js$/,
            // exclude: [/node_modules/,/bower_components/], Get errors if exclude node. not sure why????
    
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: 'env',
                    cacheDirectory: true
                }
            }]
        }]
    }, resolve: { extensions: ['.ts', '.tsx', '.js'] }

};

 