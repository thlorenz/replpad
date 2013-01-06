var format = require('util').format
  , colors = require('./ansicolors');

module.exports = {
    silly: function () { console.log(colors.brightBlack('SILL '), format.apply(this, arguments)); }
  , info: function () { console.log(colors.green('INFO '), format.apply(this, arguments)); }
  , error: function () { console.error(colors.red('ERR! '), format.apply(this, arguments)); }
};
