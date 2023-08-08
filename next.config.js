const withNextIntl = require("next-intl/plugin")("./src/i18n/index.ts");
const withMDX = require("@next/mdx")({ extension: /\.(md|mdx)$/ });

const defaultRuntimeCaching = require("next-pwa/cache");

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  cacheOnFrontEndNav: true,
  runtimeCaching: [...defaultRuntimeCaching],
});
module.exports = withPWA(
  withNextIntl(
    withMDX({
      reactStrictMode: true,
      experimental: {
        serverActions: true,
        mdxRs: true,
      },
    }),
  ),
);
