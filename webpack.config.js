var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HTMLWebpackPlugin = require('html-webpack-plugin');

const DEVELOPMENT = process.env.NODE_ENV === 'development';
const PRODUCTION = process.env.NODE_ENV === 'production';

// In production only servers the main.js, otherwise the dev-server and main.js
const appEntry = PRODUCTION
	?	[
			'./src/client/main.js'
		]
	:	[
			'./src/client/main.js',
			'webpack/hot/dev-server',
			'webpack-dev-server/client?http://localhost:4200'
		];

// Uglifies and seperates css during production
const plugins = PRODUCTION
	? 	[
			new webpack.optimize.UglifyJsPlugin(),
			new ExtractTextPlugin('styles-[contenthash:10].css'),
			new HTMLWebpackPlugin({
				template: 'index-template.html'
			})
		]
	: 	[
			new webpack.HotModuleReplacementPlugin()
		];

plugins.push(
	new webpack.DefinePlugin({
		DEVELOPMENT: JSON.stringify(DEVELOPMENT),
		PRODUCTION: JSON.stringify(PRODUCTION)
	})
);

// Style Loaders assigned to variables and passed to loader at the bottom
const cssIdentifier = PRODUCTION ? '[hash:base64:10]' : '[path][name]---[local]';
const cssLoader = { test: /\.css$/, loader: ["style-loader", "css-loader?localIdentName=" + cssIdentifier], exclude: /node_modules/};
const sassLoader = 	{ test: /\.scss$/, loader: ["style-loader", "css-loader", "sass-loader"], exclude: /node_modules/ };

if(PRODUCTION){
	cssLoader.loader = ExtractTextPlugin.extract({ fallback: "style-loader", use: "css-loader?minimize&localIdentName=" + cssIdentifier})
	sassLoader.loader = ExtractTextPlugin.extract({ fallback: "style-loader", use: ["css-loader", "sass-loader"]})
}


module.exports = {
	devtool: 'source-map',
	entry: appEntry,
	plugins: plugins,
	externals: {
		jquery: 'jQuery' //jquery is external and available at the global variable jQuery
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				loaders: ['babel-loader'],
				exclude: /node_modules/
			},
			cssLoader,
			sassLoader
		]
	},
	output: {
		path: path.join(__dirname, 'dist'),
		publicPath: PRODUCTION ? '/' : '/dist/',
		filename: PRODUCTION ? 'bundle.[hash:12].min.js' : 'bundle.js'
	}
};
