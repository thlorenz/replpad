'use strict';
/*jshint asi:true */

var repl  =  require('repl')
  , path  =  require('path')
  , fs    =  require('fs')
  , edits =  require('./editsStream')
  ;

module.exports = function createRepl(root) {
  repl.start({
      prompt          :  'pad > '
    , input           :  edits(root)
    , output          :  process.stdout
    , ignoreUndefined :  true
    , useColors       :  true
  });
}
