#!/usr/bin/env node

'use strict';
/*jshint asi:true */

var cp   =  require('child_process')
  , fs   =  require('fs')
  , repl =  cp.spawn('node')
  //, log  =  fs.createWriteStream('repl-log.txt')

repl.stdout.pipe(process.stdout)

process.stdin.resume()
process.stdin.pipe(repl.stdin)

repl.stdin.on('end', function () {
  process.stdout.write('repl stream ended')  
})

repl.on('exit', function (code) {
  process.exit(code)  
})

