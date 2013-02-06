'use strict';
module.exports = function plugClearScreen(repl) {
  var stdin = repl.inputStream
    , stdout = repl.outputStream;

  function clearScreen() {
    stdout.write('\u001B[2J\u001B[0;0f');
    repl.displayPrompt();
  }

  stdin.on('keypress', function (s, key) {
    if (key && key.ctrl && key.name === 'l') clearScreen();
  });
};
