const { defineConfig } = require('@vue/cli-service');
const webpack = require('webpack');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = defineConfig({
	devServer: {
		port: 3000,
	},
	transpileDependencies: true,
	publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
	configureWebpack: {
		plugins: [
			new webpack.ProvidePlugin({
				Buffer: ['buffer', 'Buffer'],
			}),
			new NodePolyfillPlugin(),
		],
		resolve: {
			extensions: ['.ts', '.js'],
			fallback: {
				buffer: require.resolve('buffer'),
				path: require.resolve('path-browserify'),
				util: require.resolve('util'),
				crypto: require.resolve('crypto-browserify'),
				stream: require.resolve('stream-browserify'),
			},
		},
	},
});
