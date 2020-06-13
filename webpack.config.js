const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const sharedSettings = {
	mode: 'development',
	context: path.resolve(__dirname, 'js'),
	output: {
		filename: (chunkData) => {
			return chunkData.chunk.name === 'periodWorker'
				? 'workers/period.js'
				: chunkData.chunk.name + '.js';
		},
		path: path.resolve(__dirname, 'dist'),
	},
};

const main = {
	target: 'web',
	entry: {
		code: './code.js',
	},
	plugins: [
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
};

const workers = {
	target: 'webworker',
	entry: {
		sw: './sw.js',
		periodWorker: './workers/period.js',
	},
	plugins: [
		new CleanWebpackPlugin(),
	],
};

Object.assign(main, sharedSettings);
Object.assign(workers, sharedSettings);

module.exports = [main, workers];