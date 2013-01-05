'use strict';
/*jshint asi:true */

var repl            =  require('repl')
  , cardinal = require('cardinal')
  , feedEdits       =  require('./feedEdits')
  , plugClearScreen =  require('./plugins/clear-screen')
  , plugExit        =  require('./plugins/exit')
  //, plugAppend        =  require('./plugins/append')
  ;

function inspect(obj, depth) {
  console.log(require('util').inspect(obj, false, depth || 5, true));
}

module.exports = function createRepl(root) {
  feedEdits(process.stdin, root, function (stdin) {
    var stdout = process.stdout
      , prompt = 'pad > ';

    var r = repl.start({
        prompt          :  'pad > '
      , input           :  stdin 
      , output          :  process.stdout
      , ignoreUndefined :  true
      , useColors       :  true
      , useGlobal       :  true
    });
    
    plugClearScreen(r);
    plugExit(r);
   // plugAppend(r);

    global.$repl = r;

    var writer = r.writer;
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
    return r;
  });
};
