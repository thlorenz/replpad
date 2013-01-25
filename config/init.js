'use strict';

var resolve = require('./resolve')
  , log = require('../lib/log');

module.exports = function (repl, vim, cb) {
  resolve(function (config) {
    if (config.map) {
      if (typeof config.map !== 'function')
        log.error('Found "map" in config, but it is a [%s]. It needs to be a function (ignoring for now).', typeof config.map);
      else 
        config.map(vim.map.insert, vim.map.normal);
    }
    cb();
  });
};
