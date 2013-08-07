'use strict';

var findex        =  require('findex')
  , fs            =  require('fs')
  , path          =  require('path')
  , log           =  require('./log')
  , packDox       =  require('./dox/pack')
  , requireLike   =  require('require-like')
  , findParentDir =  require('find-parent-dir')
  , xtend         =  require('util')._extend
  , colors        =  require('ansicolors')
  , wire          =  require('./wire')
  , indexedDirs   =  {}
  , indexes       =  {}

function indexDirectory(dir, dirFilter, cb) {
  if (indexedDirs[dir]) return;
  indexedDirs[dir] = true;

  findex.fork({ root: dir, directoryFilter: dirFilter, debug: false }, function (err, indexes_) {
    if (err) {
      log.error(err);
      cb();
    }

    indexedDirs = indexes_.indexedDirs
      .reduce(function (acc, x) {
        acc[x] = true;
        return acc;
      }, indexedDirs);

    indexes = xtend(indexes, indexes_);
    indexes.find = findex.find.bind(indexes);

    cb();
  });
}

// on first the first run we don't want to include the module's dependencies
var firstFilter = [ '!.git', '!.svn', '!test', '!tests', '!node_modules' ];

// on the second run we start inside the package's node_modules dir and will include all node_modules below as well
var secondFilter = firstFilter.slice(0, -1);

/**
 * Returns custom require which does the following:
 *  - adjusts require to work relative to the given requirePath
 *  - ensures that required modules are never cached in order to pick up changes made to the required module (if uncached is set)
 *  - indexes all functions of the required module first and of all its dependencies second
 *  - the indexing step is performed on a forked process in order to not interfer with the main process, the repl itself
 *
 * @name exports
 * @function
 * @param requirePath {String} the path to which the require should be relative (i.e. the file from which the require is called)
 * @param uncached {Boolean} if true the module cache will be cleared before each require
 * @return {Function} adjusted require that behaves and has side effects as explained
 */
var go = module.exports = function (requirePath, uncached) {
  var reqlike = requireLike(requirePath, uncached);

  function wrap (request) {
    var mdl = reqlike(request);
    var from = reqlike.resolve(request);
    var fromdir = path.dirname(from);

    findParentDir(from, 'package.json', function (err, packagedir) {
      if (err) return log.error(err);

      // now we now the packagedir and can attach dox that print readme
      packDox(mdl, request, packagedir);
     
      // first indexing run only handles functions of the required module itself
      indexDirectory(fromdir, firstFilter, function () {
        log.sillyln('updated', fromdir);
        wire.emit('findex-first-pass', requirePath);

        // now lets take care of all functions found in the dependencies of the module
        var dependencies = path.join(fromdir, 'node_modules');
        fs.exists(dependencies, function (exists) {
          if (!exists) return;
          indexDirectory(dependencies, secondFilter, function () {
            wire.emit('findex-second-pass', requirePath);
            log.sillyln('updated %s dependencies', fromdir);
          });
        });
      });

    });

    return mdl;
  }
  wrap.resolve = reqlike.resolve.bind(reqlike);
  return wrap;
}

// TODO: the approach may not be ideal because:
// - npm places common dependencies in a sibling directory instead of nested (especially when npm dedupe is used)
// - therefore we may not find those when indexing contained node_modules
// - two alternatives:
//    1. require everything that is a dir level above (excluding node_modules)
//    2. look for dependencies in package.json, require.resolve them and index the containing directory

go.find = function (fn) { return indexes.find ? indexes.find(fn) : []; };
go.indexes = indexes;
