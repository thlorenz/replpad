'use strict';

var format = require('util').format
  , colors = require('ansicolors')
  , debug = !!process.env.REPLPAD_DEBUG;

module.exports = {
    silly: function () {
      if (!debug) return;
      this.output.write(colors.brightBlack('SILL ') + colors.brightBlack(format.apply(this, arguments)) + '\n');
    }
  , info: function () {
      this.output.write(colors.green('INFO ') + colors.brightBlack(format.apply(this, arguments)) + '\n');
    }
  , warn: function () {
      this.output.write(colors.blue('WARN ') + format.apply(this, arguments) + '\n');
    }
  , error: function () {
      this.output.write(colors.red('ERR! ') + format.apply(this, arguments) + '\n');
    }
  , print: function () {
      this.output.write(colors.brightBlack(format.apply(this, arguments)) + '\n');
    }
  , sillyln: function () {
      if (!debug) return;
      this.silly.apply(this, arguments);
      this.displayPrompt();
    }
  , infoln: function () {
      this.info.apply(this, arguments);
      this.displayPrompt();
    }
  , warnln: function () {
      this.warn.apply(this, arguments);
      this.displayPrompt();
    }
  , errorln: function () {
      this.error.apply(this, arguments);
      this.displayPrompt();
    }
  , println: function () {
      this.print.apply(this, arguments);
      this.displayPrompt();
    }
  , displayPrompt: function () {
      if (!this.repl) return;
      this.repl.displayPrompt();
    }
  // will be set by repreprep when initialized
  , repl: undefined
  , output: undefined
};
