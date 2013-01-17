/*jshint asi:true */
'use strict';

var test         =  require('tape')
  , coreRetrieve =  require('../../lib/dox/core-retrieve')
  , format       =  require('util').format
  , rootUrl      =  format('http://nodejs.org/docs/%s/api', process.version)


test('\n# when I retrieve fs', function (t) {
  coreRetrieve(rootUrl + '/fs.json', 'fs', function (err, doc) {
    t.notok(err, 'returns no error')    
    t.equals(doc.modules[0].name, 'fs', 'returns doc for file module')
    t.end()
  })
})

test('\n# when I retrieve path', function (t) {
  coreRetrieve(rootUrl + '/path.json', 'path', function (err, doc) {
    t.notok(err, 'returns no error')    
    t.equals(doc.modules[0].name, 'path', 'returns doc for path module')
    t.end()
  })
})

test('\n# when I retrieve nonexistingmodule', function (t) {
  coreRetrieve(rootUrl + '/nonexistingmodule.json', 'nonexistingmodule', function (err, doc) {
    t.ok(err, 'returns error')    
    t.ok(err.message.indexOf('not found.') > 0, 'err indicates that the documentation was not found')
    t.end()
  })
})
