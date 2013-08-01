'use strict';
/*jshint asi: true */

var test = require('tap').test
var wire = require('../../../lib/wire')
var findexquire = require('../../../lib/findexquire')(__filename, true)

var output = ''
var repl = { outputStream: { write: function (s) { output += s } } }
require('../../../lib/builtins/src')(repl);

function inspect(obj, depth) {
  console.log(require('util').inspect(obj, false, depth || 5, true));
}

var fnWithJsdoc          =  findexquire('../../fixtures/function-with-jsdoc', true)
var fnWithoutComment     =  findexquire('../../fixtures/function-without-comment', true)
var fnSameWithJsdoc      =  findexquire('../../fixtures/same-function-with-jsdoc', true)
var fnSameWithoutComment =  findexquire('../../fixtures/same-function-without-comment', true)

  
test('\nwhen I require a module with a jsdoc and its code was indexed', function (t) {
  output = ''
  fnWithJsdoc.src;
  
  t.equal(
      output
    , '\u001b[94mfunction\u001b[39m \u001b[37mdoingStuff\u001b[39m\u001b[90m(\u001b[39m\u001b[37mc\u001b[39m\u001b[32m,\u001b[39m \u001b[37md\u001b[39m\u001b[90m)\u001b[39m \u001b[33m{\u001b[39m\n  \u001b[31mreturn\u001b[39m \u001b[90m(\u001b[39m\u001b[37mc\u001b[39m \u001b[93m+\u001b[39m \u001b[37md\u001b[39m\u001b[90m)\u001b[39m \u001b[93m*\u001b[39m \u001b[37md\u001b[39m\n\u001b[33m}\u001b[39m'
    , 'src outputs the function without jsdoc or location'
  )

  t.end()
})

test('\nsrc writing of indexed functions', function (t) {
  
  wire.on('findex-first-pass', function () {
    
    test('\nwhen I require a module with a jsdoc and its code was indexed', function (t) {
      output = ''
      fnWithJsdoc.src;
      
      t.equal(
          output
        , '\u001b[90m 4: \u001b[90m/**\n\u001b[90m 5:  * Adds c to d and then multiplies the result with d.\n\u001b[90m 6:  * \n\u001b[90m 7:  * @name doingStuff\n\u001b[90m 8:  * @function\n\u001b[90m 9:  * @param c {Number}\n\u001b[90m10:  * @param d {Number}\n\u001b[90m11:  * @return {Number} overall result\n\u001b[90m12:  */\u001b[39m\n\u001b[90m13: \u001b[94mfunction\u001b[39m \u001b[37mdoingStuff\u001b[39m\u001b[90m(\u001b[39m\u001b[37mc\u001b[39m\u001b[32m,\u001b[39m \u001b[37md\u001b[39m\u001b[90m)\u001b[39m \u001b[33m{\u001b[39m\n\u001b[90m14:   \u001b[31mreturn\u001b[39m \u001b[90m(\u001b[39m\u001b[37mc\u001b[39m \u001b[93m+\u001b[39m \u001b[37md\u001b[39m\u001b[90m)\u001b[39m \u001b[93m*\u001b[39m \u001b[37md\u001b[39m\n\u001b[90m15: \u001b[33m}\u001b[39m\n\u001b[90m16: \u001b[90m// /Users/thlorenz/dev/js/projects/replpad/test/fixtures/function-with-jsdoc.js:12:17\u001b[39m'
        , 'src outputs the function including jsdoc and location'
      )

      t.end()
    })

    test('\nwhen I require a module without comments and its code was indexed', function (t) {
      output = ''
      fnWithoutComment.src;
      
      t.equal(
          output
        , '\u001b[90m1: \n\u001b[90m2: \u001b[94mfunction\u001b[39m \u001b[37mdoingOtherStuff\u001b[39m\u001b[90m(\u001b[39m\u001b[37mc\u001b[39m\u001b[32m,\u001b[39m \u001b[37md\u001b[39m\u001b[90m)\u001b[39m \u001b[33m{\u001b[39m\n\u001b[90m3:   \u001b[31mreturn\u001b[39m \u001b[90m(\u001b[39m\u001b[37mc\u001b[39m \u001b[93m+\u001b[39m \u001b[37md\u001b[39m\u001b[90m)\u001b[39m\u001b[90m;\u001b[39m\n\u001b[90m4: \u001b[33m}\u001b[39m\n\u001b[90m5: \u001b[90m// /Users/thlorenz/dev/js/projects/replpad/test/fixtures/function-without-comment.js:3:17\u001b[39m'
        , 'src outputs the function including location'
      )

      t.end()
    })
  
    test('\nwhen I require a module with a jsdoc and its code was indexed, but the function exists twice', function (t) {
      output = ''
      fnSameWithJsdoc.src;
      
      t.equal(
          output
        , '\u001b[94mfunction\u001b[39m \u001b[37mdoingStuff\u001b[39m\u001b[90m(\u001b[39m\u001b[37mc\u001b[39m\u001b[32m,\u001b[39m \u001b[37md\u001b[39m\u001b[90m)\u001b[39m \u001b[33m{\u001b[39m\n  \u001b[31mreturn\u001b[39m \u001b[34mconsole\u001b[39m\u001b[32m.\u001b[39m\u001b[34mlog\u001b[39m\u001b[90m(\u001b[39m\u001b[92m\'This exact function exists twice\'\u001b[39m\u001b[32m,\u001b[39m \u001b[37mc\u001b[39m\u001b[32m,\u001b[39m \u001b[37md\u001b[39m\u001b[90m)\u001b[39m\u001b[90m;\u001b[39m\n\u001b[33m}\u001b[39m\n\u001b[90m// /Users/thlorenz/dev/js/projects/replpad/test/fixtures/same-function-with-jsdoc.js:12:17\u001b[39m\n\u001b[90m// /Users/thlorenz/dev/js/projects/replpad/test/fixtures/same-function-without-comment.js:3:17\u001b[39m'
        , 'src outputs the function without jsdoc including both locations'
      )

      t.end()
    })

    test('\nwhen I require a module without comments and its code was indexed, but the function exists twice', function (t) {
      output = ''
      fnSameWithoutComment.src;
      
      t.equal(
          output
        , '\u001b[94mfunction\u001b[39m \u001b[37mdoingStuff\u001b[39m\u001b[90m(\u001b[39m\u001b[37mc\u001b[39m\u001b[32m,\u001b[39m \u001b[37md\u001b[39m\u001b[90m)\u001b[39m \u001b[33m{\u001b[39m\n  \u001b[31mreturn\u001b[39m \u001b[34mconsole\u001b[39m\u001b[32m.\u001b[39m\u001b[34mlog\u001b[39m\u001b[90m(\u001b[39m\u001b[92m\'This exact function exists twice\'\u001b[39m\u001b[32m,\u001b[39m \u001b[37mc\u001b[39m\u001b[32m,\u001b[39m \u001b[37md\u001b[39m\u001b[90m)\u001b[39m\u001b[90m;\u001b[39m\n\u001b[33m}\u001b[39m\n\u001b[90m// /Users/thlorenz/dev/js/projects/replpad/test/fixtures/same-function-with-jsdoc.js:12:17\u001b[39m\n\u001b[90m// /Users/thlorenz/dev/js/projects/replpad/test/fixtures/same-function-without-comment.js:3:17\u001b[39m'
        , 'src outputs the function including both locations'
      )

      t.end()
    })
    t.end()
  })
})
