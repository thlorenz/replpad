'use strict';

var config = require('../../config/current')
  , colors = require('ansicolors');

module.exports = function managePrompt(repl) {
  var rli = repl.rli
    , prompt = rli._prompt = config.prompt || rli._prompt
    , vimrli = require('../vim-rli')
    ;
  
  vimrli.vim.events
    .on('normal', function () {
      prompt = rli._prompt;
      rli._prompt = colors.brightRed(prompt);
      rli.prompt(true);
    })
    .on('insert', function () {
      rli._prompt = prompt;
      rli.prompt(true);
    });
};
