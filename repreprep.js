'use strict';

var repl            =  require('repl')
  , path            =  require('path')
  , cardinal        =  require('cardinal')
  , util            =  require('util')
  , xtend           =  require('xtend')
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
function createRepl(opts) {
  var r = repl.start(opts);
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

function boot(opts) {
  instructions(opts.output);

  var repl = createRepl(opts);
  state.__defineGetter__('repl', function () { return repl; });

  managePlugins();
  initBuiltins();

  core(repl);
  return repl;
}

function getReplOpts (opts) {
  return xtend({
      input           :  stdin
    , output          :  stdout
    , ignoreUndefined :  true
    , useColors       :  true
    , useGlobal       :  true
    , terminal        :  true
  }, opts);
}


module.exports = function repreprep(root, opts) {

  if (typeof root === 'object') {
    opts = root;
    root = null;
  }
  opts = opts || {};

  var replOpts = getReplOpts(opts);
  log.output = replOpts.output;

  initConfig();

  // override prompt with the one given in opts AFTER config was initialized
  config.prompt = opts.prompt || config.prompt || 'pad > ';
  replOpts.prompt = config.prompt;

  if (!root) {
    log.print('Watching no files since no path was specified.');
    return boot(replOpts);
  }

  var watcher = initWatcher(root);
  watcher.on('initialized', function () {
    boot(replOpts);
    var feedEdit = feedEdits(stdin, stdout);
    watcher.on('file-changed', feedEdit);
  });
};
