const path = require("path");
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");

const isDev = process.env.NODE_ENV === "development";

function createServerConfig(isDev) {
	const plugins = [];
	if(!isDev){
		plugins.push(new webpack.optimize.UglifyJsPlugin());
	}

	return {
		target: "node",
		devtool: "source-map",
		plugins: plugins,
		externals: [nodeExternals()],
		entry: "./src/server/server.js",
		output: {
			path: path.join(__dirname, "server"),
			filename: "server.js"
		},
		module: {
			loaders: [
				{
					test: /\.js$/,
					loader: "babel-loader",
					exclude: /node_modules/
				}
			]
		}
	}
}

module.exports = createServerConfig(true);
module.exports.create = createServerConfig;
