'use strict';
var msee = require('msee');
var fs = require('fs');
var path = require('path');

function pair (names, exts) {
  return names.reduce(function (acc, name) {
    return acc.concat(exts.map(function (ext) { return name + ext; }));
  }, []);
}

function getReadmePath (packagedir) {
  var tries = pair([ 'readme', 'README', 'Readme', 'ReadMe' ], [ '.md', '.markdown', '.MARKDOWN', '.MD' ]);
  var match;
  tries.some(function (x) {
    if (fs.existsSync(path.join(packagedir))) return match = x, match;
  });

  return match;
}

var go = module.exports = function (mdl, name, packagedir) {

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
  return { __replpad_print_raw__: md };
};

// Test
if (!module.parent) {
  var packagedir = path.dirname(require.resolve('cardinal'));

  go({}, 'replpad', packagedir)
  
}
