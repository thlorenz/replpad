'use strict';
/*jshint asi: true */

var test = require('tap').test
var findexquire = require('../../lib/findexquire')
process.env.REPLPAD_DEBUG = true;

var sourcemap = require('escodegen/node_modules/source-map')

test('\nwhen I findexquire escodegen', function (t) {
  t.plan(4)
  var req = findexquire(__filename, true)
  var escodegen = req('escodegen')

  var locs = findexquire.find(escodegen.generate);
  t.equal(locs.length, 0, 'does not find escodegen.generate right away')

  setTimeout(waitNcontinue, 1500)

  function waitNcontinue() {
    var generateLocs = findexquire.find(escodegen.generate);
    var consumerLocs = findexquire.find(sourcemap.SourceMapConsumer);

    t.equal(generateLocs.length, 1, 'finds escodegen.generate after 1.5 seconds')
    t.notOk(consumerLocs, 'does not find sourcemap.SourceMapConsumer yet')

    setTimeout(waitMoreNcontinue, 1000)
  }

  function waitMoreNcontinue () {
    var consumerLocs = findexquire.find(sourcemap.SourceMapConsumer);
    t.equal(consumerLocs.length, 1, 'finds sourcemap.SourceMapConsumer after 1 more second')
  }
})
