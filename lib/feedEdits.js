'use strict';

var Stream      =  require('stream').Stream
  , path        =  require('path')
  , fs          =  require('fs')
  , cardinal    =  require('cardinal')
  , watcher     =  require('./watcher')
  , state       =  require('./state')
  , utl         =  require('./utl')
  , rewrite     =  require('./rewrite')
  , requireLike =  require('require-like')
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
    , compact     :  false
    , parentheses :  false
    , semicolons  :  false
  };

  function feedToStdin(file) {
    var currentHist, format;

    if (state.fileFeedSuspended) return;

    fs.readFile(file.fullPath, 'utf-8', function (err, src) {
      var rewritten;
      if (err) return console.error(err);
      repl.displayPrompt();
      
      try {
        format = utl.shallowClone(state.format);

        // no sense in sourcing entire code if we print it highlighted afterwards
        if (state.highlight) format.compact = true;
        rewritten = rewrite(src, format);
      } catch (e) {
        console.error('Unable to parse source from: ' + file.path + '\n' + e);
      }
      try {
        global.require = requireLike(file.fullPath);
        global.__filename = file.fullPath;
        global.__dirname = path.dirname(file.fullPath);
        
        // ensure emitted lines don't become part of the history
        currentHist = rli.history.slice(0);

        // Avoid code being appended to garbage
        rli.clearLine();
        try {
          try {
            if (state.highlight) stdout.write(cardinal.highlight(src, { linenos: true }) + '\n');
          } catch(e) { }
          // source last in order to have results show last
          stdin.emit('data', rewritten);
        } catch(e) {
        } 
        rli.history = currentHist;

        state.lastFedFile = file;

        global[opts.exports] = global.module.exports;
      } finally {
        global.require = requireLike(path.join(process.cwd(), 'repl.js'));
        delete global.__filename;
        delete global.__dirname;
        repl.displayPrompt();
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
          console.error(e);
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
