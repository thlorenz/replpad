var Module = require('module')
  , repl = require('repl')
  , builtins = repl._builtinLibs;

function attachDox(request, module) {
  if (builtins.indexOf(request) < 0 ) return;
  if (typeof module.dox !== 'undefined') return;

  module.__defineGetter__('dox', function () {
    return 'dox for ' + request;
  });
}

attachDox('repl', repl);

var real_load = Module._load;
Module._load = function(request, parent, isMain) {
  var module = real_load.apply(this, arguments);
  attachDox(request, module);
  return module;
};
