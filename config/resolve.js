'use strict';

var mkdirp =  require('mkdirp')
  , path   =  require('path')
  , fs     =  require('fs')
  , paths  =  require('./paths')
  , utl    =  require('../lib/utl')
  , log    =  require('../lib/log')
  , colors =  require('ansicolors')
  ;

function loadFrom (p) {
  log.print(colors.yellow('\nLoading replpad config from: %s\n'), p);
  return require(p);
}

module.exports = function () {
  if (!utl.existsSync(paths.configFile)) {

    mkdirp.sync(path.dirname(paths.configFile));

    try {
      utl.copyFileSync(require.resolve('./default-config'), paths.configFile);
      return loadFrom(paths.configFile);
    } catch (err) {
      log.error('Unable to create config file', err);
      log.error('Unable to create config file', err.stack);
      log.infoln('Using default config');
      return require('./default-config');
    }

    log.print(colors.yellow('\nCreated replpad config at: %s\n'), paths.configFile);
  } else {

    // Guard against errors in customized config file
    try {
      return loadFrom(paths.configFile);
    } catch(e) {
      log.error('Sorry, it looks like you have an error in your config file at: ', paths.configFile);
      log.error(e);
      log.infoln('Using default config until the problem is fixed.');
      return require('./default-config');
    }
  }
};
