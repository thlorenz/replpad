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
