module.exports.shallowClone = function shallowClone(obj) {
  var clone = {};
  Object.keys(obj).forEach(function (k) {
    clone[k] = obj[k];
  });
  return clone;
};

