/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
const fastify = require('fastify')({
    logger: { level: 'error' },
    pluginTimeout: 0,
});
const Next = require('next');
const tools = require('./tools');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const SHOULD_RESPECT_CONSUL =
    typeof process.env.SKIP_CONSUL === 'undefined' ? false : process.env.SKIP_CONSUL === 'false';

const server = fastify;

const createApp = async () => {
    let config = {};
    if (SHOULD_RESPECT_CONSUL) {
        // eslint-disable-next-line no-console
        console.log(`[prepare] 🚧 consul`);
        config = await tools.getConsulConfig();
        if (dev) {
            await tools.createEnvFile(tools.prepareVariables(config));
        }
    }

    const app = Next({
        dev,
        customServer: true,
    });

    const handle = app.getRequestHandler();

    // eslint-disable-next-line no-console
    console.log(`[prepare] 🗂 app`);

    app.prepare()
        .then(() => {
            if (dev) {
                server.get('/_next/*', (req, reply) => {
                    return handle(req.raw, reply.raw).then(() => {
                        reply.sent = true;
                    });
                });
            }

            server.all('/*', (req, reply) => {
                return handle(req.raw, reply.raw).then(() => {
                    reply.sent = true;
                });
            });

            async function noOpParser(req, payload) {
                return payload;
            }

            server.addContentTypeParser('text/plain', noOpParser);

            server.setNotFoundHandler((request, reply) => {
                return app.render404(request.raw, reply.raw).then(() => {
                    reply.sent = true;
                });
            });

            server.listen(port, '0.0.0.0', (err) => {
                if (err) throw err;
                // eslint-disable-next-line no-console
                console.log(`[ready] 🛸 http://localhost:${port}`);
            });
        })
        .catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error.stack);
            process.exit(1);
        });
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
createApp();
