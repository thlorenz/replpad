'use strict';

var repl            =  require('repl')
  , cardinal        =  require('cardinal')
  , util            =  require('util')
  , state           =  require('./lib/state')
  , config          =  require('./config/current')
  , initConfig      =  require('./config/init')
  , applyConfig     =  require('./config/apply')
  , initWatcher     =  require('./lib/watcher-init')
  , feedEdits       =  require('./lib/feedEdits')
  , core            =  require('./lib/dox/core')
  , log             =  require('./lib/log')
  , instructions    =  require('./lib/instructions')
  , initPlugins     =  require('./lib/plugins/init')
  , stdin           =  process.stdin
  , stdout          =  process.stdout
  ;

function createRepl(stdin) {
  var r = repl.start({
        prompt          :  'pad > '
      , input           :  stdin 
      , output          :  stdout
      , ignoreUndefined :  true
      , useColors       :  true
      , useGlobal       :  true
      });
  log.repl = r;

  // fs gets loaded by repl automatically
  core(r, [ { request: 'fs', module: require('fs') }]);

  r.state = state;
  r.config = config;

  global.$repl = r;

  function writer(s) { 
    return util.inspect(s, config.inspect.showHidden, config.inspect.depth, true);
  }

  r.writer = function (s) { 
    if (typeof s !== 'string') return writer(s);
    if (!/^function /.test(s)) return writer(s);
    try { 
      // make anonymous functions parsable
      s = s.replace(/^function[ ]+\(/, 'function fn(');

      var code = cardinal.highlight(s, { linenos: true });
      r.outputStream.write(code);
      return '';
    } catch (e) {
      return writer(s);
    }
  };

  return r;
}

function boot(stdin) {
  instructions();

  var repl = createRepl(stdin);

  applyConfig(repl);

  initPlugins(repl);
    
  return repl;
}


module.exports = function repreprep(root) {

  initConfig();

  if (!root) { 
    log.print('Watching no files since no path was specified.');
    return boot(stdin);
  }

  var watcher = initWatcher(root);
  watcher.on('initialized', function () {
    var repl = boot(stdin)
      , feedEdit = feedEdits(stdin, stdout, repl);
    watcher.on('file-changed', feedEdit);
  });
};
