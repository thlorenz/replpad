var path    =  require('path')
  , fs      =  require('fs')
  , util    =  require('util')
  , logFile =  path.join(__dirname, '../logs/debug.log');

var utl = module.exports;

utl.shallowClone = function shallowClone(obj) {
  var clone = {};
  Object.keys(obj).forEach(function (k) {
    clone[k] = obj[k];
  });
  return clone;
};

utl.pad = function pad(s, len, padding) {
  len = len || 0;
  padding = padding || ' ';

  return len + 1 >= s.length
    ? s + Array(len + 1 - s.length).join(padding)
    : s;
};

utl.log = function log(obj, depth) {
  var s = util.inspect(obj, false, depth || 5, true);
  fs.appendFileSync(logFile, s);
};
