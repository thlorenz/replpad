'use strict';

var resolve =  require('./resolve')
  , log     =  require('../lib/log')
  , current =  require('./current')
  , inspect =  require('../lib/utl').inspect
  ; 

function override(prop, overridee, overrider) {
  var to = overridee[prop]
    , from = overrider[prop];
  if (!from) return;

  Object.keys(from).forEach(function (k) {
    to[k] = from[k];
  });
}

// TODO: combining defaults and user config into current config needs tests
function initializeCurrent(conf) {
  var structs = [ 'feed', 'inspect' ];

  structs.forEach(function (x) { override(x, current, conf); });

  Object.keys(conf)
    .filter(function (k) { return !~structs.indexOf(k); })
    .forEach(function (k) { current[k] = conf[k]; });
}

function disabled(config, plugin) {
  if (!config.plugins) return false;

  var val = config.plugins[plugin];
  return val !== undefined && val !== true;
} 

function initVim(config, repl) {
  if (disabled(config, 'vim')) return;

  var vim = require('../lib/vim-rli')(repl);
  repl.imap = vim.map.insert;
  repl.nmap = vim.map.normal;
  repl.__defineGetter__('maps', function () { log.println(inspect(vim.map.mappings)); });

  if (config.map) {
    if (typeof config.map !== 'function')
      log.errorln('Found "map" in config, but it is a [%s]. It needs to be a function (ignoring for now).', typeof config.map);
    else 
      config.map(vim.map.normal, vim.map.insert);
  }
}

function initMatchToken(config, repl) {
  if (disabled(config, 'matchtoken')) return;

  require('readline-matchtoken')(repl.rli);
}

module.exports = function (cb) {
  /*
   * A bit messy, but works as follows:
   *  1. resolve the config
   *  2. tell repreprep that we have it
   *  3. repreprep creates repl and calls apply config, passing the created repl
   *      - at this point the vimrli has also been initialized
   *  4. we finish by applying the config
   */
  resolve(function (config) {
    initializeCurrent(config);

    function applyConfig(repl) {
      initVim(config, repl);
      initMatchToken(config, repl);
    }

    cb(applyConfig);
  });
};
