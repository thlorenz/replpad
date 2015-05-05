'use strict';

var path       =  require('path')
  , os         =  require('os')
  , home       =  process.env.HOME || process.env.USERPROFILE
  , root       =  home && path.join(home, '.config', 'replpad')
  , cachesRoot =  path.join(root || os.tmpdir(), 'cache')
  , caches     =  path.join(cachesRoot, process.version)
  ;

module.exports = {
    root       :  root
  , caches     :  caches
  , configFile :  root && path.join(root, 'config.js')
};
