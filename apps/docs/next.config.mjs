import createMDX from '@next/mdx';

const buildYear = new Date().getFullYear().toString();

/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['react-tree-multi-select'],
    pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
    env: {
        BUILD_YEAR: buildYear,
    }
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
