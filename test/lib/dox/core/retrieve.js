/*jshint asi:true */
'use strict';

var test     =  require('tap').test
  , retrieve =  require('../../../../lib/dox/core/retrieve')
  , format   =  require('util').format
  , rootUrl  =  format('http://nodejs.org/docs/%s/api', process.version)


test('\nwhen I retrieve fs', function (t) {
  retrieve(rootUrl + '/fs.json', 'fs', function (err, doc) {
    t.equal(err, null, 'returns no error')    
    t.equal(doc.modules[0].name, 'fs', 'returns doc for file module')
    t.end()
  })
})

test('\nwhen I retrieve path', function (t) {
  retrieve(rootUrl + '/path.json', 'path', function (err, doc) {
    t.notOk(err, 'returns no error')    
    t.equal(doc.modules[0].name, 'path', 'returns doc for path module')
    t.end()
  })
})

test('\nwhen I retrieve nonexistingmodule', function (t) {
  retrieve(rootUrl + '/nonexistingmodule.json', 'nonexistingmodule', function (err, doc) {
    t.ok(err, 'returns error')    
    t.similar(err.message, /.+not found./, 'err indicates that the documentation was not found')
    t.end()
  })
})
