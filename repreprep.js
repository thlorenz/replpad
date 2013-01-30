'use strict';
/*jshint asi:true */

var repl            =  require('repl')
  , cardinal        =  require('cardinal')
  , util            =  require('util')
  , state           =  require('./state')
  , config          =  require('../config/current')
  , feedEdits       =  require('./feedEdits')
  , core            =  require('./dox/core')
  , log             =  require('./log')
  , instructions    =  require('./instructions')
  , plugClearScreen =  require('./plugins/clear-screen')
  , plugExit        =  require('./plugins/exit')
  , plugAppend      =  require('./plugins/append')
  , plugCommands    =  require('./plugins/commands')
  , plugSrc         =  require('./plugins/src')
  , initConfig      =  require('../config/init')
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
      })
  log.repl = r;

  // fs gets loaded by repl automatically
  core(r, [ { request: 'fs', module: require('fs') }]);

  plugClearScreen(r);
  plugExit(r);
  plugAppend(r);
  plugCommands(r);
  plugSrc(r);

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
  }

  // Fire and forget (we just need to make sure it gets configured)
  return r;
}

module.exports = function repreprep(root) {

  initConfig(function (applyConfig) {
    function boot(stdin) {
      instructions();
      var r = createRepl(stdin);

      // finish initializing the config
      applyConfig(r);

      // return repl here since feedEdits needs it
      return r;
    }

    if (!root) { 
      log.print('Watching no files since no path was specified.');
      return boot(stdin);
    }

    feedEdits(stdin, stdout, root, boot);
  });
};
