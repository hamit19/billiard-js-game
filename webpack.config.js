const path = require("path");

const htmlWebpackPlugin = require("html-webpack-plugin");

const devMode = process.env.NODE_ENV !== "production";

module.exports = {
  mode: devMode ? "development" : "production",

  optimization: {
    minimize: true,
  },

  entry: {
    app: path.resolve(__dirname, "src/index.js"),
  },

  output: {
    path: path.join(__dirname, "build"),
    filename: "[name].bundle.js",
    assetModuleFilename: "assets/[hash][ext][query]",
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,

        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        // include: /assets/,
        use: [
          "file-loader",
          {
            loader: "image-webpack-loader",
          },
        ],
      },
      {
        test: /\.wav$/,
        // include: /assets/,
        loader: "file-loader",
      },
    ],
  },

  plugins: [
    new htmlWebpackPlugin({
      filename: path.join(__dirname, "build/index.html"),
      template: path.join(__dirname, "src/index.html"),
    }),
  ],

  devServer: {
    static: {
      directory: path.join(__dirname, "build"),
      watch: true,
    },

    port: 9091,

    open: true,
  },
};
