var Stream  =  require('stream').Stream
  , path    =  require('path')
  , fs      =  require('fs')
  , watcher =  require('./watcher')
  , rewrite =  require('./rewrite')
  , requireLike = require('require-like')
  ;

module.exports = function feedEdits(stdin, root, opts, createRepl) {
  var repl;
  if (!createRepl) {
    createRepl = opts;
    opts = undefined;
  }

  opts = opts || {};
  opts.fileFilter      =  opts.fileFilter      || '*.js';
  opts.directoryFilter =  opts.directoryFilter || [ '!.*', '!node_modules' ];
  opts.exports         =  opts.exports         || '$';
  opts.root            =  root;

  opts.format = opts.format || {
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
    fs.readFile(file, 'utf-8', function (err, src) {
      if (err) return console.error(err);
      try {
        src = rewrite(file, src, opts.format);
      } catch (e) {
        console.error('Unable to parse source from: ' + file + '\n' + e);
      }
      try {
        global.require = requireLike(file);
        global.__filename = file;
        global.__dirname = path.dirname(file);

        stdin.emit('data', src);
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
      }
  );
};
