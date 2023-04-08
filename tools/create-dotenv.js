/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('path');
const { promises: fs } = require('fs');

const ENV_FILENAME = '.env.local';

const createEnvFile = async (variables) => {
    try {
        await fs.writeFile(path.resolve(process.cwd(), `${ENV_FILENAME}`), variables.join('\n'));
    } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(e);
    }
};

module.exports = {
    createEnvFile,
};
