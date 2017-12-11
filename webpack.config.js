const path = require('path');
const WebpackNotifierPlugin = require('webpack-notifier');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    devtool: 'eval',
    entry: {
        polyfills: 'polyfills.ts',
        list: 'list.ts',
        multiplayer: 'multiplayer.ts',
        single: 'single.ts',
    },
    node: {
        fs: 'empty'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, './../dist/public')
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        modules: ['src', 'node_modules'],
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: [
                    {
                        loader: 'babel-loader'
                    },
                    {
                        loader: 'ts-loader'
                    }
                ],
                include: path.resolve('src')
            },
            {
                test: /\.(sass|scss)$/,
                exclude: /node_modules/,
                use: ExtractTextPlugin.extract({use: ['css-loader', 'sass-loader']})
            }
        ]
    },
    plugins: [
        new WebpackNotifierPlugin(),
        new ExtractTextPlugin({
            filename: 'styles.bundle.css',
            allChunks: true,
        })
    ]
};
