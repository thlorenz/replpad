'use strict';

var msee = require('msee')
  , divider = require('./divider')
  , config =  require('../../../config/current');

/**
 * Renders the markdown of the readme of a package, including syntax highlighting, so it can be printed to the repl.
 *
 * @function
 * @param name {String} name of the package
 * @param packagedir {String} package path
 * @param src {String} the markdown to render
 * @return {String} rendered readme (including terminal escape codes)
 */
module.exports = function (name, packagedir, src) {
  if (!config.readme.render) return '';

  var md = 'Sorry, but no readme was found for ' + name + ' in ' + packagedir;

  if (src) {
    try {
      md = msee.parse(src);
    } catch (e) {
      md = src;
    }
  }
  return divider('README') + md;
}

