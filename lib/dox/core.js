var Module    =  require('module')
  , repl      =  require('repl')
  , coreDox   =  require('./core-dox')
  , builtins  =  repl._builtinLibs
  ;

var real_load = Module._load;
Module._load = function(request, parent, isMain) {
  var module = real_load.apply(this, arguments);
  attachDox(request, module);
  return module;
};

function attachDox(request, module) {
  if (builtins.indexOf(request) < 0 ) return;

  Object.keys(module)
    .filter(function (k) {
      return typeof module[k] === 'function' 
          && typeof module[k].dox === 'undefined';
    })
    .forEach(function (k) {
      module[k].dox = function () { coreDox.print(request, k); };
    });
}

module.exports = function core(repl, alreadyLoaded) {
  coreDox.init(repl);

  alreadyLoaded.push({ request: 'repl', module: repl });
  alreadyLoaded.forEach(function (x) {
    attachDox(x.request, x.module);
  });
};
