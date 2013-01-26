'use strict';
/*jshint asi:true */

var repl            =  require('repl')
  , cardinal        =  require('cardinal')
  , util            =  require('util')
  , state           =  require('./state')
  , feedEdits       =  require('./feedEdits')
  , core            =  require('./dox/core')
  , log             =  require('./log')
  , vimrli          =  require('./vim-rli')
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

function inspect(obj, depth) {
  console.log(require('util').inspect(obj, false, depth || 5, true));
}

function createRepl(stdin) {
  var prompt = 'pad > ';

  var r = repl.start({
        prompt          :  prompt 
      , input           :  stdin 
      , output          :  stdout
      , ignoreUndefined :  true
      , useColors       :  true
      , useGlobal       :  true
      })
  log.repl = r;

  // fs gets loaded by repl automatically
  core(r, [ { request: 'fs', module: require('fs') }]);
  
  vimrli(r);

  plugClearScreen(r);
  plugExit(r);
  plugAppend(r);
  plugCommands(r);
  plugSrc(r);

  r.state = state;
  global.$repl = r;

  function writer(s) { 
    return util.inspect(s, state.inspect.showHidden, state.inspect.depth, true);
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
