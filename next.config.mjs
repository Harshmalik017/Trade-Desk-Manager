/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    // Admin surfaces moved from top-level URLs to the /admin/* layer.
    return [
      { source: '/dashboard', destination: '/admin/dashboard', permanent: true },
      { source: '/clients/:path*', destination: '/admin/clients/:path*', permanent: true },
      { source: '/bills/:path*', destination: '/admin/bills/:path*', permanent: true },
      { source: '/bills', destination: '/admin/bills/export', permanent: true },
      { source: '/logs', destination: '/admin/logs', permanent: true },
      { source: '/archive', destination: '/admin/archive', permanent: true },
      { source: '/pitch/:path*', destination: '/admin/pitch/:path*', permanent: true },
      { source: '/pitch', destination: '/admin/pitch', permanent: true },
      { source: '/settings', destination: '/admin/settings', permanent: true },
      { source: '/clients', destination: '/admin/clients', permanent: true },
    ];
  },
};

export default nextConfig;
