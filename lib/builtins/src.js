'use strict';

module.exports = function plugSrc(repl) {
  Function.prototype.__defineGetter__('src', function () { return this.toString(); });
};
