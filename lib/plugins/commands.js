'use strict';
var fs     =  require('fs')
  , format =  require('util').format
  , state  =  require('../state')
  , log    =  require('../log')
  , utl    =  require('../utl')
  , colors =  require('../ansicolors')
  ;

module.exports = function commands(repl) {

  // remove obsolete .break command
  delete repl.commands['.break'];
  repl.commands['.clear'].help = 'Break, and also clear the local context';

  // redefine help to improve printout
  repl.defineCommand('help', {
    help: 'Show this list of repl commands',
    action: function() {
      Object.keys(this.commands)
        .sort()
        .forEach(function(name) {
          var cmd = repl.commands[name]
            , help = cmd.help || ''
            , formattedName = colors.brightBlue(utl.pad(name, 15));

          repl.outputStream.write('_______________\n');
          repl.outputStream.write(format('%s %s\n', formattedName, help));
        });
      repl.outputStream.write('_______________\n\n');
      this.displayPrompt();
    }
  });

  repl.defineCommand('compact', {
      help: 'Toggles if code is compacted before being sourced to the repl [Default on]'
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
            log.error('Need to supply on or off as argument. Example: .compact on');
        }
        this.displayPrompt();
      }
  });

  repl.defineCommand('highlight', {
      help: 'Toggles if syntax highlighted code is printed to the repl before being sourced in the repl [Default off]'
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
            log.error('Need to supply on or off as argument. Example: .highlight on');
        }
        repl.displayPrompt();
      }
  });

  repl.defineCommand('depth', {
      help: 'Set the depth to which an object is traversed when printed to the repl [Default 2]'
    , action: function (depth) { 
        var num;
        if (!depth) {
          log.info('Current inspect depth is: %s. You can set it by supplying a number as argument.', state.inspect.depth);
        } else if (isNaN(num = parseInt(depth, 10))) {
          log.error('Need to supply a number for the depth. Example: .depth 4');
        } else {
          state.inspect.depth = num;
          log.info('Depth is.', num);
        }
        this.displayPrompt();
      }
  });

  repl.defineCommand('hidden', {
      help: 'Set whether hidden properties are included during traversal of an object that is printed to the repl [Default off]'
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
        this.displayPrompt();
      }
  });
};
