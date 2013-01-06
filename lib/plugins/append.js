'use strict';
var fs = require('fs')
  , log = require('../log')
  , state = require('../state');


module.exports = function append(repl) {
  var stdin = repl.inputStream
    , stdout = repl.outputStream;

  function appendHistoryToFile(entry, last, lines) {
    var appendLine = repl.rli.history[last];
    state.fileFeedSuspended = true;

    repl.displayPrompt();
    log.info('echo \'%s\' >> \'%s\'', appendLine, entry.path);
    repl.displayPrompt();

    fs.appendFile(entry.fullPath, appendLine, function (err) {
      state.fileFeedSuspended = false;
      if (err) return log.error(err);
    });
  }

  stdin.on('keypress', function (s, key) {
    if (key && key.ctrl && key.name === 'a') {
      appendHistoryToFile(state.lastFedFile, 0, 1);
    }
  });

  repl.defineCommand('append', {
      help: 'Appends the last entered line to the last file that was sourced in the repl'
    , action: function () { 
        appendHistoryToFile(state.lastFedFile, 1, 1); 
      }
  });
};
