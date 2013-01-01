/*jshint asi:true */
var repl = require('repl')

function inspect(obj, depth) {
  console.log(require('util').inspect(obj, false, depth || 5, true));
}

inspect(repl);
repl.start({
    prompt          :  'ne > '
  , input           :  process.stdin
  , output          :  process.stdout
  , ignoreUndefined :  true
  , useColors       :  true
});
