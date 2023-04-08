/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
const Consul = require('consul');

const {
    CONSUL_HTTP_ADDR = '127.0.0.1:443',
    CONSUL_HTTP_TOKEN = '',
    CONFIG_PATH_KEY = '',
    CONFIG_PATH_APP = '',
} = process.env;

const getConsulConfig = async () => {
    const [host, port] = CONSUL_HTTP_ADDR.split(':');

    try {
        const consul = new Consul({
            host,
            port,
            promisify: true,
            secure: true,
            defaults: {
                token: CONSUL_HTTP_TOKEN,
            },
        });

        const res = await consul.kv.get(`${CONFIG_PATH_APP}/${CONFIG_PATH_KEY}`);
        return JSON.parse(res.Value);
    } catch (err) {
        return {};
    }
};

module.exports = {
    getConsulConfig,
};
