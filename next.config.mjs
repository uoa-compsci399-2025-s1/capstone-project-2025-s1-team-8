import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
  webpack(config) {
    // Add rule to handle SVG imports with @svgr/webpack
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    // Any other custom Webpack modifications (if needed) can go here

    return config
  },
  output: 'standalone',
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
