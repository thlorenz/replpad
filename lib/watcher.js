'use strict';
var fs          =  require('fs')
  , path        =  require('path')
  , readdirp = require('readdirp')
  , minDuration =  1000
  , watchers    =  {}
  ;

function watchFile(file, eventName, update) {
  var fullPath = path.resolve(file); 

  if (watchers[fullPath]) return;
  
  watchers[fullPath] = new Date();

  fs.watch(fullPath, { persistent: true }, function (event) {
    if (event !== eventName) return;

    // Avoid duplicate fires in cases when two change events are raised for one actual change
    var now = new Date()
      , lastChange = watchers[fullPath];

    if (now - lastChange > minDuration) {
      update(file);
      watchers[fullPath] = now;
    }
  });
}

function watchTree(options, update, watching) {
  readdirp(options)
    .on('warn', console.warn)
    .on('error', console.error)
    .on('data', function (entry) {
      console.log('watching:', entry.path);
      watchFile(entry.fullPath, 'change', update);
    })
    .on('end', watching);
}

module.exports = {
    watchFile: watchFile
  , watchTree: watchTree
};
