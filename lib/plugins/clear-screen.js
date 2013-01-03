'use strict';
module.exports = function plugClearScreen(stdin, stdout, prompt) {
  stdin.on('keypress', function (s, key) {
    if (key && key.ctrl && key.name === 'l') {
      stdout.write('\u001B[2J\u001B[0;0f');
      stdout.write(prompt);
    }
  });
};
