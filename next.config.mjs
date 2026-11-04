/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
  async redirects() {
    return [
      {
        source: '/satin-alma/:slug',
        destination: '/:slug',
        permanent: true,
      },
      {
        source: '/satin-alma',
        destination: '/malzeme-bilgisi',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
