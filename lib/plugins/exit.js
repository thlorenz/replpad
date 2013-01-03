'use strict';
module.exports = function exit(stdin, stdout, prompt) {
  stdin.on('keypress', function (s, key) {
    if (key && key.ctrl && key.name === 'd') {
      stdout.write('bye!\n');
      process.exit(0);
    }
  });
};
