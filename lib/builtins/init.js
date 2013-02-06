'use strict';

var plugClearScreen =  require('./clear-screen')
  , plugExit        =  require('./exit')
  , plugAppend      =  require('./append')
  , plugCommands    =  require('./commands')
  , plugSrc         =  require('./src')
  , plugPrompt      =  require('./prompt')
  , state           =  require('../state')
  ;

module.exports = function initPlugins() {
  var repl = state.repl;

  plugClearScreen(repl);
  plugExit(repl);
  plugAppend(repl);
  plugCommands(repl);
  plugSrc(repl);

  plugPrompt(repl);
};
