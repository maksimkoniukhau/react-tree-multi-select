import * as sass from 'sass';
import {resolve} from 'path';
import {Configuration} from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';

const commonConfig: Configuration = {
  entry: './src/index.ts',
  mode: 'production',
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
  },
  plugins: [
    new ESLintPlugin({
      extensions: ['js', 'jsx', 'ts', 'tsx'],
      emitWarning: true,
      failOnError: false,
    }),
  ],
};

const umdConfig: Configuration = {
  ...commonConfig,
  output: {
    filename: 'index.cjs',
    path: resolve(__dirname, 'dist'),
    library: {
      type: 'commonjs2',
    },
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
    library: {
      type: 'module',
    },
    clean: true,
  },
};

module.exports = [umdConfig, moduleConfig];
