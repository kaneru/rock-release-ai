const prepareVariables = (variables) => {
    return Object.entries(variables).reduce((prepared, [key, value]) => {
        return [...prepared, `${key}=${value}`];
    }, []);
};

module.exports = {
    prepareVariables,
};
