/* eslint-disable import/no-extraneous-dependencies */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  eslint: {
    dirs: ['.'],
  },
  poweredByHeader: false,
  trailingSlash: true,
  basePath: '',
  // The starter code load resources from `public` folder with `router.basePath` in React components.
  // So, the source code is "basePath-ready".
  // You can remove `basePath` if you don't need it.
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_MAINNET_RPC_URL: 'https://mainnet.infura.io/v3/[SECRET]',
    NEXT_PUBLIC_QUICKNODE_RPC_URL:
      'https://distinguished-skilled-dew.discover.quiknode.pro/[SECRET]/',
  },
});
