'use strict';

const url = require('url');
const internalIp = require('internal-ip');


module.exports = function createDomain(options, listeningApp) {
  const protocol = options.https ? 'https' : 'http';
  const appPort = listeningApp ? listeningApp.address().port : 0;
  const port = options.socket ? 0 : appPort;
  const hostname = options.useLocalIp ? internalIp.v4() : options.host;

  // the formatted domain (url without path) of the webpack server
  return options.public ? `${protocol}://${options.public}` : url.format({
    protocol,
    hostname,
    port
  });
};
