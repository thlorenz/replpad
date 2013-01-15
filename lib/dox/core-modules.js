var fs = require('fs')
  , cardinal = require('cardinal')
  , hermit = require('hermit')
  , colors = require('ansicolors')
  , styles = require('ansistyles')
  ;

var moduleName = 'fs';

// TODO: get via async request from: http://nodejs.org/api/fs.json
var json = require('../../test/fixtures/fs.json');

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

function presentDesc(desc, cb) {
  hermit(desc, cb);
}

function printDoc(mod, methodName) {
  var present = [];
  var method = get(json, mod, methodName);
  //var method = get(json, 'fs', 'readFile');

  present.push(styles.underline('\n' + method.name + '\n'));
  present.push(colors.bgBlack(cardinal.highlight(method.textRaw)));
  presentDesc(method.desc, function (err, res) {
    present.push(res);
    console.log(present.join('\n'));
  });
}

var Module = require('module');

function requireCoresAndAttachDox() {
  require('repl')._builtinLibs.forEach(function (k) {
    global.core[k] = require(k);
    global.core[k].__defineGetter__('dox', function () {
      return 'dox for ' + k;
    });
  });
}

Function.prototype.__defineGetter__('src', function () { return this.toString(); });
