module.exports = {
    root: true,
    env: {
        node: true
    },
    plugins: [
        '@typescript-eslint'
    ],
    extends: [
        'plugin:vue/vue3-essential',
    ],
    parserOptions: {
        ecmaVersion: 2020,
        parser: '@typescript-eslint/parser',
    },
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'indent': ['error', 4],
        'quotes': ['error', 'single'],

        // Typescript
        '@typescript-eslint/naming-convention': [
            'error',
            {
                selector: 'interface',
                format: ['PascalCase'],
                custom: {
                    regex: "^I[A-Z]",
                    match: true
                }
            },
        ],
        '@typescript-eslint/ban-types': ['warn', {
            types: {
                Array: 'Use [] instead',
                Object: {
                    message: 'Use object instead',
                    fixWith: 'object',
                },
                String: {
                    message: 'Use string instead',
                    fixWith: 'string',
                },
                Number: {
                    message: 'Use number instead',
                    fixWith: 'number',
                },
                Boolean: {
                    message: 'Use boolean instead',
                    fixWith: 'boolean',
                }
            }
        }],
        '@typescript-eslint/explicit-member-accessibility': ['error', {
            accessibility: 'explicit',
            overrides: {
                constructors: 'off',
            },
        }],
        '@typescript-eslint/class-name-casing': ['error', {
            allowUnderscorePrefix: false,
        }],
    },
}
