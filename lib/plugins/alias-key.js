// Not used, but may come handy

'use strict';
var log = require('../log')
  , keycodes = require('../keycodes');

function makeKey(name, mod) {
  mod = mod || 'nomod';
  return  { 
      name     :  name
    , ctrl     :  ~mod.indexOf('ctrl')
    , meta     :  ~mod.indexOf('meta')
    , shift    :  ~mod.indexOf('shift')
    , sequence :  keycodes[mod][name]
  };
}

module.exports = function createAliases(repl, aliases) {
  var stdin = repl.inputStream;

  function aliasKey(alias, orig) {
    var aliasParts =  alias.split('-')
      , aliasMod   =  aliasParts[0].toLowerCase()
      , aliasName  =  aliasParts[1].toLowerCase()
      , aliasKeycode = keycodes[aliasMod][aliasName]

      , origParts  =  orig.split('-')
      , origMod    =  origParts[0].toLowerCase()
      , origName   =  origParts[1].toLowerCase()
      , origKeycode = keycodes[origMod][origName]
      ;

    stdin.on('keypress', function (code, key) {
      if (code && code === aliasKeycode) {
        stdin.emit('keypress', origKeycode, makeKey(origName, origMod));
      }
    });
  }
};
