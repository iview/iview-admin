'use strict';
const os = require('os');
const defaultGateway = require('default-gateway');
const ipaddr = require('ipaddr.js');

const defaults = {
	v6: '::1',
	v4: '127.0.0.1'
};

function internalIp(family) {
	return defaultGateway[family]().then(result => {
		const interfaces = os.networkInterfaces();
		const gatewayIp = ipaddr.parse(result.gateway);
		let ret;

		// Look for the matching interface in all local interfaces
		Object.keys(interfaces).some(name => {
			return interfaces[name].some(addr => {
				const prefix = ipaddr.parse(addr.netmask).prefixLengthFromSubnetMask();
				const net = ipaddr.parseCIDR(`${addr.address}/${prefix}`);

				if (net[0].kind() === gatewayIp.kind() && gatewayIp.match(net)) {
					ret = net[0].toString();
				}

				return Boolean(ret);
			});
		});

		return ret ? ret : defaults[family];
	}).catch(() => defaults[family]);
}

module.exports.v6 = () => internalIp('v6');
module.exports.v4 = () => internalIp('v4');
