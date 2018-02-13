"use strict";

//const webpack = require('webpack');
//Upgarade uglyfy when using webpack v4/ v3 has built in version
//const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const path = require('path');
const IS_DEV = process.env.NODE_ENV === 'development';  //visual studio uses vaiable called 'NODE_ENV'
const IS_PROD = process.env.NODE_ENV === 'production';

module.exports = {
    entry: {
        bundle: [path.resolve('./src/main.ts')]
        , demo: [path.resolve('./src/demo.ts')]
        , cloudinaryLazyResponsiveImages: [path.resolve('./src/cloudinary-lazy-responsive-images.ts')]
        , cloudinaryLazyResponsiveImagesScrollingContainers: [path.resolve('./src/cloudinary-lazy-responsive-images-scrolling-containers.ts')]
       // , cloudinaryLazyResponsiveImagesFixedBgScrollReveal: [path.resolve('./src/cloudinary-lazy-responsive-images-fixedbg-scroll-reveal.ts')]
        

        // "./src/main.ts"
    }
    , output: {
        filename: './dist/[name]/[name].' + (IS_PROD ? 'min.' : '') + 'js',
        // filename: "./dist/bundle.js",
        // libraryTarget: 'var',
        libraryTarget: 'umd',
        library: ['clri', '[name]']
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
        }]
    }, resolve: { extensions: ['.ts', '.tsx', '.js'] }

};


