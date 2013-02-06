'use strict';

var log     =  require('../lib/log')
  , config  =  require('./current')
  , inspect =  require('../lib/utl').inspect
  ;

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

module.exports = function applyConfig(repl) {
  initVim(config, repl);
  initMatchToken(config, repl);
};
