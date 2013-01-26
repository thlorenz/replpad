'use strict';

var resolve =  require('./resolve')
  , log     =  require('../lib/log')
  , vimrli  =  require('../lib/vim-rli')
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

module.exports = function (cb) {
  /*
   * A bit messy, but works as follows:
   *  1. resolve the config
   *  2. tell repreprep that we have it
   *  3. repreprep creates repl and calls apply config, passing the created repl
   *      - at this point the vimrli has also been initialized
   *  4. we finish by applying the config
   */
  resolve(function (config) {
    initializeCurrent(config);

    function applyConfig(repl) {
      var vim = vimrli.vim;
      if (config.map) {
        if (typeof config.map !== 'function')
          log.errorln('Found "map" in config, but it is a [%s]. It needs to be a function (ignoring for now).', typeof config.map);
        else 
          config.map(vim.map.normal, vim.map.insert);
      }
    }

    cb(applyConfig);
  });
};
