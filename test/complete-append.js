/*jshint asi:true */
'use strict';

var test = require('tape')
  , completeAppend = require('../lib/complete-append')


test('\n# completes 3 line function at end of history', function (t) {
  var history = [
      '1'
    , '2'
    , 'function foo () {'
    ,  '  var a = 2;'
    ,  '  return a + 1;'
    ,  '}'
    ].reverse()
    , expected = '\nfunction foo () {\n  var a = 2;\n  return a + 1;\n}'
    , append = completeAppend(history)

    t.equals(append.raw, expected, 'gets raw')
    t.notEquals(append.raw, append.highlighted, 'gets highlighted')
    t.end()
})

test('\n# does not complete incomplete function at end of history', function (t) {
  var history = [
       '  var a = 2;'
    ,  '  return a + 1;'
    ,  '}'
    ].reverse()
    , expected = '\n}'
    , append = completeAppend(history)

    t.equals(append.raw, expected, 'gets raw')
    t.equals(append.raw, append.highlighted, 'does not highlight')
    t.end()
})
