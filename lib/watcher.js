'use strict';

var fs          =  require('fs')
  , readdirp    =  require('readdirp')
  , chokidar    =  require('chokidar')
  , utl         =  require('./utl')
  , log         =  require('./log')
  , watchers    =  {}
  , watchedDirs =  {}
  ;

function dateEqual(d1, d2) {
  return d1.toGMTString() === d2.toGMTString();
}

function watchFile(entry, eventName, startedWatching, update) {
  var fullPath = entry.fullPath;

  if (watchers[fullPath]) return;
  startedWatching(entry);

  chokidar.watch(fullPath, { persistent: true })
    .on('change', function () {
      var prevStat = watchers[fullPath].stat
        , entry    = watchers[fullPath].entry

      fs.stat(fullPath, function (err, stat) {
        if (err) return log.error('watcher', err);

        // ignore atime changes (read access)
        if ( prevStat
          && dateEqual(prevStat.mtime, stat.mtime)
          && dateEqual(prevStat.ctime, stat.ctime)) return;

        watchers[fullPath].stat = stat
        update(entry);
      });
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

    chokidar.watch(fullPath, { persistent: true })
      .on('add', function () {
        var cloned = utl.shallowClone(options);

        cloned.depth = 0;
        cloned.root = fullPath;

        readdirp(cloned)
          .on('warn', log.error)
          .on('error', log.error)
          .on('data', function (entry) {
            try {
              watchFile(entry, 'change', startedWatching, update);
            } catch(e) {
              log.error('Not watching: ' + entry.path);
            }
          });
      })
      .on('unlink', function (path) {
        watchers[fullPath] = void 0;
      });
  }

  readdirp(options)
    .on('warn', log.error)
    .on('error', log.error)
    .on('data', function (entry) {
      try {
        watchFile(entry, 'change', startedWatching, update);
        watchDir(entry.fullParentDir, utl.shallowClone(options), watching, update);
      } catch(e) {
        log.error('Not watching: ' + entry.path);
      }
    })
    .on('end', function () {
      watchDir(options.root, utl.shallowClone(options), watching, update);
      if (watching) watching(watchers);
    });
}

module.exports = {
    watchFile: watchFile
  , watchTree: watchTree
};
