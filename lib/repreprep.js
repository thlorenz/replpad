'use strict';
/*jshint asi:true */

var repl            =  require('repl')
  , feedEdits       =  require('./feedEdits')
  , plugClearScreen =  require('./plugins/clear-screen')
  , plugExit        =  require('./plugins/exit')
  ;

function inspect(obj, depth) {
  console.log(require('util').inspect(obj, false, depth || 5, true));
}

module.exports = function createRepl(root) {
  feedEdits(process.stdin, root, function (stdin) {
    var stdout = process.stdout
      , prompt = 'pad > ';

    var r = repl.start({
        prompt          :  'pad > '
      , input           :  stdin 
      , output          :  process.stdout
      , ignoreUndefined :  true
      , useColors       :  true
      , useGlobal       :  true
    });
    
    plugClearScreen(stdin, stdout, r);
    plugExit(stdin, stdout, r);
    global.r = r;
  });
};
