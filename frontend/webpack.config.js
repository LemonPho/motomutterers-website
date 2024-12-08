const path = require("path");
const webpack = require("webpack");
const BundleTracker = require("webpack-bundle-tracker")

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "static/frontend"),
    filename: "[name].[contenthash].js",
    clean: true,
  },
  plugins: [
    new BundleTracker({ filename: path.join("./webpack-stats.json") }), 
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              ["@babel/preset-env", { targets: { node: "current" } }],
              "@babel/preset-react",
            ],
            plugins: ["@babel/plugin-proposal-class-properties"],
          },
        },
      },
    ],
  },
  optimization: {
    minimize: true,
  },
};