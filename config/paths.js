'use strict';

var path       =  require('path')
  , home       =  process.env.HOME || process.env.USERPROFILE
  , root       =  path.join(home, '.config', 'replpad')
  , cachesRoot =  path.join(root, 'cache')
  , caches     =  path.join(cachesRoot, process.version)
  ;

module.exports = {
    root       :  root
  , caches     :  caches
  , configFile :  path.join(root, 'config.js')
};
