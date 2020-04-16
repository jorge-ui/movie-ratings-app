/* config-overrides.js */

module.exports = function override(config) {
    //do stuff with the webpack config...
    config.module.rules.push({
        test: /\.worker\.js$/,
        use: { loader: 'worker-loader' }
    });
    return config;
};