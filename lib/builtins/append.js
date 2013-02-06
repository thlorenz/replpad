'use strict';
var fs             =  require('fs')
  , log            =  require('../log')
  , state          =  require('../state')
  , completeAppend =  require('../complete-append');


module.exports = function append(repl) {
  var stdin = repl.inputStream
    , stdout = repl.outputStream;

  function appendHistoryToFile(entry, last, lines) {
    if (!entry) { 
      log.warn('Since no file was sourced, I wouldn\'t know what file to append to.');
      return repl.displayPrompt();
    }

    var appendLine = repl.rli.history[last];
    var append = completeAppend(repl.rli.history);

    if (!append) { 
      log.warn('Found nothing in history that could be appended.');
      return repl.displayPrompt();
    }

    state.fileFeedSuspended = true;

    repl.displayPrompt();
    log.info('%s>> \'%s\'', append.highlighted, entry.path);
    repl.displayPrompt();

    fs.appendFile(entry.fullPath, append.raw, function (err) {
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
      help: 'Appends the last entered parsable chunk of code or the last line to the last file that was sourced in the repl'
    , action: function () { 
        appendHistoryToFile(state.lastFedFile, 1, 1); 
      }
  });
};
