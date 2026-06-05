/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  turbopack: {
    resolveAlias: {
      'onnxruntime-node': './lib/empty.js',
    }
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'onnxruntime-node': './lib/empty.js',
    };
    return config;
  }
};

export default nextConfig;
