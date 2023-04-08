// eslint-disable-next-line filename-rules/match
import Head from 'next/head';
import 'normalize.css';
import '@indriver/yrel/dist/fonts/noto.css';
import '@indriver/yrel/dist/theme-dark/theme.css';
import '@indriver/yrel/dist/theme-light/theme.css';
import { AppProps } from 'next/app';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { App } from '../app/app';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <meta charSet='utf-8' />
                <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
                <meta name='description' content='Description' />
                <meta name='keywords' content='Keywords' />
                <title>inDriver Next.js Boilerplate</title>
                <meta
                    name='viewport'
                    content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover'
                />
                <meta name='mobile-web-app-capable' content='yes' />
                <meta name='apple-mobile-web-app-capable' content='yes' />
                <meta name='application-name' content='inDriver' />
                <meta name='apple-mobile-web-app-title' content='inDriver' />
                <meta name='theme-color' content='#fff' />
                <meta name='msapplication-navbutton-color' content='#fff' />
                <meta name='apple-mobile-web-app-status-bar-style' content='black-translucent' />
                <meta name='msapplication-starturl' content='/' />
            </Head>
            <QueryClientProvider client={queryClient}>
                <App>
                    <Component {...pageProps} />
                </App>
            </QueryClientProvider>
        </>
    );
}

export default MyApp;
