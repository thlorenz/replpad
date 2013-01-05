'use strict';
module.exports = function append(repl) {
  var stdin = repl.inputStream
    , stdout = repl.outputStream;

  stdin.on('keypress', function (s, key) {
    if (key && key.ctrl && key.name === 'a') {
      stdout.write('append\n');
      stdout.write(repl.prompt);
    }
  });
};
