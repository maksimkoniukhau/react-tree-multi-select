import * as sass from 'sass';
import {resolve} from 'path';
import {Configuration} from 'webpack';

const config: Configuration = {
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
    output: {
        filename: 'index.umd.js',
        path: resolve(__dirname, 'dist'),
        libraryTarget: "umd",
        library: 'rts',
        umdNamedDefine: true,
        clean: true,
    },
    externals: {
        react: 'react',
    },
};

export default config;
