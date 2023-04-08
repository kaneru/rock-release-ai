// eslint-disable-next-line filename-rules/match
import NextErrorComponent, { ErrorProps } from 'next/error';
import * as Sentry from '@sentry/nextjs';
import { NextPageContext } from 'next';

interface IErrorPageProps {
    statusCode: number;
    hasGetInitialPropsRun: boolean;
    err: NextPageContext['err'];
}

interface IInitialErrorProps extends ErrorProps {
    hasGetInitialPropsRun: boolean;
}

const ErrorPage = ({ statusCode, hasGetInitialPropsRun, err }: IErrorPageProps) => {
    if (!hasGetInitialPropsRun && err) {
        // getInitialProps is not called in case of
        // https://github.com/vercel/next.js/issues/8592. As a workaround, we pass
        // err via _app.js so it can be captured
        if (process.env.SENTRY_ENABLED) {
            Sentry.captureException(err);
        }
    }

    return <NextErrorComponent statusCode={statusCode} />;
};

ErrorPage.getInitialProps = async ({ res, err, req }: NextPageContext) => {
    const errorInitialProps = (await NextErrorComponent.getInitialProps({
        req,
        res,
    } as NextPageContext)) as IInitialErrorProps;

    // Workaround for https://github.com/vercel/next.js/issues/8592, mark when
    // getInitialProps has run
    errorInitialProps.hasGetInitialPropsRun = true;

    if (err) {
        if (process.env.SENTRY_ENABLED) {
            Sentry.captureException(err);
        }

        return errorInitialProps;
    }

    return errorInitialProps;
};

export default ErrorPage;
