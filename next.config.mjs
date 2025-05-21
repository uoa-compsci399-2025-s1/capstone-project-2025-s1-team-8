import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      use: ['@svgr/webpack'],
    })

    return config
  },

  experimental: {
    // Experimental turbo configuration for handling SVG files.
    // Turbopack is still in experimental stages, so this configuration is included
    // alongside the Webpack rule to provide a fallback and ensure compatibility.
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  output: 'standalone',
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
