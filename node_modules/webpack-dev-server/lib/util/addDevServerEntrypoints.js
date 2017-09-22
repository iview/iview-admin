'use strict';

/* eslint no-param-reassign: 'off' */

const createDomain = require('./createDomain');

module.exports = function addDevServerEntrypoints(webpackOptions, devServerOptions, listeningApp) {
  if (devServerOptions.inline !== false) {
    // we're stubbing the app in this method as it's static and doesn't require
    // a listeningApp to be supplied. createDomain requires an app with the
    // address() signature.
    const app = listeningApp || {
      address() {
        return { port: devServerOptions.port };
      }
    };
    const domain = createDomain(devServerOptions, app);
    const devClient = [`${require.resolve('../../client/')}?${domain}`];

    if (devServerOptions.hotOnly) { devClient.push('webpack/hot/only-dev-server'); } else if (devServerOptions.hot) { devClient.push('webpack/hot/dev-server'); }

    [].concat(webpackOptions).forEach((wpOpt) => {
      if (typeof wpOpt.entry === 'object' && !Array.isArray(wpOpt.entry)) {
        Object.keys(wpOpt.entry).forEach((key) => {
          wpOpt.entry[key] = devClient.concat(wpOpt.entry[key]);
        });
      } else if (typeof wpOpt.entry === 'function') {
        wpOpt.entry = wpOpt.entry(devClient);
      } else {
        wpOpt.entry = devClient.concat(wpOpt.entry);
      }
    });
  }
};
