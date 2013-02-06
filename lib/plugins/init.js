'use strict';

var plugClearScreen =  require('./clear-screen')
  , plugExit        =  require('./exit')
  , plugAppend      =  require('./append')
  , plugCommands    =  require('./commands')
  , plugSrc         =  require('./src')
  , plugPrompt      =  require('./prompt');

module.exports = function initPlugins(repl) {

  plugClearScreen(repl);
  plugExit(repl);
  plugAppend(repl);
  plugCommands(repl);
  plugSrc(repl);

  plugPrompt(repl);
};
