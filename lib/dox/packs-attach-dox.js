'use strict';
var msee      =  require('msee')
  , os        =  require('os')
  , fs        =  require('fs')
  , opener    =  require('opener')
  , path      =  require('path')
  , colors    =  require('ansicolors')
  , gfm       =  require('github-flavored-markdown')
  , connected =  require('hasinternet');

var log    =  require('../log')
  , config =  require('../../config/current');

var readmeConf = config.readme 
  , cssPath = path.join(__dirname, 'gfm.css')
  , cssLink = '<link rel="stylesheet" href="' + cssPath + '" type="text/css" media="screen" charset="utf-8">\n';

function title (name) {
  return '<title>' + name + '</title>\n';
}

function divider (x) { 
  return '\n' + colors.bgMagenta(colors.brightYellow('-- ' + x + ' --')) + '\n';
}

function getTmpFile (name) {
  return path.join(os.tmpdir(), name + '.html');
}

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

function readReadme (packagedir) {
  var readmePath = getReadmePath(packagedir);
  return readmePath ? fs.readFileSync(readmePath, 'utf8') : null;
}

// returns a rendered version of the readme that can be printed to the repl
function renderReadme (name, packagedir, src) {
  if (!readmeConf.render) return '';

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

/**
 * Gets the package info from the package.json of the package dir, including the rendered version.
 * 
 * @name getPackInfo
 * @function
 * @param packagedir {String} dir where package.json is found
 * @return {Object} with homepage and/or github repo urls and a rendered version of the two
 */
function getPackInfo (packagedir) {
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
  } catch (e) {
    info.rendered = 'No homepage or github repository url found for this package.';
  }
  info.rendered = divider('URLS') + info.rendered;
  return info;
}

// write readme to tmp file and print it to the repl to allow user to manually open it
// automatically opens the readme if the readme.open flag is set
function writeNopenReadme (name, tmpFile, src) {
  var html;
  try {
    html = gfm.parse(src);
  } catch (e) {
    log.sillyln(e);
    log.warnln('Unable to parse readme for ' + name);
  }

  html = title(name) + cssLink + html;

  fs.writeFile(tmpFile, html, 'utf8', function (err) {
    if (err) {
      log.sillyln(err);
      log.warnln('Unable to write rendered readme html, please ensure access to ' + os.tmpdir());
      return;
    }
    log.println('Rendered:\tfile://' + tmpFile);
    if (readmeConf.open) opener(tmpFile);
  });

  return tmpFile;
}

// writes local readme if we are not online or no url was given in the package
// automatically opens either the local readme or the url if the readme.open flag is set
function openReadme (name, packinfo, tmpFile, src) {
  function tryNopenLocal () {
    return src ? writeNopenReadme(name, tmpFile, src) : log.warnln('Unable to write/hopen local or remote readme for ' + name);
  }

  var url = packinfo.homepage || packinfo.url;
  if (!url) return tryNopenLocal();

  // determine if we need to create a local readme in order to either open it or print path for user to click on
  connected(function (err, isconnected) {
    // TODO: also test that either url actually exists and if not render locally as well
    if (!isconnected) return tryNopenLocal();
    if (readmeConf.open) opener(url);
  });
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

    var readmeSrc      =  readReadme(packagedir);
    var renderedReadme =  renderReadme(name, packagedir, readmeSrc);
    var packInfo       =  getPackInfo(packagedir);
    var tmpFile        =  getTmpFile(name);
    
    openReadme(name, packInfo, tmpFile, readmeSrc);
    
    return { __replpad_print_raw__: renderedReadme + packInfo.rendered };
  }
};
