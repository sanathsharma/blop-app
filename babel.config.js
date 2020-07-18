module.exports = {
    "env": {
        "production": {
            "minified": true,
            "comments": false,
            "ignore": [
                "./src/setupTests.js",
                "**/*.test.js",
                "**/*.spec.js",
                "./src/__mocks__/**.*"
            ],
        }
    },
    "presets": [
        [
            "@babel/preset-env",
            {
                "targets": {
                    "node": "current"
                }
            }
        ]
    ],
    "plugins": [
        "@babel/plugin-proposal-object-rest-spread",
        "@babel/plugin-proposal-optional-chaining",
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-proposal-private-methods",
        [
            "module-resolver",
            {
                "root": [
                    "./src"
                ],
                "alias": {
                    "db-config": `./src/database/config/config.js`,
                    "models": `./src/database/models`,
                    "db": `./src/db.js`,
                    "cache": `./src/cache.js`,
                    "utils": `./src/utils`,
                    "app": `./src/app.js`
                }
            }
        ],
        [
            "@babel/plugin-transform-runtime",
            {
                "regenerator": true
            }
        ]
    ]
};