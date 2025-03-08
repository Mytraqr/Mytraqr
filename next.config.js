/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Ensure we're using the correct output directory for Netlify
  distDir: '.next'
}

module.exports = nextConfig 