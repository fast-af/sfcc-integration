const webpack = require("webpack");
const path = require("path");
const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const Visualizer = require("webpack-visualizer-plugin");

module.exports = (env) => ({
  entry: "./src/index.ts",
  watch: env && env.NODE_ENV === "development",
  output: {
    filename: "fast.js",
    path: path.resolve(__dirname, "dist"),
    libraryTarget: "global",
  },
  optimization: {
    minimize: !(env && env.NODE_ENV === "development"),
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: env && env.NODE_ENV === "development",
        terserOptions: {
          mangle: true, // Note `mangle.properties` is `false` by default.
          module: false,
          output: null,
          toplevel: false,
          nameCache: null,
          ie8: false,
          keep_classnames: undefined,
          keep_fnames: false,
          safari10: false,
          // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
        },
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.js|.jsx|.tsx|.ts$/,
        exclude: /node_modules\/(?!(fast-apollo-client)\/).*/,
        loader: "babel-loader",
      },
      {
        test: /\.js|.jsx|.tsx|.ts$/,
        use: "ts-loader",
        exclude: /node_modules\/(?!(fast-apollo-client)\/).*/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      Fast: path.resolve(__dirname, "src/Fast"), // <-- When you build or restart dev-server, you'll get an error if the path to your utils.js file is incorrect.
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      Fast: "Fast",
    }),
    new webpack.EnvironmentPlugin({
      CHECKOUT_URL: env.CHECKOUT_URL, // use 'development' unless process.env.NODE_ENV is defined
      API_URL: env.API_URL,
    }),
    new LodashModuleReplacementPlugin(),
    new Visualizer(),
  ],
});
