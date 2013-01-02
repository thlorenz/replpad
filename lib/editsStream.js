var Stream =  require('stream').Stream
  , watch  =  require('watch')
  , es = require('event-stream')
  , path   =  require('path')
  , fs = require('fs')
  ;

module.exports = createEditsStream;

function replify() {
  return es.mapSync(
    function (data) { 
      return data; 
  });
}
  
function createEditsStream(root, opts) {
  var feed = new Stream();
  feed.readable = true;

  opts = opts || {
    ignoreDotFiles: true,
    filter: function (f) { return path.extname(f) === '.js'; }
  };

  watch.createMonitor(root, opts, function (monitor) {
    monitor.on('changed', function (file, current, previous) {
      fs.createReadStream(file)
        //.pipe(replify)
        .pipe(feed);
    });    
  });
  var foo = path.join(__dirname, '../test/fixtures/foo.js');

  return fs.createReadStream(foo, { encoding: 'utf8' }).pipe(replify());
}
