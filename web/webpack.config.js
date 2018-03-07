"use strict";

//const webpack = require('webpack');
const path = require('path');


//We could pass env info via npm script command.
//const IS_DEV = process.env.NODE_ENV === 'development';   
//const IS_PROD = process.env.NODE_ENV === 'production';

module.exports = {

    watch: true,
  //  entry: {
      //  bundle: [path.resolve('./src/main.ts')]
     //   , demo: [path.resolve('./src/demo.ts')]
     //   , cloudinaryLazyResponsiveImages: [path.resolve('./src/cloudinary-lazy-responsive-images.ts')]
     //   , cloudinaryLazyResponsiveImagesScrollingContainers: [path.resolve('./src/cloudinary-lazy-responsive-images-scrolling-containers.ts')]
       // , cloudinaryLazyResponsiveImagesFixedBgScrollReveal: [path.resolve('./src/cloudinary-lazy-responsive-images-fixedbg-scroll-reveal.ts')]       
   // },
    output: {
      //  filename: './dist/[name]/[name].' + (IS_PROD ? 'min.' : '') + 'js',


        libraryTarget: 'umd',
        library: 'clri'
    },
  //  devServer: {
   //     contentBase: ".",
   //     host: "localhost",
   //     port: 9000
   // },
    module: {
        rules: [{
            test: /\.ts$/,      
            exclude: /node_modules/,
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


