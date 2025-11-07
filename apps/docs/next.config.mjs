import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['react-tree-multi-select'],
    pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx']
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
