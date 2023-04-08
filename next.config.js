/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */
const withLinaria = require('next-linaria');
const withImages = require('next-images');
const bundleAnalyzer = require('@next/bundle-analyzer');
const { withSentryConfig } = require('@sentry/nextjs');
const transpileModules = require('next-transpile-modules');
const tools = require('./tools');

const SHOULD_DISABLE_SENTRY = process.env.DISABLE_SENTRY === 'true';
const SHOULD_ANALYZE = process.env.ANALYZE === 'true';
// const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const SHOULD_RESPECT_CONSUL =
    typeof process.env.SKIP_CONSUL === 'undefined' ? false : process.env.SKIP_CONSUL === 'false';

const withBundleAnalyzer = bundleAnalyzer({
    enabled: SHOULD_ANALYZE,
});

const withTranspileModules = transpileModules([
    '@indriver/nova',
    '@indriver/mireska',
    '@indriver/kaycee',
    '@indriver/vandermeer',
    '@indriver/nova-core',
    '@indriver/yrel',
    '@indriver/whisperwind',
]);

module.exports = async () => {
    const plugins = [withImages, withLinaria, withTranspileModules];

    if (!SHOULD_DISABLE_SENTRY) {
        plugins.push((userConfig) => withSentryConfig(userConfig, { dryRun: true }));
    }

    if (SHOULD_ANALYZE) {
        plugins.push(withBundleAnalyzer);
    }

    let config = {};

    if (SHOULD_RESPECT_CONSUL) {
        config = await tools.getConsulConfig();
    }

    const { publicRuntimeConfig, serverRuntimeConfig } = config;

    return plugins.reduce((acc, next) => next(acc), {
        pageExtensions: ['page.tsx', 'page.ts', 'api.ts', 'api.tsx'],
        linaria: {
            cacheDirectory: '.next/cache/linaria',
            sourceMap: !IS_PRODUCTION,
            displayName: !IS_PRODUCTION,
        },
        // https://nextjs.org/docs/api-reference/next.config.js/react-strict-mode
        reactStrictMode: true,
        env: {
            SENTRY_ENABLED: !SHOULD_DISABLE_SENTRY,
        },
        publicRuntimeConfig: publicRuntimeConfig,
        serverRuntimeConfig: serverRuntimeConfig,
        webpack: (webpackConfig) => {
            webpackConfig.module.rules.push({
                test: /\.svg$/,
                type: 'asset',
                parser: { dataUrlCondition: { maxSize: 8192 } },
            });

            return webpackConfig;
        },
    });
};
