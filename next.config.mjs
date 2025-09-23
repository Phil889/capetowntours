/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  poweredByHeader: false,
  images: {
    unoptimized: false,
    domains: ['capetownsafaritours.com'],
  },
}

export default nextConfig