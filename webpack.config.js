var webpack = require("webpack");
var path = require("path");

var BUILD_DIR = path.resolve(__dirname, "bin");
var SRC_DIR = path.resolve(__dirname, "src");

var config = {
	entry: {main:SRC_DIR + "/main.jsx"},
	output: {
		path: BUILD_DIR,
		filename: "./js/[name].bundle.js"
	},
	module: {
		loaders: [{
			test: /\.jsx?/,
			include: SRC_DIR,
			loader: "babel-loader",
			query: {
				presets:["react"]
			}
		}, {
			test: /\.less$/,
			include: SRC_DIR,
			loader: "style-loader!css-loader!less-loader"
		},{ test   : /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
			include: SRC_DIR,
			loader : "file-loader" 
		}]
	},
	resolve: {
		extensions: [".js", ".jsx", ".css"]
	}
};



module.exports = config;