"use strict";

const net = require("net");
const execa = require("execa");
const dests = ["default", "0.0.0.0", "0.0.0.0/0", "::", "::/0"];

const args = {
  v4: ["-rn", "-f", "inet"],
  v6: ["-rn", "-f", "inet6"],
};

const get = family => {
  return execa.stdout("netstat", args[family]).then(stdout => {
    let result;

    (stdout || "").trim().split("\n").some(line => {
      const results = line.split(/ +/) || [];
      const target = results[0];
      const gateway = results[1];
      const iface = results[5];
      if (dests.indexOf(target) !== -1 && gateway && net.isIP(gateway)) {
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
