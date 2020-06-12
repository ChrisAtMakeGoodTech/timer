const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
	mode: 'development',
	target: 'web',
	context: path.resolve(__dirname, 'js'),
	entry: {
		code: './code.js',
		sw: './sw.js',
		periodWorker: './workers/period.js',
	},
	plugins: [
		new CleanWebpackPlugin(),
		new CopyPlugin({
			patterns: [
				{
					from: '**/*',
					context: path.resolve(__dirname, 'static'),
				}
			],
			options: {
				concurrency: 100,
			},
		}),
	],
	output: {
		filename: (chunkData) => {
			return chunkData.chunk.name === 'periodWorker'
				? 'workers/period.js'
				: chunkData.chunk.name + '.js';
		},
		path: path.resolve(__dirname, 'dist'),
	},
};