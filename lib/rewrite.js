'use strict';

var escodegen = require('escodegen')
  , esprima = require('esprima')
  , path = require('path')
  ; 

module.exports = function rewrite(src, format) {
  var ast = esprima.parse(src)
    , regenerated = escodegen.generate(ast, { format: format }) + '\n';

  return regenerated
        // remove shebang
        .replace(/^\#\!.*/, '');
};

// TODO: turn into test
/*var code = '' + 
function read() {
  var path = require('path')
    , fs = require('fs')

  // comments should be ignored
  return fs.readdirSync(path.join(__dirname, '..'))
}*/

