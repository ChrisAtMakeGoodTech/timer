const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const copyExtensions = [
	'css', 'html', 'json', 'webp', 'config',
];

const copyPatterns = copyExtensions.map(ext => {
	return {
		from: '**/*.' + ext,
	};
});

module.exports = {
	entry: {
		code: './code.js',
		sw: './sw.js',
		periodWorker: './workers/period.js',
	},
	context: path.resolve(__dirname, 'src'),
	plugins: [
		new CleanWebpackPlugin(),
		new CopyPlugin({
			patterns: copyPatterns,
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
	target: 'web',
};