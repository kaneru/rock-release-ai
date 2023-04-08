/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
const tools = require('./tools');

const SHOULD_RESPECT_CONSUL =
    typeof process.env.SKIP_CONSUL === 'undefined' ? false : process.env.SKIP_CONSUL === 'false';

(async () => {
    if (SHOULD_RESPECT_CONSUL) {
        // eslint-disable-next-line no-console
        console.log(`[prepare] 🚧 consul`);
        const config = await tools.getConsulConfig();
        await tools.createEnvFile(tools.prepareVariables(config));
    }
})();
