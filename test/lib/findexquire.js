'use strict';
/*jshint asi: true */

var test = require('tap').test
var wire = require('../../lib/wire')
var findexquire = require('../../lib/findexquire')
process.env.REPLPAD_DEBUG = true;

var sourcemap = require('escodegen/node_modules/source-map')

test('\nwhen I findexquire escodegen', function (t) {
  t.plan(4)
  var req = findexquire(__filename, true)
  var escodegen = req('escodegen')

  var locs = findexquire.find(escodegen.generate);
  t.equal(locs.length, 0, 'does not find escodegen.generate right away')

  wire.on('findex-first-pass', onfirstpass);
  wire.on('findex-second-pass', onsecondpass);

  function onfirstpass() {
    var generateLocs = findexquire.find(escodegen.generate);
    var consumerLocs = findexquire.find(sourcemap.SourceMapConsumer);

    t.equal(generateLocs.length, 1, 'finds escodegen.generate after first pass')
    t.notOk(consumerLocs, 'does not find sourcemap.SourceMapConsumer yet')
  }

  function onsecondpass () {
    var consumerLocs = findexquire.find(sourcemap.SourceMapConsumer);
    t.equal(consumerLocs.length, 1, 'finds sourcemap.SourceMapConsumer after second pass')
  }
})
