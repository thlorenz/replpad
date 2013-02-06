'use strict';

var resolve =  require('./resolve')
  , current =  require('./current')
  ; 

function override(prop, overridee, overrider) {
  var to = overridee[prop]
    , from = overrider[prop];
  if (!from) return;

  Object.keys(from).forEach(function (k) {
    to[k] = from[k];
  });
}

// TODO: combining defaults and user config into current config needs tests
function initializeCurrent(conf) {
  var structs = [ 'feed', 'inspect' ];

  structs.forEach(function (x) { override(x, current, conf); });

  Object.keys(conf)
    .filter(function (k) { return !~structs.indexOf(k); })
    .forEach(function (k) { current[k] = conf[k]; });
}

module.exports = function () {
  var config = resolve();

  initializeCurrent(config);
};
