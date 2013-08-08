'use strict';
var colors = require('ansicolors')

module.exports = function divider (x) { 
  return '\n' + colors.bgMagenta(colors.brightYellow('-- ' + x + ' --')) + '\n';
}

