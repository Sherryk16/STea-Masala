import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "**",
      },
      // Blog covers and in-article images uploaded through the admin panel live
      // in Supabase Storage. Built lazily so a fresh clone still builds without
      // Supabase credentials configured.
      ...(supabaseUrl
        ? [
            {
              protocol: "https" as const,
              hostname: new URL(supabaseUrl).hostname,
              pathname: "/storage/v1/object/public/**",
            },
          ]
        : []),
    ],
  },

  experimental: {
    serverActions: {
      // Blog bodies are HTML, and the editor uploads images straight to
      // Supabase Storage, so the default 1MB cap is too small.
      bodySizeLimit: "12mb",
    },
  },
};

export default nextConfig;