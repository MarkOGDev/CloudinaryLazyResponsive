"use strict";

module.exports = {
    entry: "./src/script.ts",
    output: {
        filename: "./dist/bundle.js",
        libraryTarget: 'var'
    },
    devServer: {
        contentBase: ".",
        host: "localhost",
        port: 9000
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
        }

        ]
    }

};