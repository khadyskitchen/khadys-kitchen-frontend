import type { NextConfig } from "next";

// API origin for connect-src, derived from the same env var the client's base
// query uses so the CSP can never drift from where requests actually go.
const apiOrigin = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SERVER_URI ?? "").origin;
  } catch {
    return "";
  }
})();

// Content-Security-Policy. 'unsafe-inline' on script-src is a deliberate
// trade-off: a nonce-based policy would force every page dynamic and break the
// ISR architecture, and Next's own hydration bootstrap plus the static JSON-LD
// block are inline scripts. The policy still pins where scripts can LOAD from,
// blocks plugins/object embeds, restricts form targets and fetch destinations
// (limiting exfiltration), and keeps framing locked down. Turnstile needs
// Cloudflare's challenge origin for script, frame, and connect.
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com",
  "font-src 'self' data:",
  ["connect-src", "'self'", apiOrigin, "https://challenges.cloudflare.com"]
    .filter(Boolean)
    .join(" "),
  "frame-src https://challenges.cloudflare.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

// Sensible baseline security headers for every response on this origin.
const securityHeaders = [
  // Clickjacking: this app is never meant to be framed.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  // Don't let browsers MIME-sniff responses into a different content type.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Send the origin (not the full path) on cross-origin navigations.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Force HTTPS for two years, including subdomains.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Disable powerful browser features this app never uses.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

// Optional pin for the Cloudinary account: when the cloud name is provided we
// scope the image proxy to exactly our account's delivery path, so foreign
// Cloudinary images can't ride through this site's /_next/image optimizer.
// Falls back to the path-shape scope when unset.
const cloudinaryCloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

const nextConfig: NextConfig = {
  // Lets verification builds run beside a live `next dev` without the two
  // fighting over .next (e.g. NEXT_DIST_DIR=.next-build next build).
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // Don't advertise the framework in an x-powered-by header.
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        // Admin-uploaded cover/content images (Cloudinary), scoped to the
        // image-delivery path (`/<cloud>/image/...`) - and to our exact cloud
        // when NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is set.
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: cloudinaryCloud
          ? `/${cloudinaryCloud}/image/**`
          : "/*/image/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
