/** @type {import('next').NextConfig} */
const nextConfig = {
  // حذف output: 'export' برای پشتیبانی از Dynamic routes
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
