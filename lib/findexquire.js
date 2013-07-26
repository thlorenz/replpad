'use strict';

var findex      =  require('findex')
  , path        =  require('path')
  , log         =  require('./log')
  , requireLike =  require('require-like')
  , xtend       =  require('util')._extend
  , indexedDirs =  {}

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

var go = module.exports = function findexquire (requirePath) {
  var req = requireLike(requirePath);

  return function (request) {
    var from = req.resolve.apply(null, arguments);
    var fromdir = path.dirname(fromdir);
    log.info('requireing "%s" from "%s"', request, fromdir);

    if (indexedDirs[fromdir]) return;
    indexedDirs[fromdir] = true;

    findex({ root: fromdir }, function (err, index_) {
      if (err) log.error(err);
      log.sillyln('indexed\n', indexedFiles(index_));
      global.index = xtend(global.index || {}, index_);
    });
    return req.apply(req, arguments);
  };
};

function source (p) {
  var fs = require('fs');
  var fullPath = require.resolve(p);
  var src = fs.readFileSync(fullPath, 'utf8');
  var idx = findex.file(src);
  return { src: src, idx: idx, mod: require(p) };
}
