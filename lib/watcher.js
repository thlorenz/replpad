'use strict';
var fs          =  require('fs')
  , path        =  require('path')
  , readdirp    =  require('readdirp')
  , utl         =  require('./utl')
  , minDuration =  1000
  , watchers    =  {}
  , watchedDirs =  {}
  ;

function watchFile(entry, eventName, startedWatching, update) {
  var fullPath = entry.fullPath;

  if (watchers[fullPath]) return;
  startedWatching(entry);

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

function watchTree(options, addedWatch, update, watching) {

  function startedWatching(entry) {
    watchers[entry.fullPath] = { lastChange: new Date(), entry: entry };
    addedWatch({ entry: entry, all: watchers });
  }

  function watchDir(fullPath) {
    if (watchedDirs[fullPath]) return;
    watchedDirs[fullPath] = true;  

    fs.watch(fullPath, { persistent: true }, function (event) {
      if (event !== 'rename') return;
      var cloned = utl.shallowClone(options);

      cloned.depth = 0;
      cloned.root = fullPath;

      readdirp(cloned)
        .on('warn', console.warn)
        .on('error', console.error)
        .on('data', function (entry) {
          try { 
            watchFile(entry, 'change', startedWatching, update);
          } catch(e) {
            console.error('Not watching: ' + entry.path);
          }
        });
    });
  }

  readdirp(options)
    .on('warn', console.warn)
    .on('error', console.error)
    .on('data', function (entry) {
      try { 
        watchFile(entry, 'change', startedWatching, update);
        watchDir(entry.fullParentDir, utl.shallowClone(options), watching, update);
      } catch(e) {
        console.error('Not watching: ' + entry.path);
      }
    })
    .on('end', function () { 
      watchDir(options.root, utl.shallowClone(options), watching, update);
      watching && watching(watchers);
    });
}

module.exports = {
    watchFile: watchFile
  , watchTree: watchTree
};
