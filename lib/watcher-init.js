'use strict';

var watcher =  require('./watcher')
  , colors  =  require('ansicolors')
  , log     =  require('./log')
  , config  =  require('../config/current')
  , events  =  require('events')
  , vimSaveDelayFiles = []
  , vimSaveDelay = 50
  ;

function reportWatchedFiles(watchers) {
  log.println('Watching ' + colors.brightGreen('[' + Object.keys(watchers).length + ' files]'));
}

module.exports = function initWatcher(root) {
  var watcherInitialized
    , emitter = new events.EventEmitter()
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
            emitter.emit('file-changed', info.entry);
          }
        } catch(e) {
          console.trace();
          log.error(e);
        }
      }
    , function onChanged(file) { 
        
        //===================
        //xwildeyes 8.6.2041 12:28 MOD START
        //===================
        console.log(config)
        if(vimSaveDelayFiles.indexOf(file) === -1) {
          emitter.emit('file-changed', file);
          vimSaveDelayFiles.push(file)
          setTimeout(function () {
            vimSaveDelayFiles.splice(vimSaveDelayFiles.indexOf(file), 1)
          }, vimSaveDelay);
        }
        //===================
        //xwildeyes MOD START
        //===================
      }
    , function onWatcherInitialized(watchers) {
        watcherInitialized = true;
        reportWatchedFiles(watchers);
        emitter.emit('initialized', watchers);
      }
  );

  return emitter;
};
