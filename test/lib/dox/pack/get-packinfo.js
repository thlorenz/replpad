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

test('\ngets marked packinfo', function (t) {
  info('marked', function (err, res) {
    t.notOk(err, 'no error')
    t.equal(res.homepage, 'https://github.com/chjj/marked', 'homepage')
    t.equal(res.url, 'https://github.com/chjj/marked', 'browseable github url')
    t.equal(res.readmeFilename, 'README.md', 'readme filename')
    t.ok(res.readme.length > 0, 'readme string')
    t.end()    
  });
})
