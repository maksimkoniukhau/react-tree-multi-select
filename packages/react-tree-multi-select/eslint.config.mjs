import js from '@eslint/js';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import {defineConfig, globalIgnores} from 'eslint/config';

export default defineConfig([
    {files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'], plugins: {js}, extends: ['js/recommended']},
    {files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'], languageOptions: {globals: globals.browser}},
    tseslint.configs.recommended,
    pluginReact.configs.flat.recommended,
    pluginReactHooks.configs['recommended-latest'],
    {
        rules: {
            '@typescript-eslint/no-unused-vars': 'warn',
            'react/prop-types': 'off',
            'react/display-name': 'off',
        },
    },
    globalIgnores([
        'node_modules/**',
        'coverage/**',
        'dist/**'
    ]),
]);
