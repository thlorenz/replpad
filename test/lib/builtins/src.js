'use strict';
/*jshint asi: true */

var debug //=  true;
var test  =  debug  ? function () {} : require('tap').test
var test_ =  !debug ? function () {} : require('tap').test

var path = require('path')
var wire = require('../../../lib/wire')
var format = require('util').format
var findexquire = require('../../../lib/findexquire')(__filename, true)

var fixtures = path.join(__dirname, '..', '..', 'fixtures');

(function stubThings () {
  require('../../../lib/builtins/src')();

  require('cardinal').highlight = function (src, opts) { 
    return 'highlighted\n' + src;
  }
})()

var fnWithJsdoc          =  findexquire('../../fixtures/function-with-jsdoc', true)
var fnWithoutComment     =  findexquire('../../fixtures/function-without-comment', true)
var fnSameWithJsdoc      =  findexquire('../../fixtures/same-function-with-jsdoc', true)
var fnSameWithoutComment =  findexquire('../../fixtures/same-function-without-comment', true)

  
test('\nwhen I require a module with a jsdoc and its code was not indexed', function (t) {
  var res = fnWithJsdoc.src
  var output = res.__replpad_print_raw__
  
  t.deepEqual(
      output.split('\n')
    , [ 'highlighted',
        'function doingStuff(c, d) {',
        '  return (c + d) * d',
        '}' ]
    , 'src outputs the function without jsdoc or location'
  )

  t.deepEqual(res.lineInfo, { linenos: false, firstline: undefined });
  
  t.end()
})

test('\nsrc writing of indexed functions', function (t) {
  
  wire.on('findex-first-pass', function () {
    
    test('\nwhen I require a module with a jsdoc and its code was indexed', function (t) {
      var res = fnWithJsdoc.src;
      var output = res.__replpad_print_raw__;
      
      t.deepEqual(
          output.split('\n')
        , [ 'highlighted',
            '/**',
            ' * Adds c to d and then multiplies the result with d.',
            ' * ',
            ' * @name doingStuff',
            ' * @function',
            ' * @param c {Number}',
            ' * @param d {Number}',
            ' * @return {Number} overall result',
            ' */',
            'function doingStuff(c, d) {',
            '  return (c + d) * d',
            '}',
            '// ' + fixtures + '/function-with-jsdoc.js:12:17' ]
        , 'src outputs the function including jsdoc and location'
      )
      t.deepEqual(res.lineInfo, { linenos: true, firstline: 3 }, 'correct lineinfo');

      t.end()
    })

    test('\nwhen I require a module without comments and its code was indexed', function (t) {
      var res = fnWithoutComment.src;
      var output = res.__replpad_print_raw__;
      
      t.deepEqual(
          output.split('\n')
        , [ 'highlighted',
            'function doingOtherStuff(c, d) {',
            '  return (c + d);',
            '}',
            '// ' + fixtures + '/function-without-comment.js:3:17' ]
        , 'src outputs the function including location'
      )

      t.deepEqual(res.lineInfo, { linenos: true, firstline: 3 }, 'correct lineinfo');

      t.end()
    })
  
    test('\nwhen I require a module with a jsdoc and its code was indexed, but the function exists twice', function (t) {
      var res = fnSameWithJsdoc.src;
      var output = res.__replpad_print_raw__;
      var lines = output.split('\n')

      // fixtures may come out in arbitrary order, make determinate for tests
      var codeLines = lines.slice(0, -2);
      var fixtureLines = lines.slice(-2);
      lines = codeLines.concat(fixtureLines.sort());
      
      t.deepEqual(
          lines 
        , [ 'highlighted',
            'function doingStuff(c, d) {',
            '  return console.log(\'This exact function exists twice\', c, d);',
            '}',
            '// ' + fixtures + '/same-function-with-jsdoc.js:12:17',
            '// ' + fixtures + '/same-function-without-comment.js:3:17' ]
        , 'src outputs the function without jsdoc including both locations'
      )
      t.deepEqual(res.lineInfo, { linenos: false, firstline: undefined }, 'correct lineinfo');

      t.end()
    })

    test('\nwhen I require a module without comments and its code was indexed, but the function exists twice', function (t) {
      var res = fnSameWithoutComment.src;
      var output = res.__replpad_print_raw__;
      var lines = output.split('\n')

      // fixtures may come out in arbitrary order, make determinate for tests
      var codeLines = lines.slice(0, -2);
      var fixtureLines = lines.slice(-2);
      lines = codeLines.concat(fixtureLines.sort());
      
      t.deepEqual(
          lines
        , [ 'highlighted',
            'function doingStuff(c, d) {',
            '  return console.log(\'This exact function exists twice\', c, d);',
            '}',
            '// ' + fixtures + '/same-function-with-jsdoc.js:12:17',
            '// ' + fixtures + '/same-function-without-comment.js:3:17' ]
        , 'src outputs the function including both locations'
      )
      t.deepEqual(res.lineInfo, { linenos: false, firstline: undefined }, 'correct lineinfo');

      t.end()
    })
    t.end()
  })
})
