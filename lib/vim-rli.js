'use strict';

var readlineVim =  require('readline-vim')
  , vim;

module.exports = function hookVim(repl) {
  vim = readlineVim(repl.rli);
  return vim;
}; 

// needs to be getter since vim is initialized only once bindings are applied
module.exports.__defineGetter__('vim', function () { return vim; });
