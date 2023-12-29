const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

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
        new CopyPlugin({
            patterns: [
                {from: "./pages/", to: path.join(__dirname, "./dist/pages/")},
                {from: "./assets/", to: path.join(__dirname, "./dist/assets/")},
                {from: "./js/", to: path.join(__dirname, "./dist/js/")},
                {from: "./manifest.json", to: path.join(__dirname, "./dist/manifest.json")},
            ]
        }),
    ]
};