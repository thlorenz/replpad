'use strict';
/*jshint asi: true */

var debug// =  true;
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
    return format('highlighted (linenos: %s firstline: %d\n%s', opts.linenos, opts.firstline, src);  
  }
})()

var fnWithJsdoc          =  findexquire('../../fixtures/function-with-jsdoc', true)
var fnWithoutComment     =  findexquire('../../fixtures/function-without-comment', true)
var fnSameWithJsdoc      =  findexquire('../../fixtures/same-function-with-jsdoc', true)
var fnSameWithoutComment =  findexquire('../../fixtures/same-function-without-comment', true)

  
// TODO: check first line for all tests
test('\nwhen I require a module with a jsdoc and its code was indexed', function (t) {
  var output = fnWithJsdoc.src.__replpad_print_raw__
  
  t.deepEqual(
      output.split('\n')
    , [ 'highlighted (linenos: false firstline: NaN',
        'function doingStuff(c, d) {',
        '  return (c + d) * d',
        '}' ]
    , 'src outputs the function without jsdoc or location'
  )

  t.end()
})

test('\nsrc writing of indexed functions', function (t) {
  
  wire.on('findex-first-pass', function () {
    
    test('\nwhen I require a module with a jsdoc and its code was indexed', function (t) {
      var output = fnWithJsdoc.src.__replpad_print_raw__;
      
      t.deepEqual(
          output.split('\n')
        , [ 'highlighted (linenos: true firstline: 4',
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

      t.end()
    })

    test('\nwhen I require a module without comments and its code was indexed', function (t) {
      var output = fnWithoutComment.src.__replpad_print_raw__;
      
      t.deepEqual(
          output.split('\n')
        , [ 'highlighted (linenos: true firstline: 0',
            '',
            'function doingOtherStuff(c, d) {',
            '  return (c + d);',
            '}',
            '// ' + fixtures + '/function-without-comment.js:3:17' ]
        , 'src outputs the function including location'
      )

      t.end()
    })
  
    test('\nwhen I require a module with a jsdoc and its code was indexed, but the function exists twice', function (t) {
      var output = fnSameWithJsdoc.src.__replpad_print_raw__;
      
      t.deepEqual(
          output.split('\n')
        , [ 'highlighted (linenos: false firstline: NaN',
            'function doingStuff(c, d) {',
            '  return console.log(\'This exact function exists twice\', c, d);',
            '}',
            '// ' + fixtures + '/same-function-with-jsdoc.js:12:17',
            '// ' + fixtures + '/same-function-without-comment.js:3:17' ]
        , 'src outputs the function without jsdoc including both locations'
      )

      t.end()
    })

    test('\nwhen I require a module without comments and its code was indexed, but the function exists twice', function (t) {
      var output = fnSameWithoutComment.src.__replpad_print_raw__;
      
      t.deepEqual(
          output.split('\n')
        , [ 'highlighted (linenos: false firstline: NaN',
            'function doingStuff(c, d) {',
            '  return console.log(\'This exact function exists twice\', c, d);',
            '}',
            '// ' + fixtures + '/same-function-with-jsdoc.js:12:17',
            '// ' + fixtures + '/same-function-without-comment.js:3:17' ]
        , 'src outputs the function including both locations'
      )

      t.end()
    })
    t.end()
  })
})
