'use strict';
/*jshint asi:true */

var net = require('net')
  , sock = net.connect(1851216)

process.stdin.pipe(sock);

sock.pipe(process.stdout);

sock
  .on('connect', function () {
    process.stdin.resume()
    process.stdin.setRawMode(true)
    process.stdin.write('1 + 2 + 3');
  })
  .on('close', function onSocketClose() {
    process.stdin.setRawMode(false)
    process.stdin.pause()
    sock.removeListener('close', onSocketClose)
  })

process.stdin.on('data', function (buf) {
  if (buf.length === 1 && buf[0] === 4) process.stdin.emit('end')
});

process.stdin.on('end', function () {
  sock.destroy()
  console.log()
})


