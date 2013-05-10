'use strict';

var fs           =  require('fs')
  , format       =  require('util').format
  , cardinal     =  require('cardinal')
  , hermit       =  require('hermit')
  , colors       =  require('ansicolors')
  , styles       =  require('ansistyles')
  , anchorHeader =  require('anchor-markdown-header')
  , log          =  require('../log')
  , coreRetrieve =  require('./core-retrieve')
  , rootUrl      =  format('http://nodejs.org/docs/%s/api', process.version)
  , repl 
  ;

function getUrls(mod) {
  return {
      json: format('%s/%s.json', rootUrl, mod)
    , html: format('%s/%s.html', rootUrl, mod)
  };
}

function getModule(json, moduleName) {
  var matches = json.modules.filter(function (x) {
    return x.type === 'module' && x.name === moduleName;
  });
  return matches.length ? matches[0] : null;
}

function getMethod(mdl, methodName) {
  var matches = mdl.methods.filter(function (x) {
    return x.type === 'method' && x.name === methodName;
  }) ;
  return matches.length ? matches[0] : null;
}

function get(json, moduleName, methodName) {
  var mod = getModule(json, moduleName);
  return mod ? getMethod(mod, methodName) : null;
}

function anchorStyle(url) {
  return styles.underline(colors.blue(url));
}

function printDoc(json, mdl, methodName, mdlUrl) {
  var present = ['']
    , methodSignature;

  var method = get(json, mdl, methodName);
  if (!method) { 
    console.log('\n\nSorry, no docs found.\n');
    console.log('URL: %s\n', anchorStyle(mdlUrl));
    return repl.displayPrompt();
  }

  present.push(styles.underline('\n' + method.name + '\n'));

  try {
    methodSignature = cardinal.highlight(method.textRaw);
  } catch (e) {
    methodSignature = method.textRaw;
  }
  present.push(colors.bgBlack(methodSignature));

  console.log(method);
  var anchoredHeader = anchorHeader(method.textRaw, 'nodejs.org', 0, mdl)  
    // i.e. remove [fs.read(..)] and enclosing () from [fs.read(..)](#fs_fs_read...)
    , relUrl = anchoredHeader.slice(method.textRaw.length + 3, -1)
    , link = mdlUrl + relUrl
    , anchor = anchorStyle(link);

  hermit(method.desc, function (err, res) {
    present.push(res);
    present.push('URL: ' + anchor + '\n');

    console.log(present.join('\n'));
    repl.displayPrompt();
  });
}

function print(mdl, methodName) {
  if (!repl) return;

  var urls = getUrls(mdl);
  coreRetrieve(urls.json, mdl, function (err, doc) {
    if (err) return log.error(err);
    printDoc(doc, mdl, methodName, urls.html);
  });
}

function init(repl_) {
  repl = repl_;
}

module.exports = {
    print: print
  , init: init
};
