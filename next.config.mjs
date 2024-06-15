/** @type {import('next').NextConfig} */
// const nextConfig = {};
const nextConfig = {
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        config.experiments = {
            asyncWebAssembly: true,
            layers: true, // 启用 'experiments.layers'
        };

        return config;
    },
};

export default nextConfig;
