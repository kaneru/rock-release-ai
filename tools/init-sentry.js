import * as Sentry from '@sentry/nextjs';
import getConfig from 'next/config';

const initSentry = (dsn) => {
    const { publicRuntimeConfig = {} } = getConfig();
    Sentry.init({
        dsn: dsn || publicRuntimeConfig.SENTRY_DSN,
        tracesSampleRate: 1.0,
        // Note: if you want to override the automatic release value, do not set a
        // `release` value here - use the environment variable `SENTRY_RELEASE`, so
        // that it will also get attached to your source maps
    });
};

module.exports = {
    initSentry,
};
