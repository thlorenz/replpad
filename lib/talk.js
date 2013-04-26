'use strict';

var scriptieTalkie =  require('scriptie-talkie')
  , log            =  require('../lib/log')
  , config         =  require('../config/current');

module.exports = function (code, file) {
  if (!(config.scriptietalkie && config.scriptietalkie.active)) return;

  scriptieTalkie(
      code
    , file
    , { writeln: log.print.bind(log), diff: config.scriptietalkie }
  );
};
