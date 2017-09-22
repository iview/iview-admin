'use strict';

/* eslint func-names: off */
require('./polyfills');

const fs = require('fs');
const http = require('http');
const path = require('path');
const url = require('url');
const chokidar = require('chokidar');
const compress = require('compression');
const del = require('del');
const express = require('express');
const httpProxyMiddleware = require('http-proxy-middleware');
const ip = require('ip');
const serveIndex = require('serve-index');
const historyApiFallback = require('connect-history-api-fallback');
const selfsigned = require('selfsigned');
const sockjs = require('sockjs');
const spdy = require('spdy');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const OptionsValidationError = require('./OptionsValidationError');
const optionsSchema = require('./optionsSchema.json');

const clientStats = { errorDetails: false };
const log = console.log; // eslint-disable-line no-console

function Server(compiler, options) {
  // Default options
  if (!options) options = {};

  const validationErrors = webpack.validateSchema(optionsSchema, options);
  if (validationErrors.length) {
    throw new OptionsValidationError(validationErrors);
  }

  if (options.lazy && !options.filename) {
    throw new Error("'filename' option must be set in lazy mode.");
  }

  this.hot = options.hot || options.hotOnly;
  this.headers = options.headers;
  this.clientLogLevel = options.clientLogLevel;
  this.clientOverlay = options.overlay;
  this.progress = options.progress;
  this.disableHostCheck = !!options.disableHostCheck;
  this.publicHost = options.public;
  this.allowedHosts = options.allowedHosts;
  this.sockets = [];
  this.contentBaseWatchers = [];

  // Listening for events
  const invalidPlugin = () => {
    this.sockWrite(this.sockets, 'invalid');
  };
  if (this.progress) {
    const progressPlugin = new webpack.ProgressPlugin((percent, msg, addInfo) => {
      percent = Math.floor(percent * 100);
      if (percent === 100) msg = 'Compilation completed';
      if (addInfo) msg = `${msg} (${addInfo})`;
      this.sockWrite(this.sockets, 'progress-update', { percent, msg });
    });
    compiler.apply(progressPlugin);
  }
  compiler.plugin('compile', invalidPlugin);
  compiler.plugin('invalid', invalidPlugin);
  compiler.plugin('done', (stats) => {
    this._sendStats(this.sockets, stats.toJson(clientStats));
    this._stats = stats;
  });

  // Init express server
  const app = this.app = new express(); // eslint-disable-line

  app.all('*', (req, res, next) => { // eslint-disable-line
    if (this.checkHost(req.headers)) { return next(); }
    res.send('Invalid Host header');
  });

  // middleware for serving webpack bundle
  this.middleware = webpackDevMiddleware(compiler, options);

  app.get('/__webpack_dev_server__/live.bundle.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    fs.createReadStream(path.join(__dirname, '..', 'client', 'live.bundle.js')).pipe(res);
  });

  app.get('/__webpack_dev_server__/sockjs.bundle.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    fs.createReadStream(path.join(__dirname, '..', 'client', 'sockjs.bundle.js')).pipe(res);
  });

  app.get('/webpack-dev-server.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    fs.createReadStream(path.join(__dirname, '..', 'client', 'index.bundle.js')).pipe(res);
  });

  app.get('/webpack-dev-server/*', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    fs.createReadStream(path.join(__dirname, '..', 'client', 'live.html')).pipe(res);
  });

  app.get('/webpack-dev-server', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    /* eslint-disable quotes */
    res.write('<!DOCTYPE html><html><head><meta charset="utf-8"/></head><body>');
    const outputPath = this.middleware.getFilenameFromUrl(options.publicPath || "/");
    const filesystem = this.middleware.fileSystem;

    function writeDirectory(baseUrl, basePath) {
      const content = filesystem.readdirSync(basePath);
      res.write("<ul>");
      content.forEach((item) => {
        const p = `${basePath}/${item}`;
        if (filesystem.statSync(p).isFile()) {
          res.write('<li><a href="');
          res.write(baseUrl + item);
          res.write('">');
          res.write(item);
          res.write('</a></li>');
          if (/\.js$/.test(item)) {
            const htmlItem = item.substr(0, item.length - 3);
            res.write('<li><a href="');
            res.write(baseUrl + htmlItem);
            res.write('">');
            res.write(htmlItem);
            res.write('</a> (magic html for ');
            res.write(item);
            res.write(') (<a href="');
            res.write(baseUrl.replace(/(^(https?:\/\/[^\/]+)?\/)/, "$1webpack-dev-server/") + htmlItem); // eslint-disable-line
            res.write('">webpack-dev-server</a>)</li>');
          }
        } else {
          res.write('<li>');
          res.write(item);
          res.write('<br>');
          writeDirectory(`${baseUrl + item}/`, p);
          res.write('</li>');
        }
      });
      res.write("</ul>");
    }
    /* eslint-enable quotes */
    writeDirectory(options.publicPath || '/', outputPath);
    res.end('</body></html>');
  });

  let contentBase;
  if (options.contentBase !== undefined) { // eslint-disable-line
    contentBase = options.contentBase; // eslint-disable-line
  } else {
    contentBase = process.cwd();
  }

  // Keep track of websocket proxies for external websocket upgrade.
  const websocketProxies = [];

  const features = {
    compress() {
      if (options.compress) {
        // Enable gzip compression.
        app.use(compress());
      }
    },

    proxy() {
      if (options.proxy) {
        /**
          * Assume a proxy configuration specified as:
          * proxy: {
          *   'context': { options }
          * }
          * OR
          * proxy: {
          *   'context': 'target'
          * }
          */
        if (!Array.isArray(options.proxy)) {
          options.proxy = Object.keys(options.proxy).map((context) => {
            let proxyOptions;
            // For backwards compatibility reasons.
            const correctedContext = context.replace(/^\*$/, '**').replace(/\/\*$/, '');

            if (typeof options.proxy[context] === 'string') {
              proxyOptions = {
                context: correctedContext,
                target: options.proxy[context]
              };
            } else {
              proxyOptions = Object.assign({}, options.proxy[context]);
              proxyOptions.context = correctedContext;
            }
            proxyOptions.logLevel = proxyOptions.logLevel || 'warn';

            return proxyOptions;
          });
        }

        const getProxyMiddleware = (proxyConfig) => {
          const context = proxyConfig.context || proxyConfig.path;

          // It is possible to use the `bypass` method without a `target`.
          // However, the proxy middleware has no use in this case, and will fail to instantiate.
          if (proxyConfig.target) {
            return httpProxyMiddleware(context, proxyConfig);
          }
        };

        /**
        * Assume a proxy configuration specified as:
        * proxy: [
        *   {
        *     context: ...,
        *     ...options...
        *   },
        *   // or:
        *   function() {
        *     return {
        *       context: ...,
        *       ...options...
        *     };
        *   }
        * ]
        */
        options.proxy.forEach((proxyConfigOrCallback) => {
          let proxyConfig;
          let proxyMiddleware;

          if (typeof proxyConfigOrCallback === 'function') {
            proxyConfig = proxyConfigOrCallback();
          } else {
            proxyConfig = proxyConfigOrCallback;
          }

          proxyMiddleware = getProxyMiddleware(proxyConfig);
          if (proxyConfig.ws) {
            websocketProxies.push(proxyMiddleware);
          }

          app.use((req, res, next) => {
            if (typeof proxyConfigOrCallback === 'function') {
              const newProxyConfig = proxyConfigOrCallback();
              if (newProxyConfig !== proxyConfig) {
                proxyConfig = newProxyConfig;
                proxyMiddleware = getProxyMiddleware(proxyConfig);
              }
            }
            const bypass = typeof proxyConfig.bypass === 'function';
            // eslint-disable-next-line
            const bypassUrl = bypass && proxyConfig.bypass(req, res, proxyConfig) || false;

            if (bypassUrl) {
              req.url = bypassUrl;
              next();
            } else if (proxyMiddleware) {
              return proxyMiddleware(req, res, next);
            } else {
              next();
            }
          });
        });
      }
    },

    historyApiFallback() {
      if (options.historyApiFallback) {
        // Fall back to /index.html if nothing else matches.
        app.use(historyApiFallback(typeof options.historyApiFallback === 'object' ? options.historyApiFallback : null));
      }
    },

    contentBaseFiles() {
      if (Array.isArray(contentBase)) {
        contentBase.forEach((item) => {
          app.get('*', express.static(item));
        });
      } else if (/^(https?:)?\/\//.test(contentBase)) {
        log('Using a URL as contentBase is deprecated and will be removed in the next major version. Please use the proxy option instead.');
        log('proxy: {\n\t"*": "<your current contentBase configuration>"\n}'); // eslint-disable-line quotes
        // Redirect every request to contentBase
        app.get('*', (req, res) => {
          res.writeHead(302, {
            Location: contentBase + req.path + (req._parsedUrl.search || '')
          });
          res.end();
        });
      } else if (typeof contentBase === 'number') {
        log('Using a number as contentBase is deprecated and will be removed in the next major version. Please use the proxy option instead.');
        log('proxy: {\n\t"*": "//localhost:<your current contentBase configuration>"\n}'); // eslint-disable-line quotes
        // Redirect every request to the port contentBase
        app.get('*', (req, res) => {
          res.writeHead(302, {
            Location: `//localhost:${contentBase}${req.path}${req._parsedUrl.search || ''}`
          });
          res.end();
        });
      } else {
        // route content request
        app.get('*', express.static(contentBase, options.staticOptions));
      }
    },

    contentBaseIndex() {
      if (Array.isArray(contentBase)) {
        contentBase.forEach((item) => {
          app.get('*', serveIndex(item));
        });
      } else if (!/^(https?:)?\/\//.test(contentBase) && typeof contentBase !== 'number') {
        app.get('*', serveIndex(contentBase));
      }
    },

    watchContentBase: () => {
      if (/^(https?:)?\/\//.test(contentBase) || typeof contentBase === 'number') {
        throw new Error('Watching remote files is not supported.');
      } else if (Array.isArray(contentBase)) {
        contentBase.forEach((item) => {
          this._watch(item);
        });
      } else {
        this._watch(contentBase);
      }
    },

    middleware: () => {
      // include our middleware to ensure it is able to handle '/index.html' request after redirect
      app.use(this.middleware);
    },

    headers: () => {
      app.all('*', this.setContentHeaders.bind(this));
    },

    magicHtml: () => {
      app.get('*', this.serveMagicHtml.bind(this));
    },

    setup: () => {
      if (typeof options.setup === 'function') { options.setup(app, this); }
    }
  };

  const defaultFeatures = ['setup', 'headers', 'middleware'];
  if (options.proxy) { defaultFeatures.push('proxy', 'middleware'); }
  if (contentBase !== false) { defaultFeatures.push('contentBaseFiles'); }
  if (options.watchContentBase) { defaultFeatures.push('watchContentBase'); }
  if (options.historyApiFallback) {
    defaultFeatures.push('historyApiFallback', 'middleware');
    if (contentBase !== false) { defaultFeatures.push('contentBaseFiles'); }
  }
  defaultFeatures.push('magicHtml');
  if (contentBase !== false) { defaultFeatures.push('contentBaseIndex'); }
  // compress is placed last and uses unshift so that it will be the first middleware used
  if (options.compress) { defaultFeatures.unshift('compress'); }

  (options.features || defaultFeatures).forEach((feature) => {
    features[feature]();
  });

  if (options.https) {
    // for keep supporting CLI parameters
    if (typeof options.https === 'boolean') {
      options.https = {
        key: options.key,
        cert: options.cert,
        ca: options.ca,
        pfx: options.pfx,
        passphrase: options.pfxPassphrase,
        requestCert: options.requestCert || false
      };
    }

    let fakeCert;
    if (!options.https.key || !options.https.cert) {
      // Use a self-signed certificate if no certificate was configured.
      // Cycle certs every 24 hours
      const certPath = path.join(__dirname, '../ssl/server.pem');
      let certExists = fs.existsSync(certPath);

      if (certExists) {
        const certStat = fs.statSync(certPath);
        const certTtl = 1000 * 60 * 60 * 24;
        const now = new Date();

        // cert is more than 30 days old, kill it with fire
        if ((now - certStat.ctime) / certTtl > 30) {
          log('SSL Certificate is more than 30 days old. Removing.');
          del.sync([certPath], { force: true });
          certExists = false;
        }
      }

      if (!certExists) {
        log('Generating SSL Certificate');
        const attrs = [{ name: 'commonName', value: 'localhost' }];
        const pems = selfsigned.generate(attrs, {
          algorithm: 'sha256',
          days: 30,
          keySize: 2048,
          extensions: [{
            name: 'basicConstraints',
            cA: true
          }, {
            name: 'keyUsage',
            keyCertSign: true,
            digitalSignature: true,
            nonRepudiation: true,
            keyEncipherment: true,
            dataEncipherment: true
          }, {
            name: 'subjectAltName',
            altNames: [
              {
                // type 2 is DNS
                type: 2,
                value: 'localhost'
              },
              {
                type: 2,
                value: 'localhost.localdomain'
              },
              {
                type: 2,
                value: 'lvh.me'
              },
              {
                type: 2,
                value: '*.lvh.me'
              },
              {
                type: 2,
                value: '[::1]'
              },
              {
                // type 7 is IP
                type: 7,
                ip: '127.0.0.1'
              },
              {
                type: 7,
                ip: 'fe80::1'
              }
            ]
          }]
        });

        fs.writeFileSync(certPath, pems.private + pems.cert, { encoding: 'utf-8' });
      }
      fakeCert = fs.readFileSync(certPath);
    }

    options.https.key = options.https.key || fakeCert;
    options.https.cert = options.https.cert || fakeCert;

    if (!options.https.spdy) {
      options.https.spdy = {
        protocols: ['h2', 'http/1.1']
      };
    }

    this.listeningApp = spdy.createServer(options.https, app);
  } else {
    this.listeningApp = http.createServer(app);
  }

  // Proxy websockets without the initial http request
  // https://github.com/chimurai/http-proxy-middleware#external-websocket-upgrade
  websocketProxies.forEach(function (wsProxy) {
    this.listeningApp.on('upgrade', wsProxy.upgrade);
  }, this);
}

Server.prototype.use = function () {
  // eslint-disable-next-line
  this.app.use.apply(this.app, arguments);
};

Server.prototype.setContentHeaders = function (req, res, next) {
  if (this.headers) {
    for (const name in this.headers) { // eslint-disable-line
      res.setHeader(name, this.headers[name]);
    }
  }

  next();
};

Server.prototype.checkHost = function (headers) {
  // allow user to opt-out this security check, at own risk
  if (this.disableHostCheck) return true;

  // get the Host header and extract hostname
  // we don't care about port not matching
  const hostHeader = headers.host;
  if (!hostHeader) return false;

  // use the node url-parser to retrieve the hostname from the host-header.
  const hostname = url.parse(`//${hostHeader}`, false, true).hostname;

  // always allow requests with explicit IPv4 or IPv6-address.
  // A note on IPv6 addresses: hostHeader will always contain the brackets denoting
  // an IPv6-address in URLs, these are removed from the hostname in url.parse(),
  // so we have the pure IPv6-address in hostname.
  if (ip.isV4Format(hostname) || ip.isV6Format(hostname)) return true;

  // always allow localhost host, for convience
  if (hostname === 'localhost') return true;

  // allow if hostname is in allowedHosts
  if (this.allowedHosts && this.allowedHosts.length) {
    for (let hostIdx = 0; hostIdx < this.allowedHosts.length; hostIdx++) {
      const allowedHost = this.allowedHosts[hostIdx];
      if (allowedHost === hostname) return true;

      // support "." as a subdomain wildcard
      // e.g. ".example.com" will allow "example.com", "www.example.com", "subdomain.example.com", etc
      if (allowedHost[0] === '.') {
        // "example.com"
        if (hostname === allowedHost.substring(1)) return true;
        // "*.example.com"
        if (hostname.endsWith(allowedHost)) return true;
      }
    }
  }

  // allow hostname of listening adress
  if (hostname === this.listenHostname) return true;

  // also allow public hostname if provided
  if (typeof this.publicHost === 'string') {
    const idxPublic = this.publicHost.indexOf(':');
    const publicHostname = idxPublic >= 0 ? this.publicHost.substr(0, idxPublic) : this.publicHost;
    if (hostname === publicHostname) return true;
  }

  // disallow
  return false;
};

// delegate listen call and init sockjs
Server.prototype.listen = function (port, hostname, fn) {
  this.listenHostname = hostname;
  // eslint-disable-next-line

  const returnValue = this.listeningApp.listen(port, hostname, (err) => {
    const sockServer = sockjs.createServer({
      // Use provided up-to-date sockjs-client
      sockjs_url: '/__webpack_dev_server__/sockjs.bundle.js',
      // Limit useless logs
      log(severity, line) {
        if (severity === 'error') {
          log(line);
        }
      }
    });

    sockServer.on('connection', (conn) => {
      if (!conn) return;
      if (!this.checkHost(conn.headers)) {
        this.sockWrite([conn], 'error', 'Invalid Host header');
        conn.close();
        return;
      }
      this.sockets.push(conn);

      conn.on('close', () => {
        const connIndex = this.sockets.indexOf(conn);
        if (connIndex >= 0) {
          this.sockets.splice(connIndex, 1);
        }
      });

      if (this.clientLogLevel) { this.sockWrite([conn], 'log-level', this.clientLogLevel); }

      if (this.progress) { this.sockWrite([conn], 'progress', this.progress); }

      if (this.clientOverlay) { this.sockWrite([conn], 'overlay', this.clientOverlay); }

      if (this.hot) this.sockWrite([conn], 'hot');

      if (!this._stats) return;
      this._sendStats([conn], this._stats.toJson(clientStats), true);
    });

    sockServer.installHandlers(this.listeningApp, {
      prefix: '/sockjs-node'
    });

    if (fn) {
      fn.call(this.listeningApp, err);
    }
  });

  return returnValue;
};

Server.prototype.close = function (callback) {
  this.sockets.forEach((sock) => {
    sock.close();
  });
  this.sockets = [];
  this.listeningApp.close(() => {
    this.middleware.close(callback);
  });

  this.contentBaseWatchers.forEach((watcher) => {
    watcher.close();
  });
  this.contentBaseWatchers = [];
};

Server.prototype.sockWrite = function (sockets, type, data) {
  sockets.forEach((sock) => {
    sock.write(JSON.stringify({
      type,
      data
    }));
  });
};

Server.prototype.serveMagicHtml = function (req, res, next) {
  const _path = req.path;
  try {
    if (!this.middleware.fileSystem.statSync(this.middleware.getFilenameFromUrl(`${_path}.js`)).isFile()) { return next(); }
    // Serve a page that executes the javascript
    /* eslint-disable quotes */
    res.write('<!DOCTYPE html><html><head><meta charset="utf-8"/></head><body><script type="text/javascript" charset="utf-8" src="');
    res.write(_path);
    res.write('.js');
    res.write(req._parsedUrl.search || "");
    res.end('"></script></body></html>');
    /* eslint-enable quotes */
  } catch (e) {
    return next();
  }
};

// send stats to a socket or multiple sockets
Server.prototype._sendStats = function (sockets, stats, force) {
  if (!force &&
  stats &&
  (!stats.errors || stats.errors.length === 0) &&
  stats.assets &&
  stats.assets.every(asset => !asset.emitted)
  ) { return this.sockWrite(sockets, 'still-ok'); }
  this.sockWrite(sockets, 'hash', stats.hash);
  if (stats.errors.length > 0) { this.sockWrite(sockets, 'errors', stats.errors); } else if (stats.warnings.length > 0) { this.sockWrite(sockets, 'warnings', stats.warnings); } else { this.sockWrite(sockets, 'ok'); }
};

Server.prototype._watch = function (watchPath) {
  const watcher = chokidar.watch(watchPath).on('change', () => {
    this.sockWrite(this.sockets, 'content-changed');
  });

  this.contentBaseWatchers.push(watcher);
};

Server.prototype.invalidate = function () {
  if (this.middleware) this.middleware.invalidate();
};

// Export this logic, so that other implementations, like task-runners can use it
Server.addDevServerEntrypoints = require('./util/addDevServerEntrypoints');

module.exports = Server;
