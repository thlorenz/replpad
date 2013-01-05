var Stream  =  require('stream').Stream
  , path    =  require('path')
  , fs      =  require('fs')
  , watcher =  require('./watcher')
  , state   =  require('./state')
  , rewrite =  require('./rewrite')
  , requireLike = require('require-like')
  ;

module.exports = function feedEdits(stdin, root, opts, createRepl) {
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
    var currentHist;

    if (state.fileFeedSuspended) return;

    fs.readFile(file.fullPath, 'utf-8', function (err, src) {
      if (err) return console.error(err);
      repl.displayPrompt();
      
      try {
        src = rewrite(src, state.format);
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

        stdin.emit('data', src);
        rli.history = currentHist;

        state.lastFedFile = file;

        global[opts.exports] = global.module.exports;
      } finally {
        global.require = requireLike(path.join(process.cwd(), 'repl.js'));
        delete global.__filename;
        delete global.__dirname;
      }
    });
  }

  watcher.watchTree(
      opts
    , function onChanged(file) { 
        feedToStdin(file); 
      }
    , function onWatching() {
        repl = createRepl(stdin);
        rli = repl.rli;
      }
  );
};
