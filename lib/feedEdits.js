'use strict';

var Stream      =  require('stream').Stream
  , path        =  require('path')
  , fs          =  require('fs')
  , cardinal    =  require('cardinal')
  , watcher     =  require('./watcher')
  , state       =  require('./state')
  , utl         =  require('./utl')
  , log         =  require('./log')
  , rewrite     =  require('./rewrite')
  , requireLike =  require('require-like')
  , vimrli      =  require('./vim-rli')
  ;

module.exports = function feedEdits(stdin, stdout, root, opts, createRepl) {
  var repl, rli;
  if (!createRepl) {
    createRepl = opts;
    opts = undefined;
  }

  opts = opts || {};
  opts.fileFilter      =  opts.fileFilter      || '*.js';
  opts.directoryFilter =  opts.directoryFilter || [ '!.*', '!node_modules' ];
  opts.exports         =  opts.exports         || '$';
  opts.root            =  root;

  state.format = opts.format || {
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

  function feedToStdin(file) {

    if (state.fileFeedSuspended) return;

    function adaptGlobals() {
      global.require    =  requireLike(file.fullPath);
      global.__filename =  file.fullPath;
      global.__dirname  =  path.dirname(file.fullPath);
      global.exports    =  global.module.exports;
    }

    function restoreGlobals() {
      global.require = requireLike(path.join(process.cwd(), 'repl.js'));
      delete global.__filename;
      delete global.__dirname;
    }

    function emitHighlightedCode(src, format) {
      if (state.highlight) { 
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

      vimrli.vim && vimrli.vim.forceInsert();
      try {
        // source last in order to have results show last
        stdin.emit('data', rewritten);
      } catch(e) { } 

      rli.history = currentHist;
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
        
        state.lastFedFile = file;
        global[opts.exports] = global.module.exports;

      } finally {
        restoreGlobals();
        repl.displayPrompt();
        state.feedingFile = false;
      }
    });
  }

  function reportWatchedFiles(watchers) {
    stdout.write('Watching [' + Object.keys(watchers).length + ' files].\n');
    repl && repl.displayPrompt();
  }

  var watcherInitialized; 
  watcher.watchTree(
      opts
    , function onAddedWatch(info) {
        try {
          stdout.write('Started watching: ' + info.entry.path + '\n');

          // log total every time a new file is added after watcher was initialized and source it
          if (watcherInitialized) { 
            reportWatchedFiles(info.all);
            feedToStdin(info.entry);
          }
        } catch(e) {
          console.trace();
          log.error(e);
        }
      }
    , function onChanged(file) { 
        feedToStdin(file); 
      }
    , function onWatcherInitialized(watchers) {
        watcherInitialized = true;
        reportWatchedFiles(watchers);
        repl = createRepl(stdin);
        rli = repl.rli;
      }
  );
};
