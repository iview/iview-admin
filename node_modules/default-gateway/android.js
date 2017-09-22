"use strict";

const net = require("net");
const execa = require("execa");

const args = {
  v4: ["-4", "r"],
  v6: ["-6", "r"],
};

const get = family => {
  return execa.stdout("ip", args[family]).then(stdout => {
    let result;

    (stdout || "").trim().split("\n").some(line => {
      const results = /default via (.+?) dev (.+?)( |$)/.exec(line) || [];
      const gateway = results[1];
      const iface = results[2];
      if (gateway && net.isIP(gateway)) {
        result = {gateway: gateway, interface: (iface ? iface : null)};
        return true;
      }
    });

    if (!result) {
      throw new Error("Unable to determine default gateway");
    }

    return result;
  });
};

module.exports.v4 = () => get("v4");
module.exports.v6 = () => get("v6");
