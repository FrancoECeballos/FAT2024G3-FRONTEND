const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { GenerateSW } = require("workbox-webpack-plugin");

module.exports = {
  entry: "./src/index.jsx", // Punto de entrada para la aplicación
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "bundle.js", // Nombre del archivo de salida
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/, // Archivo a ser procesado
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"], // Extensiones a resolver
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html", // Plantilla HTML
    }),
    new GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
    }),
  ],
  devServer: {
    contentBase: path.join(__dirname, "build"),
    compress: true,
    port: 3000,
  },
};
