'use strict';

var repl            =  require('repl')
  , path            =  require('path')
  , cardinal        =  require('cardinal')
  , util            =  require('util')
  , state           =  require('./lib/state')
  , config          =  require('./config/current')
  , initConfig      =  require('./config/init')
  , managePlugins   =  require('./lib/manage-plugins')
  , initWatcher     =  require('./lib/watcher-init')
  , feedEdits       =  require('./lib/feedEdits')
  , core            =  require('./lib/dox/core')
  , log             =  require('./lib/log')
  , instructions    =  require('./lib/instructions')
  , initBuiltins    =  require('./lib/builtins/init')
  , findexquire     =  require('./lib/findexquire')
  , stdin           =  process.stdin
  , stdout          =  process.stdout
  ;
function createRepl(stdin) {
  var r = repl.start({
        prompt          :  config.prompt || 'pad > '
      , input           :  stdin
      , output          :  stdout
      , ignoreUndefined :  true
      , useColors       :  true
      , useGlobal       :  true
      });
  log.repl = r;

  r.state = state;
  r.config = config;

  global.$repl = r;
  global.require = findexquire(path.join(process.cwd(), 'repl.js'), true);

  r.writer = function (s) {
    // i.e. Function.src returns the higlighted string at __replpad_print_raw__ which we just want to print as is
    var printRaw = s && s.__replpad_print_raw__;
    return printRaw || util.inspect(s, config.inspect.showHidden, config.inspect.depth, true);
  };

  return r;
}

function boot(stdin) {
  instructions();

  var repl = createRepl(stdin);
  state.__defineGetter__('repl', function () { return repl; });

  managePlugins();
  initBuiltins();

  // this step needs to happen last otherwise the `dox` getters are invoked prematurely and all core functions output
  core(repl);
}


module.exports = function repreprep(root) {

  initConfig();

  if (!root) {
    log.print('Watching no files since no path was specified.');
    return boot(stdin);
  }

  var watcher = initWatcher(root);
  watcher.on('initialized', function () {
    boot(stdin);
    var feedEdit = feedEdits(stdin, stdout);
    watcher.on('file-changed', feedEdit);

  });
};
