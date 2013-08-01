'use strict';

var path        =  require('path')
  , fs          =  require('fs')
  , cardinal    =  require('cardinal')
  , state       =  require('./state')
  , utl         =  require('./utl')
  , log         =  require('./log')
  , rewrite     =  require('./rewrite')
  , wire        =  require('./wire')
  , requireLike =  require('require-like')
  , talk        =  require('./talk')
  , config      =  require('../config/current')
  , findexquire =  require('./findexquire')
  ;

module.exports = function feedEdits(stdin, stdout) {
  var repl       =  state.repl
    , rli        =  repl.rli
    , feed       =  config.feed
    , exportsKey =  config.feed.exports || '$';

  state.format = feed.format || {
      indent      :  { style: '  ', base: 0 }
    , quotes      :  'single'
    , json        :  false
    , renumber    :  false
    , hexadecimal :  false
    , escapeless  :  false
    , compact     :  true
    , parentheses :  false
    , semicolons  :  false
  };

  function feedEdit(file) {

    if (state.fileFeedSuspended) return;

    function adaptGlobals() {
      global.require    =  findexquire(file.fullPath, true);
      global.__filename =  file.fullPath;
      global.__dirname  =  path.dirname(file.fullPath);
      global.exports    =  global.module.exports;
    }

    function restoreGlobals() {
      global.require = findexquire(path.join(process.cwd(), 'repl.js'), true);
    }

    function emitHighlightedCode(src, format) {
      if (config.highlight) {
        // force 'compact' since there is no point in sourcing entire code if we printed it highlighted already
        format.compact = true;
        try {
          stdout.write(cardinal.highlight(src, { linenos: true }) + '\n');
        } catch(e) { }
      }
    }

    function rewriteCode(src, format) {
      try {
        return rewrite(src, format);
      } catch (e) {
        stdout.write('\n');
        log.error('Unable to parse source from: ' + file.path + '\n' + e);
        return null;
      }
    }

    function emitCode(rewritten) {
      // ensure emitted lines don't become part of the history
      var currentHist = rli.history.slice(0);

      wire.emit('emit-code.start');

      try {
        // source last in order to have results show last
        stdin.emit('data', rewritten);
      } catch(e) { }

      wire.emit('emit-code.finish');
      rli.history = currentHist;
    }

    function talkCode(code) {
      talk(code, file);
    }

    fs.readFile(file.fullPath, 'utf-8', function (err, src) {
      var format, rewritten;

      if (err) return log.error(err);

      // Avoid code being appended to garbage
      rli.clearLine();

      format = utl.shallowClone(state.format);

      state.feedingFile = true;
      emitHighlightedCode(src, format);

      rewritten = rewriteCode(src, format);

      if (!rewritten) return repl.displayPrompt();

      try {
        adaptGlobals();

        emitCode(rewritten);
        log.displayPrompt();

        // talking after emitting causes error inside difflet in cases so for now we talk first
        talkCode(src);
        log.displayPrompt();

        state.lastFedFile = file;
        global[exportsKey] = global.module.exports;

      } finally {
        restoreGlobals();
        repl.displayPrompt();
        state.feedingFile = false;
      }
    });
  }

  return feedEdit;
};
