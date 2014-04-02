'use strict';
var fs        =  require('fs')
  , path      =  require('path')
  , os        =  require('os')

var log          =  require('../../log')
  , openReadme   =  require('./open-readme')
  , getPackinfo  =  require('./get-packinfo')
  , divider      =  require('./divider')
  , readReadme   =  require('./read-readme')
  , renderReadme =  require('./render-readme');

// backwards compat with node 0.8
var tmpdir = typeof os.tmpdir === 'function' ? os.tmpdir : os.tmpDir;

function getTmpFile (name) {
  return path.join(tmpdir(), name + '.html');
}

/**
 * Attempts to find and render and/or the readme in a browser for a module whose '.dox()' function is invoked.
 * Since the user will wait for the printout, there is no need to do anything async here, therefore
 * existsSync and readSync are used.
 *
 * If the readme cannot be rendered, its text is returned as is.
 * If the readme is not found, a string containing that information is returned
 * 
 * @name exports
 * @function
 * @param mdl 
 * @param name 
 * @param packagedir {String} full path to the root path of the package (where the readme is expected to be)
 */
var go = module.exports = function (mdl, name, packagedir) {

  mdl.dox = function () {

    var packinfo       =  getPackinfo(packagedir);
    var readmeSrc      =  packinfo.readme || readReadme(packagedir, packinfo.readmeFilename);
    var renderedReadme =  renderReadme(name, packagedir, readmeSrc);
    var tmpFile        =  getTmpFile(name);
    
    openReadme(name, packinfo, tmpFile, readmeSrc);
    
    return { __replpad_print_raw__: renderedReadme + packinfo.rendered };
  }
};
