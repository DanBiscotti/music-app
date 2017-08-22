const webpack = require('webpack')
const path = require('path')

const APP_DIR = path.resolve(__dirname, 'src/js')
const BUILD_DIR = path.resolve(__dirname, 'dist')

module.exports = {
    
    entry: APP_DIR+'/app.js',
    
    output: {
        path: BUILD_DIR,
        filename: 'bundle.js',
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                include: APP_DIR,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015','react']
                }
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader',
            }
        ]
    }
}

