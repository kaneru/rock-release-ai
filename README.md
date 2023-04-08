# inDriver @ Next.js Boilerplate

## What's inside

Core:

-   [Next.js](https://nextjs.org/)
-   [Linaria](https://linaria.dev/)
-   [UI-kit](http://frontend-web-ui.stage.k8s.test.idmp.tech/)
-   [TypeScript](https://www.typescriptlang.org/)
-   [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)
-   [Jest](https://jestjs.io/)

Platform Tools:

-   [eslint](https://eslint.org/)
-   [prettier](https://prettier.io/)
-   [husky](https://github.com/typicode/husky)
-   [lint-staged](https://github.com/okonet/lint-staged)
-   [commitlint](https://commitlint.js.org/#/)
-   [stylelint](https://stylelint.io/)

Infrastructure:

-   [IMP Ready](http://imp-console.k8s.test.idmp.tech)
-   [Consul Ready](https://consul.test.idmp.tech/ui/ixc-dc/services)
-   [Sentry Ready](https://docs.sentry.io)

## Getting Started

First of all, intall deps

```sh
npm i
```

Run the dev-server:

```sh
npm run dev
```

or, if pnpm is preferred

```sh
pnpm dev
```

## Environment Variables

### Built-in boilerplate variables

| var              | values                            | default     | description    |
| ---------------- | --------------------------------- | ----------- | -------------- |
| `DISABLE_SENTRY` | boolean                           | false       | sentry         |
| `NODE_ENV`       | production \| test \| development | development | node           |
| `ANALYZE`        | boolean                           | false       | analyzer       |
| `SKIP_CONSUL`    | boolean                           | true        | consul         |
| `SENTRY_DSN`     | sting                             | undefined   | sentry app dsn |

Learn more about [environment variables in Next.js](https://nextjs.org/docs/basic-features/environment-variables)

**Important** Build-time props are not available when using Consul. We can only get the props at start time. You can use `publicRuntimeConfig` or `serverRuntimeConfig`, [documentation](https://nextjs.org/docs/api-reference/next.config.js/runtime-configuration).

| Prop Type        | Consul | SSG | SSR |
| ---------------- | ------ | --- | --- |
| Build-time props | -      | +   | +   |
| Runtime props    | +      | -   | +   |

> A page that relies on `publicRuntimeConfig` **must** use `getInitialProps` or `getServerSideProps` or your application must have a Custom App with getInitialProps to opt-out of Automatic Static Optimization. Runtime configuration won't be available to any page (or component in a page) without being server-side rendered.

Consul config for the `publicRuntime` usage example:

```json
{
    "publicRuntimeConfig": {
        "NEXT_PUBLIC_HOST_API": "https://HOSTNAME"
    }
}
```



Consul Env. Variables:

`CONSUL_HTTP_ADDR=HOST`

`CONSUL_HTTP_TOKEN=TOKEN`

`CONFIG_PATH_KEY=CONFIG_PATH`

`CONFIG_PATH_APP=APP_NAME`

## How to deploy

Easiest way to deploy your application is to use IMP. First of all, change `APP_NAME_STUB` in [Makefile](./Makefile) to your actual application name.
