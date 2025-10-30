import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure Turbopack (Next.js 16 default)
  turbopack: {
    resolveAlias: {
      canvas: './empty-module.js',
    },
  },
  // Fallback webpack config for when not using Turbopack
  webpack: (config: any) => {
    // Handle PDF.js worker and canvas
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
    };

    // Handle PDF.js worker files
    config.module.rules.push({
      test: /pdf\.worker\.(min\.)?js/,
      type: 'asset/resource',
      generator: {
        filename: 'static/worker/[hash][ext][query]',
      },
    });
    
    return config;
  },
  // Serve static files
  async headers() {
    return [
      {
        source: '/pdf.worker.min.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
