'use strict';

var resolve =  require('./resolve')
  , log     =  require('../lib/log')
  , vimrli  =  require('../lib/vim-rli')
  ; 

module.exports = function (repl, cb) {
  var vim = vimrli.vim;
  resolve(function (config) {
    if (config.map) {
      if (typeof config.map !== 'function')
        log.errorln('Found "map" in config, but it is a [%s]. It needs to be a function (ignoring for now).', typeof config.map);
      else 
        config.map(vim.map.normal, vim.map.insert);
    }
    cb();
  });
};
