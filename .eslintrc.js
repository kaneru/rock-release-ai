module.exports = {
    root: true,
    extends: [
        'plugin:@next/next/recommended',
        '@indriver/eslint-config',
        '@indriver/eslint-config/rules/react',
        '@indriver/eslint-config/rules/react-hooks',
        '@indriver/eslint-config/rules/prettier',
        '@indriver/eslint-config/rules/typescript',
        '@indriver/eslint-config/rules/jest',
        'plugin:jsx-a11y/recommended',
    ],
    parserOptions: {
        project: './tsconfig.json',
    },
    plugins: ['jsx-a11y'],
    env: {
        es6: true,
        node: true,
        browser: true,
    },
    rules: {
        'react/jsx-uses-react': 'off',
        'react/react-in-jsx-scope': 'off',
    },
    settings: {
        react: {
            version: 'latest',
        },
    },
};
