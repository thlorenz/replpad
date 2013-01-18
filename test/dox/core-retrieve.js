/*jshint asi:true */
'use strict';

var test         =  require('trap').test
  , coreRetrieve =  require('../../lib/dox/core-retrieve')
  , format       =  require('util').format
  , rootUrl      =  format('http://nodejs.org/docs/%s/api', process.version)


test('when I retrieve fs', function (t) {
  t.cb(coreRetrieve(rootUrl + '/fs.json', 'fs', function (err, doc) {
    t.equal(err, null, 'returns no error')    
    t.equal(doc.modules[0].name, 'fs', 'returns doc for file module')
  }))
})

test('when I retrieve path', function (t) {
  t.cb(coreRetrieve(rootUrl + '/path.json', 'path', function (err, doc) {
    t.notOk(err, 'returns no error')    
    t.equal(doc.modules[0].name, 'path', 'returns doc for path module')
  }))
})

test('when I retrieve nonexistingmodule', function (t) {
  t.cb(coreRetrieve(rootUrl + '/nonexistingmodule.json', 'nonexistingmodule', function (err, doc) {
    t.ok(err, 'returns error')    
    t.similar(err.message, /.+not found./, 'err indicates that the documentation was not found')
  }))
})
