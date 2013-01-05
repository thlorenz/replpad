'use strict';
var fs          =  require('fs')
  , path        =  require('path')
  , readdirp = require('readdirp')
  , minDuration =  1000
  , watchers    =  {}
  ;

function watchFile(entry, eventName, update) {
  var fullPath = entry.fullPath;

  if (watchers[fullPath]) return;
  
  watchers[fullPath] = { lastChange: new Date(), entry: entry };

  fs.watch(fullPath, { persistent: true }, function (event) {
    if (event !== eventName) return;

    // Avoid duplicate fires in cases when two change events are raised for one actual change
    var now = new Date()
      , lastChange = watchers[fullPath].lastChange
      , entry = watchers[fullPath].entry;

    if (now - lastChange > minDuration) {
      update(entry);
      watchers[fullPath].lastChange = now;
    }
  });
}

function watchTree(options, update, watching) {
  readdirp(options)
    .on('warn', console.warn)
    .on('error', console.error)
    .on('data', function (entry) {
      try { 
        watchFile(entry, 'change', update);
        console.log('watching:', entry.path);
      } catch(e) {
        console.error('Not watching: ' + entry.path);
      }
    })
    .on('end', function () { 
      console.log('[%s files]', Object.keys(watchers).length);
      watching();
    });
}

module.exports = {
    watchFile: watchFile
  , watchTree: watchTree
};
