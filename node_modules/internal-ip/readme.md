# internal-ip [![Build Status](https://travis-ci.org/sindresorhus/internal-ip.svg?branch=master)](https://travis-ci.org/sindresorhus/internal-ip)

> Get your internal IP address


## Install

```
$ npm install internal-ip
```


## Usage

```js
const internalIp = require('internal-ip');

internalIp.v6().then(ip => {
	console.log(ip);
	//=> 'fe80::1'
});

internalIp.v4().then(ip => {
	console.log(ip);
	//=> '10.0.0.79'
});
```

The module relies on tools provided by most operating systems. One notable exception may be the `ip` command which is used on Linux. If it's missing, it can usually be installed with the `iproute2` package in your package manager.

In the case no address can be determined, `::1` or `127.0.0.1` will be returned as a fallback. If you think this is incorrect, please open an [issue](https://github.com/sindresorhus/internal-ip/issues/new).


## Related

- [internal-ip-cli](https://github.com/sindresorhus/internal-ip-cli) - CLI for this module
- [public-ip](https://github.com/sindresorhus/public-ip) - Get your public IP address


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
