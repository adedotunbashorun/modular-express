const webpack = require('webpack');
const path = require('path');

/*
 * SplitChunksPlugin is enabled by default and replaced
 * deprecated CommonsChunkPlugin. It automatically identifies modules which
 * should be splitted of chunk by heuristics using module duplication count and
 * module category (i. e. node_modules). And splits the chunks…
 *
 * It is safe to remove "splitChunks" from the generated configuration
 * and was added as an educational example.
 *
 * https://webpack.js.org/plugins/split-chunks-plugin/
 *
 */

/*
 * We've enabled UglifyJSPlugin for you! This minifies your app
 * in order to load faster and run less javascript.
 *
 * https://github.com/webpack-contrib/uglifyjs-webpack-plugin
 *
 */


const {
	NODE_ENV = 'development',
} = process.env;

module.exports = {
	entry: './src/index.js',
	mode: NODE_ENV,
	target: 'node',
	watch: NODE_ENV === 'development',
	// externals: [nodeExternals()],
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'index.js'
	},
    resolve: {		
		extensions: ['.json', '.js'],
        alias: {
            config: path.resolve(__dirname, 'config'),
			functions: path.resolve(__dirname, 'functions/'),			
			Modules: path.resolve(__dirname,'Modules/'),            
        }
	},
};
