'use strict';
module.exports = function exit(stdin, stdout, repl) {
  stdin.on('keypress', function (s, key) {
    if (key && key.ctrl && key.name === 'd') {
      stdout.write('bye!\n');
      process.exit(0);
    }
  });
};
