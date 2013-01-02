var escodegen = require('escodegen');
var esprima = require('esprima');

module.exports = function rewrite(src, format) {
  var ast = esprima.parse(src);
  return escodegen.generate(ast, { format: format }) + '\n';
}

// TODO: turn into test
/*var code = '' + 
function read() {
  var path = require('path')
    , fs = require('fs')

  // comments should be ignored
  return fs.readdirSync(path.join(__dirname, '..'))
}*/

