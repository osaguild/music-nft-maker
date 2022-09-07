/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    dirs: ['components', 'config', 'hooks', 'lib', 'pages', 'styles', 'types', 'utils'],
  },
}

module.exports = nextConfig
