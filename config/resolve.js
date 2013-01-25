'use strict';

var mkdirp =  require('mkdirp')
  , path   =  require('path')
  , fs     =  require('fs')
  , paths  =  require('./paths')
  , utl    =  require('../lib/utl')
  , log    =  require('../lib/log')
  ;

module.exports = function (cb) {
  if (!utl.existsSync(paths.configFile)) {

    mkdirp(path.dirname(paths.configFile));
    utl.copyFile(require.resolve('./default-config'), paths.configFile, function (err) {
      if (err) {
        log.error('Unable to create config file', err);
        log.info('Using default config');
        cb(require('./default-config'));
        return;
      }

      log.info('Created replpad config at: ', paths.configFile);
      cb(require(paths.configFile));
    });
  } else {

    // Guard against errors in customized config file
    try {
      log.info('Loading replpad config from: ', paths.configFile);
      cb(require(paths.configFile));
    } catch(e) {
      log.error('Sorry, it looks like you have an error in your config file at: ', paths.configFile);
      log.error(e);
      log.info('Using default config until the problem is fixed.');
      cb(require('./default-config'));
    }
  }
};
