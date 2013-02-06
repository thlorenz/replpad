'use strict';

var watcher = require('./watcher')
  , colors      =  require('ansicolors')
  , log     =  require('./log')
  , config      =  require('../config/current')
  ;

function reportWatchedFiles(watchers) {
  log.println('Watching ' + colors.brightGreen('[' + Object.keys(watchers).length + ' files]'));
}

module.exports = function watchAndFeed(root, feedEntry, cb) {
  var watcherInitialized
    , feed = config.feed
    , opts = {
        fileFilter      :  feed.fileFilter      || '*.js'
      , directoryFilter :  feed.directoryFilter || [ '!.*', '!node_modules' ]
      , root            :  root
      }
    ;

  watcher.watchTree(
      opts
    , function onAddedWatch(info) {
        try {
          log.print('Started watching: ' + info.entry.path);

          // log total every time a new file is added after watcher was initialized and source it
          if (watcherInitialized) { 
            reportWatchedFiles(info.all);
            feedEntry(info.entry);
          }
        } catch(e) {
          console.trace();
          log.error(e);
        }
      }
    , function onChanged(file) { 
        feedEntry(file); 
      }
    , function onWatcherInitialized(watchers) {
        watcherInitialized = true;
        reportWatchedFiles(watchers);
        cb();
      }
  );
};
