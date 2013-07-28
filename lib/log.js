var format = require('util').format
  , colors = require('ansicolors')
  , debug = !!process.env.REPLPAD_DEBUG;

module.exports = {
    silly: function () {
      if (!debug) return;
      console.log(colors.brightBlack('SILL '), colors.brightBlack(format.apply(this, arguments)));
    }
  , info: function () {
      console.log(colors.green('INFO '), colors.brightBlack(format.apply(this, arguments)));
    }
  , warn: function () {
      console.error(colors.blue('WARN '), format.apply(this, arguments));
    }
  , error: function () {
      console.error(colors.red('ERR! '), format.apply(this, arguments));
    }
  , sillyln: function () {
      this.silly.apply(this, arguments);
      this.displayPrompt();
    }
  , print: function () {
      console.log(colors.brightBlack(format.apply(this, arguments)));
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
      console.log(colors.brightBlack(format.apply(this, arguments)));
      this.displayPrompt();
    }
  , displayPrompt: function () {
      if (!this.repl) return;
      this.repl.displayPrompt();
    }
  // will be set by repreprep when initialized
  , repl: undefined
};
