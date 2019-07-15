const fix = require("./content-fixer").default;

fix(
    "./node_modules/react-scripts/config/webpack.config.js",
    "// Disable require.ensure as it's not a standard language feature.",
    "{ enforce: 'pre', test: /.tsx?$/, use: [{ loader: 'tslint-loader', options: { emitErrors: true, fix: true } }], exclude: [/(node_modules)/, /(serviceWorker.ts)/] },"
);
