'use strict';
var msee = require('msee');
var fs = require('fs');
var path = require('path');
var colors = require('ansicolors');

var divider = '\n' + colors.bgMagenta(colors.brightYellow('-- README --')) + '\n';

function pair (names, exts) {
  return names.reduce(function (acc, name) {
    return acc.concat(exts.map(function (ext) { return name + ext; }));
  }, []);
}

function getReadmePath (packagedir) {
  var tries = pair([ 'readme', 'README', 'Readme', 'ReadMe' ], [ '.md', '.markdown', '.MARKDOWN', '.MD' ]);
  var match;
  tries.some(function (x) {
    var p = path.join(packagedir, x);
    if (fs.existsSync(p)) return match = p, match;
  });

  return match;
}

/**
 * Attempts to find and render the readme for a module whose '.dox()' function is invoked.
 * Since the user will wait for the printout, there is no need to do anything async here, therefore
 * existsSync and readSync are used.
 *
 * If the readme cannot be rendered, its text is returned as is.
 * If the readme is not found, a string containing that informatin is returned
 * 
 * @name exports
 * @function
 * @param name {String} Name of the package
 * @param packagedir {String} full path to the root path of the package (where the readme is expected to be)
 * @return {Object} with raw rendered readme or as is or warning that it wasn't foune
 */

function renderReadme (name, packagedir) {
  var md = 'Sorry, but no readme was found for ' + name + ' in ' + packagedir;
  var readmePath = getReadmePath(packagedir);
  
  if (readmePath) { 
    var readme = fs.readFileSync(readmePath, 'utf8');
    try {
      md = msee.parse(readme);
    } catch (e) {
      md = readme;
    }
  }
  return { __replpad_print_raw__: divider + md };
}

var go = module.exports = function (mdl, name, packagedir) {
  mdl.__defineGetter__('dox', renderReadme.bind(null, name, packagedir));
};

// Test
if (!module.parent) {
  var packagedir = path.dirname(require.resolve('cardinal'));

  go({}, 'replpad', packagedir)
  
}
