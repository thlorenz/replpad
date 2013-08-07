var Module   =  require('module')
  , repl     =  require('repl')
  , print    =  require('./print')
  , builtins =  repl._builtinLibs
  ;

function attachDox(request, module) {
  if (builtins.indexOf(request) < 0 ) return;

  Object.keys(module)
    .filter(function (k) {
      return typeof module[k] === 'function' 
          && typeof module[k].dox === 'undefined';
    })
    .forEach(function (k) {
      module[k].dox = function () { print(request, k); };
    });
}

module.exports = function core(repl) {
  var real_load = Module._load;
  Module._load = function(request, parent, isMain) {
    var module = real_load.apply(this, arguments);
    attachDox(request, module);
    return module;
  };
};
