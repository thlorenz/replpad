'use strict';

var fs = require('fs')
  , path = require('path');

function pair (names, exts) {
  return names.reduce(function (acc, name) {
    return acc.concat(exts.map(function (ext) { return name + ext; }));
  }, []);
}

function getReadmePath (packagedir, readmeFilename) {
  var tries = pair([ 'README', 'readme', 'Readme', 'ReadMe' ], [ '.md', '.markdown', '.MARKDOWN', '.MD' ]);

  // most likely the readmeFilename is correct
  if (readmeFilename) tries.unshift(readmeFilename);

  var match;
  tries.some(function (x) {
    var p = path.join(packagedir, x);
    if (fs.existsSync(p)) return match = p, match;
  });

  return match;
}

/**
 * Attempts to find the readme in the given package dir, trying different common readme names and returns its content.
 *
 * @function
 * @param packagedir {String} path in which the readme of the package hopefully resides.
 * @param readmeFilename {String} path to readme that was supplied in package.json which we'll try to read first
 * @return {String} readme content (markdown) or null if readme was not found
 */
module.exports = function (packagedir, readmeFilename) {
  var readmePath = getReadmePath(packagedir, readmeFilename);
  return readmePath ? fs.readFileSync(readmePath, 'utf8') : null;
}
