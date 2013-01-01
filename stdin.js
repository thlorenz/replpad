'use strict';
/*jshint asi:true */

var repl  =  require('repl')
  , path  =  require('path')
  , fs    =  require('fs')
  , Kat   =  require('kat')
  , fooin =  fs.createReadStream(path.join(__dirname, 'test/fixtures/foo.js'))

var input = new Kat();
input.add(fooin)
input.add(process.stdin)

repl.start({
    prompt          :  'ne > '
  , input           :  input 
  , output          :  process.stdout
  , ignoreUndefined :  true
  , useColors       :  true
});
