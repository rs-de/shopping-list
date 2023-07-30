const withNextIntl = require("next-intl/plugin")("./src/i18n/index.ts");
const withMDX = require("@next/mdx")({ extension: /\.(md|mdx)$/ });

module.exports = withNextIntl(
  withMDX({
    experimental: {
      serverActions: true,
      mdxRs: true,
    },
  }),
);
