const path = require("path");
const webpack = require("webpack");
const BundleTracker = require("webpack-bundle-tracker");

module.exports = (env, argv) => {
  const isDev = argv.mode === "development";

  return {
    entry: "./src/index.js",
    mode: isDev ? "development" : "production",
    output: {
      path: path.resolve(__dirname, "static/frontend"),
      filename: isDev ? "[name].js" : "[name].[contenthash].js",
      publicPath: isDev ? "http://localhost:3000/" : "/static/frontend/",
      clean: true,
    },
    devServer: isDev
      ? {
          port: 3000,
          hot: true,
          headers: { "Access-Control-Allow-Origin": "*" }, // Django will fetch cross-origin from :3000
          // webpack-dev-server >=6 blocks no-cors cross-site asset requests unless the
          // host is explicitly allowed, so serving the page from 127.0.0.1:8000 while
          // assets come from localhost:3000 would 403.
          allowedHosts: ["localhost", "127.0.0.1"],
        }
      : undefined,
    plugins: [
      new BundleTracker({
        path: __dirname,
        filename: isDev ? "webpack-stats-dev.json" : "webpack-stats.json",
      }),
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
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
      ],
    },
    optimization: {
      minimize: !isDev,
    },
  };
};