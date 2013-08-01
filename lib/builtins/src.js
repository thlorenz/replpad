'use strict';
var findexquire     =  require('../findexquire');
var functionComment =  require('function-comment');
var cardinal        =  require('cardinal');
var log             =  require('../log');
var fs              =  require('fs');

function newlinesIn(src) {
  if (!src) return 0;
  var newlines = src.match(/\n/g);

  return newlines ? newlines.length : 0;
}

function getComment (file, fnsrc, lineno) {
  var src = fs.readFileSync(file, 'utf8');
  try {
   return functionComment(src, lineno);
  } catch (e) {
    log.sillyln(e);
    return null;
  }
}

module.exports = function plugSrc(repl) {
  Function.prototype.__defineGetter__('src', function () {
    var fnsrc = this.toString();
    var locs = findexquire.find(fnsrc);
    var comment = '', lineno = 0, firstline;

    if (locs) {
      locs.forEach(function (loc) {
        fnsrc += '\n// ' + loc.file + ':' + loc.start.line + ':' + loc.start.column;
      });

      if (locs.length === 1) lineno = locs[0].start.line;
    }

    // make anonymous functions parsable
    fnsrc = fnsrc.replace(/^function[ ]+\(/, 'function fn(');

    if (lineno) {
      comment = getComment(locs[0].file, fnsrc, lineno);

      if (comment) { 
        fnsrc = comment.comment + '\n' + fnsrc;
        firstline = comment.startline
      } else {
        firstline = lineno;
      }
    }

    try {
      var code = cardinal.highlight(fnsrc, { linenos: lineno > 0, firstline: firstline });
      repl.outputStream.write(code);
      return '';
    } catch (e) {
      log.sillyln(e);
      return repl.outputStream.write(fnsrc);
    }

    return fnsrc;
  });
};
