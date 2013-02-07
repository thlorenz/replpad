'use strict';

var readlineVim =  require('readline-vim')
  , wire = require('./wire')
  , vim;

module.exports = function hookVim(repl) {
  vim = readlineVim(repl.rli);

  // TODO: no clue why this doesn't work in here, but inside manage-plugins it does
  // wire.on('emit-code.start', vim.forceInsert.bind(vim));

  return vim;
}; 

// needs to be getter since vim is initialized only once bindings are applied
module.exports.__defineGetter__('vim', function () { return vim; });
