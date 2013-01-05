// miscellaneous commands

'use strict';
var fs = require('fs')
  , state = require('../state');

module.exports = function commands(repl) {
  repl.defineCommand('comp', {
      help: 'Toggles if code is compacted before being sourced in the repl. [Default off]'
    , action: function (toggle) { 
        switch(toggle.toLowerCase()) {
          case '': 
          case 'on': 
            state.format.compact = true; 
            console.log('Compact code on.');
            break;
          case 'off': 
            state.format.compact = false; 
            console.log('Compact code off.');
            break;
          default:
            console.error('Need to supply on or off as argument. Example: .comp on');
        }
        repl.displayPrompt();
      }
  });
};
