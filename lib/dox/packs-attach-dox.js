'use strict';
var msee      =  require('msee');
var os        =  require('os');
var fs        =  require('fs');
var opener    =  require('opener');
var path      =  require('path');
var colors    =  require('ansicolors');
var gfm       =  require('github-flavored-markdown');
var connected =  require('hasinternet');

var log    =  require('../log');
var config =  require('../../config/current');

var cssPath = path.join(__dirname, 'gfm.css');
var cssLink = '<link rel="stylesheet" href="' + cssPath + '" type="text/css" media="screen" charset="utf-8">\n';

function title (name) {
  return '<title>' + name + '</title>\n';
}

function divider (x) { 
  return '\n' + colors.bgMagenta(colors.brightYellow('-- ' + x + ' --')) + '\n';
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

function renderReadme (name, packagedir, src) {
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

function renderPackInfo (packagedir) {
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

function writeNopenReadme (name, src) {
  var html;
  try {
    html = gfm.parse(src);
  } catch (e) {
    log.sillyln(e);
    log.warnln('Unable to parse readme for ' + name);
  }

  html = title(name) + cssLink + html;

  var tmpFile = path.join(os.tmpdir(), name + '.html');

  fs.writeFile(tmpFile, html, 'utf8', function (err) {
    if (err) {
      log.sillyln(err);
      log.warnln('Unable to write rendered html, please ensure access to ' + os.tmpdir());
      return;
    }
    opener(tmpFile);
  });
}

function openReadme (name, packinfo, src) {
  function tryNopenLocal () {
    return src ? writeNopenReadme(name, src) : log.warnln('Unable to open local or remote readme for ' + name);
  }

  var url = packinfo.homepage || packinfo.url;
  if (!url) tryNopenLocal();

  connected(function (err, isconnected) {
    if (!isconnected) return tryNopenLocal();
    opener(url);
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
  var readmeConf = config.readme || { render: true, open: true };

  mdl.dox = function () {
    var readmeSrc = readReadme(packagedir);
    var renderedReadme = readmeConf.render ? renderReadme(name, packagedir, readmeSrc) : '';
    var packInfo = renderPackInfo(packagedir);
    
    if (readmeConf.open) openReadme(name, packInfo, readmeSrc);
    
    return { __replpad_print_raw__: renderedReadme + packInfo.rendered };
  }
};
