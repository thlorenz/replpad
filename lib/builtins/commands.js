'use strict';
var fs     =  require('fs')
  , format =  require('util').format
  , log    =  require('../log')
  , utl    =  require('../utl')
  , colors =  require('ansicolors')
  , config =  require('../../config/current')
  ;

function currently(bool) {
  return bool ? '[on] ' : '[off] ';
}

module.exports = function commands(repl) {
  // '.command' pre 0.11 but 'command' afterwards

  // remove obsolete .break command
  delete repl.commands['.break'];
  delete repl.commands['break'];
  
  var clearCommand = repl.commands['.clear'] || repl.commands['clear'];
  if(clearCommand) clearCommand.help = 'Break, and also clear the local context';

  // redefine help to improve printout
  repl.defineCommand('help', {
    help: 'Show this list of repl commands',
    action: function() {
      Object.keys(this.commands)
        .sort()
        .forEach(function(name) {
          var cmd = repl.commands[name]
            , help = cmd.help || ''
            , formattedName = colors.brightBlue(utl.pad(name, 15, ' '));

          log.print('%s %s\n', formattedName, help);
        });
      this.displayPrompt();
    }
  });

  function compactHelp() {
    return currently(config.feed.format.compact) + 'Toggles if code is compacted before being sourced to the repl'; 
  }

  function updateCompact() {
    log.info('Compact code ' + currently(config.feed.format.compact));
    repl.commands['.compact'].help = compactHelp();
  }

  repl.defineCommand('compact', {
      help: compactHelp()
    , action: function (param) { 
        switch(param.toLowerCase()) {
          case '': 
            config.feed.format.compact = !config.feed.format.compact;
            updateCompact();
            break;
          case 'on': 
            config.feed.format.compact = true; 
            updateCompact();
            break;
          case 'off': 
            config.feed.format.compact = false; 
            updateCompact();
            break;
          default:
            log.error('Need to supply on or off as argument. Example: .compact on');
        }
        this.displayPrompt();
      }
  });

  function highlightHelp() {
    return currently(config.highlight) + 
      'Toggles if syntax highlighted code is printed to the repl before being sourced';
  }

  function updateHighlight() {
    log.info('Syntax highlight code ' + currently(config.highlight));
    repl.commands['.highlight'].help = highlightHelp();
  }

  repl.defineCommand('highlight', {
      help: highlightHelp() 
    , action: function (param) { 
        switch(param.toLowerCase()) {
          case '': 
            config.highlight = !config.highlight;
            updateHighlight();
            break;
          case 'on': 
            config.highlight = true; 
            updateHighlight();
            break;
          case 'off': 
            config.highlight = false; 
            updateHighlight();
            break;
          default:
            log.error('Need to supply on or off as argument. Example: .highlight on');
        }
        repl.displayPrompt();
      }
  });

  function depthHelp() {
    return '[' + config.inspect.depth + '] ' +
      'Sets the depth to which an object is traversed when printed to the repl';
  }
    
  function updateDepth() {
    log.info('Depth [%s]', config.inspect.depth);
    repl.commands['.depth'].help = depthHelp();
  }

  repl.defineCommand('depth', {
      help: depthHelp() 
    , action: function (depth) { 
        var num;
        if (!depth) {
          log.info('Current inspect depth is: %s. You can set it by supplying a number as argument.', config.inspect.depth);
        } else if (isNaN(num = parseInt(depth, 10))) {
          log.error('Need to supply a number for the depth. Example: .depth 4');
        } else {
          config.inspect.depth = num;
          updateDepth();
        }
        this.displayPrompt();
      }
  });

  function hiddenHelp() {
    return currently(config.inspect.showHidden) + 
      'Set whether hidden properties are included during traversal of an object that is printed to the repl';
  }

  function updateHidden() {
    log.info('Show hidden ' + currently(config.inspect.showHidden));
    repl.commands['.hidden'].help = hiddenHelp();
  }

  repl.defineCommand('hidden', {
      help: hiddenHelp() 
    , action: function (param) { 
        switch(param.toLowerCase()) {
          case '': 
            config.inspect.showHidden = !config.inspect.showHidden;
            updateHidden();
            break;
          case 'on': 
            config.inspect.showHidden = true; 
            updateHidden();
            break;
          case 'off': 
            config.inspect.showHidden = false; 
            updateHidden();
            break;
          default:
            log.error('Need to supply on or off as argument. Example: .hidden on');
        }
        this.displayPrompt();
      }
  });

  function talkHelp() {
    if (!config.scriptietalkie) config.scriptietalkie = {};
    return currently(config.scriptietalkie.active) + 
      'Toggles whether the file content is evaluated with scriptie-talkie when it is piped to the repl';
  }

  function updateTalk() {
    if (!config.scriptietalkie) config.scriptietalkie = {};
    log.info('Evaluate piped code with scriptie-talkie ' + currently(config.scriptietalkie.active));
    repl.commands['.talk'].help = talkHelp();
  }

  repl.defineCommand('talk', {
      help: talkHelp() 
    , action: function (param) { 
        if (!config.scriptietalkie) config.scriptietalkie = {};
        switch(param.toLowerCase()) {
          case '': 
            config.scriptietalkie.active = !config.scriptietalkie.active;
            updateTalk();
            break;
          case 'on': 
            config.scriptietalkie.active = true; 
            updateTalk();
            break;
          case 'off': 
            config.scriptietalkie.active = false; 
            updateTalk();
            break;
          default:
            log.error('Need to supply on or off as argument. Example: .talk on');
        }
        this.displayPrompt();
      }
  });
};
