var Stream =  require('stream').Stream
  , watch  =  require('watch')
  , path   =  require('path')
  , fs     =  require('fs')
  , rewrite = require('./rewrite')
  ;

function createEditsStream(root, stdin, opts) {
  opts = opts || {
    ignoreDotFiles: true,
    filter: function (f) { 
      // filter is exclusive
      return path.extname(f) !== '.js'; 
    }
  };
  opts.format = opts.format || {
      indent      :  { style: '  ', base: 0 }
    , quotes      :  'single'
    , json        :  false
    , renumber    :  false
    , hexadecimal :  false
    , quotes      :  'single'
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
      stdin.emit('data', src)
    });
  }

  watch.createMonitor(root, opts, function (monitor) {
    monitor.on('changed', function (file, current, previous) {
      feedToStdin(file);
    });    
  });

  return stdin;
}

module.exports = createEditsStream;
