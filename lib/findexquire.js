'use strict';

var findex        =  require('findex')
  , path          =  require('path')
  , log           =  require('./log')
  , requireLike   =  require('require-like')
  , findParentDir =  require('find-parent-dir')
  , xtend         =  require('util')._extend
  , colors        =  require('ansicolors')
  , indexedDirs   =  {}
  , indexes       =  {}

function indexedFiles (index) {
  var filesIndexedHash = Object.keys(index)
    .reduce(function (acc, k) {
      var entry = index[k];
      var fst = entry[0];
      if (fst) acc[fst.file] = true;
      return acc;
    }, {});
  return Object.keys(filesIndexedHash);
}

var go = module.exports = function (requirePath, uncached) {
  var reqlike = requireLike(requirePath, uncached);

  return function (request) {
    var from = reqlike.resolve(request);
    var fromdir = path.dirname(from);
    findParentDir(from, 'package.json', function (err, packagedir) {
      if (err) return log.error(err);

      if (indexedDirs[fromdir]) return;
      indexedDirs[fromdir] = true;

      findex.fork({ root: fromdir }, function (err, indexes_) {
        if (err) log.error(err);
        indexes = xtend(indexes, indexes_);
        indexes.find = findex.find.bind(indexes);
      });
    });

    return reqlike(request);
  }
}

go.find = function (fn) { return indexes.find ? indexes.find(fn) : []; };
go.indexes = indexes;
