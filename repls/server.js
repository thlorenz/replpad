'use strict';
/*jshint asi:true */

var repl = require('repl')
  , net = require('net')
  , connections = 0

function inspect(obj, depth) {
  console.log(require('util').inspect(obj, false, depth || 5, true));
}

net.createServer(function (sock) {
  ++connections;  

  repl.start({
      prompt          :  'red > '
    , input           :  sock
    , output          :  sock
    , ignoreUndefined :  true
    , useColors       :  true
    , terminal        :  true
  })
  .on('line', function (line) {
    console.log('line', line); 
  })
  .on('exit', sock.end)

})
.listen(1851216)

