// miscellaneous commands

'use strict';
var fs = require('fs')
  , state = require('../state')
  , log = require('../log');

module.exports = function commands(repl) {
  repl.defineCommand('comp', {
      help: 'Toggles if code is compacted before being sourced in the repl. [Default on]'
    , action: function (toggle) { 
        switch(toggle.toLowerCase()) {
          case '': 
          case 'on': 
            state.format.compact = true; 
            log.info('Compact code on.');
            break;
          case 'off': 
            state.format.compact = false; 
            log.info('Compact code off.');
            break;
          default:
            log.error('Need to supply on or off as argument. Example: .comp on');
        }
        repl.displayPrompt();
      }
  });

  repl.defineCommand('syntax', {
      help: 'Toggles if code is printed syntax highighted before being sourced in the repl. [Default off]'
    , action: function (toggle) { 
        switch(toggle.toLowerCase()) {
          case '': 
          case 'on': 
            state.highlight = true; 
            log.info('Syntax highlight code on.');
            break;
          case 'off': 
            state.highlight = false; 
            log.info('Syntax highlight code off.');
            break;
          default:
            log.error('Need to supply on or off as argument. Example: .syntax on');
        }
        repl.displayPrompt();
      }
  });

  repl.defineCommand('depth', {
      help: 'Set the depth to which an object is traversed when printed to the console. [Default 2]'
    , action: function (depth) { 
        var num;
        if (!depth) {
          log.info('Current inspect depth is: %s. You can set it by supplying a number as argument.', state.inspect.depth);
        } else if (isNaN(num = parseInt(depth, 10))) {
          log.error('Need to supply a number for the depth. Example: .depth 4');
        } else {
          state.inspect.depth = num;
        }
        repl.displayPrompt();
      }
  });

  repl.defineCommand('hidden', {
      help: 'Set whether hidden properties are included when an object is traversed when printed to the console. [Default off]'
    , action: function (toggle) { 
        switch(toggle.toLowerCase()) {
          case '': 
          case 'on': 
            state.inspect.showHidden = true; 
            log.info('Show hidden on.');
            break;
          case 'off': 
            state.inspect.showHidden = false; 
            log.info('Show hidden off.');
            break;
          default:
            log.error('Need to supply on or off as argument. Example: .hidden on');
        }
        repl.displayPrompt();
      }
  });
};
