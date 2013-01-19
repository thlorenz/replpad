'use strict';

var readlineVim = require('readline-vim')
  , vim;


module.exports = function vimBindings(repl) {
  vim = readlineVim(repl.rli);
};

// needs to be function since vim is initialized only once bindings are applied
module.exports.vim = function getVim() {
  return vim;
};
