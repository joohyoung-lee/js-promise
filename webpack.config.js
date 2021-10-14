const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = {
    mode: 'none',
    entry: './index.js',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'public')
    },
    devServer: {
        port: 9000,
        historyApiFallback: true,
    },
    module: {
        rules: []
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: 'index.html'
        })
    ]
};