# default-gateway
[![](https://img.shields.io/npm/v/default-gateway.svg?style=flat)](https://www.npmjs.org/package/default-gateway) [![](https://img.shields.io/npm/dm/default-gateway.svg)](https://www.npmjs.org/package/default-gateway) [![](https://api.travis-ci.org/silverwind/default-gateway.svg?style=flat)](https://travis-ci.org/silverwind/default-gateway)

> Get the default network gateway, cross-platform.

Obtains the machine's default gateway through `exec` calls to OS routing interfaces. On Linux and Android, the `ip` command must be available (usually provided by the `iproute2` package).

## Installation

```
$ npm install default-gateway
```

## Example

```js
const defaultGateway = require('default-gateway');

defaultGateway.v4().then(result => {
  //=> {gateway: '1.2.3.4', interface: 'en1'}
});

defaultGateway.v6().then(result => {
  //=> {gateway: '2001:db8::1', interface: 'en2'}
});
```

## API

### defaultGateway.v4()

Returns a promise that resolves to a object containing the IPv4 `gateway` and `interface` properties. If it succeeds, `gateway` will always be defined, while `interface` can be `null` if it cannot be determined. Rejects when the gateway cannot be determined.

### defaultGateway.v6()

Returns a promise that resolves to a object containing the IPv6 `gateway` and `interface` properties. If it succeeds, `gateway` will always be defined, while `interface` can be `null` if it cannot be determined. Rejects when the gateway cannot be determined.

## License

© [silverwind](https://github.com/silverwind), distributed under BSD licence
