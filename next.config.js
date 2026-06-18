const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'images.unsplash.com'],
    unoptimized: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'prisma'],
    outputFileTracingIncludes: {
      '/api/**': ['./prisma/prisma/dev.db', './prisma/dev.db'],
      '/dashboard/**': ['./prisma/prisma/dev.db', './prisma/dev.db'],
    },
  },
}

module.exports = nextConfig
