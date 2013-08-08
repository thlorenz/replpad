'use strict';

var path = require('path')
  , divider = require('./divider');

/**
 * Gets the package info from the package.json of the package dir, including the rendered version.
 * 
 * @name getPackInfo
 * @function
 * @param packagedir {String} dir where package.json is found
 * @return {Object} with homepage and/or github repo urls and a rendered version of the two
 */
module.exports = function (packagedir) {
  var pack, info = { rendered: '' };
  try {
    pack = require(path.join(packagedir, 'package.json'));

    if (pack.homepage) {
      info.homepage = pack.homepage;
      info.rendered += 'homepage:\t' + pack.homepage + '\n';
    }
    if (pack.repository && pack.repository.url) {
      var browsableUrl = pack.repository.url
        .replace(/^git\:(\/\/|@)/, 'https://')
        .replace(/\.git$/, '');

      info.url = browsableUrl;
      info.rendered += 'repository:\t' + browsableUrl;
    }
    info.readmeFilename = pack.readmeFilename;
    info.readme = pack.readme;
  } catch (e) {
    info.rendered = 'No homepage or github repository url found for this package.';
  }
  info.rendered = divider('URLS') + info.rendered;
  return info;
}
