// eslint-disable-next-line
module.exports = {
    "env": {
        "browser": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint",
    ],
    "settings": {
    },
    "rules": {
        "block-scoped-var": "error",
        "eqeqeq": ["error", "always", { "null": "ignore" }],
        "no-var": "error",
        "prefer-const": "error",
        "eol-last": "error",
        "prefer-arrow-callback": "error",
        "no-trailing-spaces": "error",
        "no-restricted-properties": [
            "error",
            {
                "object": "describe",
                "property": "only"
            },
            {
                "object": "it",
                "property": "only"
            }
        ],
        "quotes": ["warn", "double", { "avoidEscape": true }],
        "indent": ["warn", 4, { "SwitchCase": 1 }],
        "linebreak-style": ["warn", "unix"],
    },
    "overrides": [
        {
            "files": ["**/*.ts"],
            "parser": "@typescript-eslint/parser",
            "extends": [
                "plugin:@typescript-eslint/recommended"
            ],
            "rules": {
                "@typescript-eslint/no-explicit-any": 1,
                "@typescript-eslint/no-unused-vars": "off",
            },
            "parserOptions": {
                "ecmaVersion": 2020,
                "sourceType": "module"
            }
        }
    ]
}
