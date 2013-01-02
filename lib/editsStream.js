var Stream =  require('stream').Stream
  , watch  =  require('watch')
  , path   =  require('path')
  , fs     =  require('fs')
  ;

module.exports = createEditsStream;

function createEditsStream(root, opts) {
  stdin = process.stdin;
  opts = opts || {
    ignoreDotFiles: true,
    filter: function (f) { 
      // filter is exclusive
      return path.extname(f) !== '.js'; 
    }
  };

  watch.createMonitor(root, opts, function (monitor) {
    monitor.on('changed', function (file, current, previous) {
      feedToStdin(file);
    });    
  });

  function feedToStdin(file) {
    fs.readFile(file, 'utf-8', function (err, src) {
      if (err) return console.error(err);
      stdin.emit('data', src);
    });
  }
  return stdin;
}
