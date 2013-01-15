'use strict';

var fs = require('fs')
  , cardinal = require('cardinal')
  , hermit = require('hermit')
  , colors = require('ansicolors')
  , styles = require('ansistyles')
  ;

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

function printDoc(json, mod, methodName) {
  var present = [];
  var method = get(json, mod, methodName);
  if (!method) return console.log('no docs found');

  present.push(styles.underline('\n' + method.name + '\n'));
  present.push(colors.bgBlack(cardinal.highlight(method.textRaw)));

  hermit(method.desc, function (err, res) {
    present.push(res);
    console.log(present.join('\n'));
  });
}

module.exports = function printCore(mod, methodName) {
  var json = require('../../test/fixtures/fs.json');
  printDoc(json, mod, methodName);
};
