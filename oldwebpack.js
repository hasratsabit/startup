const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");

const isDev = process.env.NODE_ENV === "development";

function createClientConfig(isDev) {
	const cssIdentifier = isDev ? '[path][name]---[local]' : '[hash:base64:10]';
	const cssLoader = { test: /\.css$/, loader: ["style-loader", "css-loader?localIdentName=" + cssIdentifier], exclude: /node_modules/};
	const sassLoader = 	{ test: /\.scss$/, loader: ["style-loader", "css-loader", "sass-loader"], exclude: /node_modules/ };

	const appEntry = isDev
	?	[

			'./src/client/main.js',
			'webpack/hot/dev-server',
			'webpack-dev-server/client?http://localhost:8080'
		]
	:	[
			'./src/client/main.js'
		]
	const plugins = [];

	if(!isDev) {
		plugins.push(new webpack.optimize.UglifyJsPlugin());
		plugins.push(new ExtractTextPlugin("styles-[contenthash:10].css"));
		plugins.push(new HTMLWebpackPlugin({template: "index-template.html"}));
		cssLoader.loader = ExtractTextPlugin.extract({ fallback: "style-loader", use: "css-loader?minimize&localIdentName=" + cssIdentifier})
		sassLoader.loader = ExtractTextPlugin.extract({ fallback: "style-loader", use: ["css-loader", "sass-loader"]})
	}else {
		plugins.push(new webpack.HotModuleReplacementPlugin());
		// appEntry.splice(0, 0, "webpack-hot-middleware/client");
	}
	return {
		devtool: "source-map",
		plugins: plugins,
		entry: {
			main: appEntry
		},
		output: {
			path: path.join(__dirname, "public"),
			publicPath: isDev ? "/public/" : "/",
			filename: isDev ? "bundle.js" : "bundle.[hash:12].min.js"
		},
		module: {
			loaders: [
				{
					test: /\.js$/,
					loader: "babel-loader",
					exclude: /node_modules/
				},
				{
					test: /\.css$/,
					loader: cssLoader,
					exclude: /node_modules/
				},
				{ test: /\.scss$/,
					loader: ["style-loader", "css-loader", "sass-loader"],
					exclude: /node_modules/
				}
			]
		}
	}
}
module.exports = createClientConfig(true);
module.exports.client = createClientConfig;
