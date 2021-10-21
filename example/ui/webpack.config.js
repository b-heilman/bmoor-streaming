
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
	target: 'web',
	entry: path.resolve(__dirname, './index.js'),
	mode: 'development',
	module: {
		rules: [{
			test: /\.m?js$/,
			exclude: /(node_modules|bower_components)/,
			use: {
				loader: 'babel-loader',
				options: {
					presets: ['@babel/preset-env']
				}
			}
		}],
	},
	output: {
		path: path.resolve(__dirname, './dist'),
		filename: 'index_bundle.js',
	},
	plugins: [new HtmlWebpackPlugin()],
	devServer: {
		open: true,
		contentBase: path.resolve(__dirname, './dist'),
		compress: true,
		port: 9001
	},
};
