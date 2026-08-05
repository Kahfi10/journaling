/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",

  images: {
    qualities: [100, 90, 80, 75],
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
      { protocol: "https", hostname: "is1-ssl.mzstatic.com", pathname: "/**" },
      { protocol: "https", hostname: "is2-ssl.mzstatic.com", pathname: "/**" },
      { protocol: "https", hostname: "is3-ssl.mzstatic.com", pathname: "/**" },
      { protocol: "https", hostname: "is4-ssl.mzstatic.com", pathname: "/**" },
      { protocol: "https", hostname: "is5-ssl.mzstatic.com", pathname: "/**" },
    ],
  },

  serverExternalPackages: ["@prisma/client", "bcryptjs"],

  experimental: {
    serverActions: {
      bodySizeLimit: "520mb",
    },
  },
}

export default nextConfig
