const path = require('path');
module.exports = {
    mode: "production",
    entry: {
        popup: "./src/popup.ts",
        options: "./src/options.ts",
    },
    output: {
        path: path.join(__dirname, "./js"),
        filename: "[name].js",
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    plugins: []
};