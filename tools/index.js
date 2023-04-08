/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable global-require */
module.exports = {
    createEnvFile: require('./create-dotenv').createEnvFile,
    getConsulConfig: require('./get-consul-config').getConsulConfig,
    prepareVariables: require('./prepare-variables').prepareVariables,
};
