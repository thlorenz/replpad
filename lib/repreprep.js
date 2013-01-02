'use strict';
/*jshint asi:true */

var repl  =  require('repl')
  , path  =  require('path')
  , fs    =  require('fs')
  , Kat   =  require('kat')
  , edits =  require('./editsStream')
  ;

module.exports = function createRepl(root) {
  repl.start({
      prompt          :  'ne > '
    , input           :  edits(root)
    , output          :  process.stdout
    , ignoreUndefined :  true
    , useColors       :  true
  });
}
