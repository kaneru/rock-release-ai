module.exports = {
    '*.{js,jsx,ts,tsx}': ['prettier --write', 'eslint --cache'],
    '*.{ts,tsx}': [() => 'tsc'],
};
