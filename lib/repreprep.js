'use strict';
/*jshint asi:true */

var repl            =  require('repl')
  , feedEdits       =  require('./feedEdits')
  , plugClearScreen =  require('./plugins/clear-screen')
  , plugExit        =  require('./plugins/exit')
  ;

module.exports = function createRepl(root) {
  feedEdits(process.stdin, root, function (stdin) {
    var stdout = process.stdout
      , prompt = 'pad > ';

    plugClearScreen(stdin, stdout, prompt);
    plugExit(stdin, stdout, prompt);
    repl.start({
        prompt          :  'pad > '
      , input           :  stdin 
      , output          :  process.stdout
      , ignoreUndefined :  true
      , useColors       :  true
    });
  });
};
