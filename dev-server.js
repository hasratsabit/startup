var WebpackDevServer = require("webpack-dev-server");
var webpack = require("webpack");
var clientConfig = require("./webpack.config");

const compiler = webpack(clientConfig);
var server = new WebpackDevServer(compiler, {
	hot: true,
	filename: clientConfig.output.filename,
	publicPath: clientConfig.output.publicPath,
	stats: {
		colors: true,
		chunks: false,
		assets: false,
		timings: false,
		modules: false,
		hash: false,
		version: false
	}
});

server.listen(4200, "localhost", function(){});
