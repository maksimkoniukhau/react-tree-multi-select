import * as sass from 'sass';
import {resolve} from 'path';
import {Configuration} from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';

const commonConfig: Configuration = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            happyPackMode: true,
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {implementation: sass},
          },
        ],
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  externals: {
    react: 'react',
    'react-dom': 'react-dom',
    'react/jsx-runtime': 'react/jsx-runtime',
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
  }
};

const umdConfig: Configuration = {
  ...commonConfig,
  output: {
    filename: 'index.umd.js',
    path: resolve(__dirname, 'dist'),
    libraryTarget: "umd",
    library: 'rtms',
    umdNamedDefine: true,
  },
};

const moduleConfig: Configuration = {
  ...commonConfig,
  experiments: {
    outputModule: true
  },
  output: {
    filename: 'index.mjs',
    path: resolve(__dirname, 'dist'),
    libraryTarget: 'module',
    clean: true,
  },
};

module.exports = [umdConfig, moduleConfig];
