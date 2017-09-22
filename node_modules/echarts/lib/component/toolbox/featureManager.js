'use strict';


    var features = {};

    module.exports = {
        register: function (name, ctor) {
            features[name] = ctor;
        },

        get: function (name) {
            return features[name];
        }
    };
