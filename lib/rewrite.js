'use strict';

var escodegen = require('escodegen')
  , esprima = require('esprima')
  , path = require('path')
  ; 

module.exports = function rewrite(file, src, format) {
  var ast = esprima.parse(src)
    , regenerated = escodegen.generate(ast, { format: format }) + '\n'
    , __filename_sub = '__filename = "' + file + '";'
    , __dirname_sub = '__dirname = "' + path.dirname(file) + '";'
    //, require_sub = '__require__ = require; require
    ;

  return __filename_sub + __dirname_sub + ';\n'
    + (
      regenerated
        // remove shebang
        .replace(/^\#\!.*/, '')
    );
};

// TODO: turn into test
/*var code = '' + 
function read() {
  var path = require('path')
    , fs = require('fs')

  // comments should be ignored
  return fs.readdirSync(path.join(__dirname, '..'))
}*/

