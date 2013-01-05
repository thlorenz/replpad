'use strict';
module.exports = function exit(repl) {
  var stdin = repl.inputStream
    , stdout = repl.outputStream;

  stdin.on('keypress', function (s, key) {
    if (key && key.ctrl && key.name === 'd') {
      stdout.write('bye!\n');
      process.exit(0);
    }
  });
};
