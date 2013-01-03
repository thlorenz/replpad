var Stream  =  require('stream').Stream
  , path    =  require('path')
  , fs      =  require('fs')
  , watcher =  require('./watcher')
  , rewrite =  require('./rewrite')
  ;

module.exports = function feedEdits(stdin, root, opts, done) {
  if (!done) {
    done = opts;
    opts = undefined;
  }

  opts = opts || {
      fileFilter: '*.js'
    , directoryFilter: [ '!.*', '!node_modules' ]
  };
  opts.root = root;

  opts.format = opts.format || {
      indent      :  { style: '  ', base: 0 }
    , quotes      :  'single'
    , json        :  false
    , renumber    :  false
    , hexadecimal :  false
    , escapeless  :  false
    , compact     :  false
    , parentheses :  true
    , semicolons  :  true
  };

  function feedToStdin(file) {
    fs.readFile(file, 'utf-8', function (err, src) {
      if (err) return console.error(err);
      try {
        src = rewrite(src, opts.format );
      } catch (e) {
        console.error('Unable to parse source from: ' + file + '\n' + e);
      }
      stdin.emit('data', src);
    });
  }

  watcher.watchTree(
      opts
    , function onChanged(file) { 
        feedToStdin(file); 
      }
    , function onWatching() {
        done(stdin);
      }
  );
};
