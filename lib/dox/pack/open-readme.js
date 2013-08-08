'use strict';

var fs        =  require('fs')
  , path      =  require('path')
  , opener    =  require('opener')
  , marked    =  require('marked').setOptions({ gfm: true, breaks: true, tables: true })
  , connected =  require('hasinternet');

var log    =  require('../../log')
  , config =  require('../../../config/current');

var cssPath = path.join(__dirname, 'gfm.css')
  , cssLink = '<link rel="stylesheet" href="' + cssPath + '" type="text/css" media="screen" charset="utf-8">\n';

function title (name) {
  return '<title>' + name + '</title>\n';
}

// write readme to tmp file and print it to the repl to allow user to manually open it
// automatically opens the readme if the readme.open flag is set
function writeNopenReadme (name, tmpFile, src) {
  var html;
  try {
    html = marked(src);
  } catch (e) {
    log.sillyln(e);
    log.warnln('Unable to parse readme for ' + name);
  }

  html = title(name) + cssLink + html;

  fs.writeFile(tmpFile, html, 'utf8', function (err) {
    if (err) {
      log.sillyln(err);
      log.warnln('Unable to write rendered readme html, please ensure access to ' + path.dirname(tmpFile));
      return;
    }
    log.println('Rendered:\tfile://' + tmpFile);
    if (config.readme.open) opener(tmpFile);
  });

  return tmpFile;
}

/**
 * Prints urls where readme for package resides online.
 * Writes local readme if we are not online or no url was given in the package.
 * Automatically opens either the local readme or the url if the readme.open flag is set
 *
 * @function
 * @param name {String} module name
 * @param packinfo {Object} url info from packags.jsoin
 * @param tmpFile {String} path to tmp file at which local readme should be stored if needed.
 * @param src {String} the markdown content of the readme
 * @return {void}
 */
module.exports = function (name, packinfo, tmpFile, src) {
  function tryNopenLocal () {
    return src ? writeNopenReadme(name, tmpFile, src) : log.warnln('Unable to write/open local or remote readme for ' + name);
  }
  
  var url = packinfo.homepage || packinfo.url;
  if (!url) return tryNopenLocal();

  // determine if we need to create a local readme in order to either open it or print path for user to click on
  connected(function (err, isconnected) {
    // NiceToHave: also test that either url actually exists and if not render locally as well
    if (!isconnected) return tryNopenLocal();
    if (config.readme.open) opener(url);
  });
}
