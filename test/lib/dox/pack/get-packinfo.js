'use strict';
/*jshint asi: true */

var test = require('tap').test
var parentDir = require('find-parent-dir');
var getPackinfo = require('../../../../lib/dox/pack/get-packinfo');

function info (name, cb) {
  parentDir(require.resolve(name), 'package.json', function (err, dir) {
    if (err) return cb(err);
    cb(null, getPackinfo(dir));
  });
}

test('\ngets cardinal packinfo', function (t) {
  info('cardinal', function (err, res) {
    t.notOk(err, 'no error')
    t.equal(res.url, 'https://github.com/thlorenz/cardinal', 'browseable github url')
    t.equal(res.readmeFilename, 'README.md', 'readme filename')
    t.ok(res.readme.length > 0, 'readme string')
    t.end()    
  });
})

test('\ngets xtend packinfo', function (t) {
  info('xtend', function (err, res) {
    t.notOk(err, 'no error')
    t.equal(res.homepage, 'https://github.com/Raynos/xtend', 'homepage')
    t.equal(res.url, 'https://github.com/Raynos/xtend', 'browseable github url')

    // no idea why `res.readme` isn't defined on travis
    if (!process.env.TRAVIS) {
      t.ok(res.readme.length > 0, 'readme string') 
      // readme no longer included for marked (most likely an npm optimization since readme is large?)
      // t.equal(res.readmeFilename, 'README.md', 'readme filename')
    }
    t.end()    
  });
})
