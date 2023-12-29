const path = require('path');
const FileManagerPlugin = require('filemanager-webpack-plugin');


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
    plugins: [
        new FileManagerPlugin({
            events: {
                onEnd: {
                    copy: [
                        {source: './pages/', destination: path.join(__dirname, "./dist/pages/")},
                        {source: './assets/', destination: path.join(__dirname, "./dist/assets/")},
                        {source: './js/', destination: path.join(__dirname, "./dist/js/")},
                        {source: './manifest.json', destination: path.join(__dirname, "./dist/manifest.json")},
                    ]
                }
            }
        }),
    ]
};