const path = require('path');
const ReactRefreshPlugin = require('@rspack/plugin-react-refresh');
const rspack = require('@rspack/core');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const generouted = require('@generouted/react-router/plugin').default;

const isDev = process.env.NODE_ENV === 'development';

module.exports = { 
  mode: isDev ? 'development' : 'production',
  entry: './src/main.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    publicPath: '/',
    clean: true,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    tsConfig: {
      configFile: path.resolve(__dirname, 'tsconfig.json'),
    }
  },
  module: {
    // parser: {
    //   javascript: {
    //     importMetaContext: true,
    //   },
    // },
    rules: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        loader: 'builtin:swc-loader',
        options: {
          jsc: {
            parser: {
              syntax: 'typescript',
            },
          },
        },
        type: 'javascript/auto',
      },
      {
        test: /\.tsx$/,
        use: {
          loader: 'builtin:swc-loader',
          options: {
            sourceMap: true,
            jsc: {
              parser: {
                syntax: 'typescript',
                tsx: true,
              },
              transform: {
                react: {
                  runtime: 'automatic',
                  development: isDev,
                  refresh: isDev,
                },
              },
            },
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),generouted.webpack(),
    isDev && new ReactRefreshPlugin(),
    isDev && new rspack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    historyApiFallback: true,
    port: 3001,
    hot: true,
  },
}; 