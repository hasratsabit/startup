import gulp from "gulp";
import webpack from "webpack";
import chalk from "chalk";
import del from "del";
import util from "util";
import nodemon from "gulp-nodemon";
import {create as createServerConfig} from "../../webpack.server";

const $ = require("gulp-load-plugins")();

/*---------------
	DELETE TASKS
----------------*/
gulp.task("clean", () => {
	return del("./server");
});

gulp.task("buildServer", ["clean"], buildDevServer)
gulp.task("watchServer", ["buildServer"], watchDevServer)
gulp.task("start", ["watchServer"], reloadDevServer);



/*---------------
	Server Webpack
----------------*/
const devServerWebpack = webpack(createServerConfig(true));
const prodServerWebpack = webpack(createServerConfig(false));

// Building development server
function buildDevServer(callback) {
	devServerWebpack.run((error, stats) => {
		outputWebpack("Building:Server", error, stats);
		callback();
	});
}

// Watching development server
function watchDevServer() {
	devServerWebpack.watch({}, (error, stats) => {
		outputWebpack("Watching:Server", error, stats)
	});
}

// nodemon setup
function reloadDevServer() {
	return $.nodemon({
		script: "./server/server.js",
		watch: "./server",
		env: {
			"NODE_ENV": "development",
			"USE_WEBPACK": "true"
		}
	})
}


// Building production server
function buildProdServer(callback) {
	prodServerWebpack.run((error, stats) => {
		outputWebpack("Buidling:ProdServer", error, stats)
		callback();
	});
}

/*---------------
	ERROR HANDLING
----------------*/
function outputWebpack(label, error, stats) {
	if (error)
		throw new Error(error);

	if (stats.hasErrors()) {
		util.log(stats.toString({ colors: true }));
	} else {
		const time = stats.endTime - stats.startTime;
		util.log(chalk.bgGreen(`${label} in ${time} ms`))
	}
}
