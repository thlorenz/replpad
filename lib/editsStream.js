var Stream =  require('stream').Stream
  , watch  =  require('watch')
  , es     =  require('event-stream')
  , path   =  require('path')
  , fs     =  require('fs')
  ;

module.exports = createEditsStream;

function replify() {
  return es.mapSync(
    function (data) { 
      return data; 
  });
}
  
function createEditsStream(root, opts) {
  stdin = process.stdin;
  opts = opts || {
    ignoreDotFiles: true,
    filter: function (f) { 
      console.log(path.extname(f));
      return false;// || path.extname(f) === '.js'; 
    }
  };

  watch.createMonitor(root, opts, function (monitor) {
    monitor.on('changed', function (file, current, previous) {
      feedToStdin(file);
    });    
  });

  function feedToStdin(file) {
    var fileStream = fs.createReadStream(file, { encoding: 'utf8' });
    fileStream.pause();
    fileStream.on('data', function (data) {
      stdin.emit('data', data);
    });
    fileStream.on('end', function () {
      stdin.emit('end');
    });
    fileStream.resume();
  }
  //setInterval(function () { feedToStdin(__dirname + '/../test/fixtures/foo.js'); }, 3000);
  
  return stdin;
}
