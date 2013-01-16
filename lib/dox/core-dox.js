'use strict';

var fs = require('fs')
  , format  = require('util').format
  , request = require('request')
  , cardinal = require('cardinal')
  , hermit = require('hermit')
  , colors = require('ansicolors')
  , styles = require('ansistyles')
  , log    = require('../log')
  , rootUrl = format('http://nodejs.org/docs/%s/api', process.version)
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

function getMethod(mod, methodName) {
  var matches = mod.methods.filter(function (x) {
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

function printDoc(json, mod, methodName, modUrl) {
  var present = ['']
    , methodSignature;

  var method = get(json, mod, methodName);
  if (!method) { 
    console.log('\n\nSorry, no docs found.\n');
    console.log('URL: %s\n', anchorStyle(modUrl));
    return repl.displayPrompt();
  }

  present.push(styles.underline('\n' + method.name + '\n'));

  try {
    methodSignature = cardinal.highlight(method.textRaw);
  } catch (e) {
    methodSignature = method.textRaw;
  }
  present.push(colors.bgBlack(methodSignature));

  // TODO: find actual code that makes these links
  var cleaned = method.textRaw
        .trim()
        .replace(/[\( .]/g, '_')
        .replace(/[\)\[\],;]/g, '')
    , link = format('%s#%s', modUrl, mod + '_' + cleaned)
    , anchor = anchorStyle(link);

  hermit(method.desc, function (err, res) {
    present.push(res);
    present.push('URL: ' + anchor + '\n');

    console.log(present.join('\n'));
    repl.displayPrompt();
  });
}

function print(mod, methodName) {
  if (!repl) return;

  var urls = getUrls(mod);
  request(urls.json, function (err, res, body) {
    if (err) return log.error(err);
    printDoc(JSON.parse(body), mod, methodName, urls.html);
  });
}

function init(repl_) {
  repl = repl_;
}

module.exports = {
    print: print
  , init: init
};
