'use strict';
/*jshint asi:true */

var repl      =  require('repl')
  , feedEdits =  require('./feedEdits')
  ;

module.exports = function createRepl(root) {
  feedEdits(process.stdin, root, function (stdin) {
    repl.start({
        prompt          :  'pad > '
      , input           :  stdin 
      , output          :  process.stdout
      , ignoreUndefined :  true
      , useColors       :  true
    });
  });
};
