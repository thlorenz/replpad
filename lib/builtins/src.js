'use strict';
var findexquire = require('../findexquire');

module.exports = function plugSrc(repl) {
  Function.prototype.__defineGetter__('src', function () {
    var fnsrc = this.toString();
    var locs = findexquire.find(fnsrc);

    if (locs) {
      locs.forEach(function (loc) {
        fnsrc += '\n// ' + loc.file + ':' + loc.start.line + ':' + loc.start.column;
      });
    }
    return fnsrc;
  });
};
