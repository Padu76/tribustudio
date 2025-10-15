/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      { source: '/chi-siamo', destination: '/' },
      { source: '/servizi', destination: '/' },
      { source: '/come-funziona', destination: '/' },
      { source: '/testimonianze', destination: '/' },
      { source: '/faq', destination: '/' },
      { source: '/contatti', destination: '/' },
    ];
  },
};

module.exports = nextConfig;
