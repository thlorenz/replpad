'use strict';
var fs          =  require('fs')
  , path        =  require('path')
  , minDuration =  1000
  , watchers    =  {}
  ;

module.exports = function watch(file, eventName, update) {
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
};

/*module.exports(__filename, 'change', function () {
  console.log(arguments)
});*/
