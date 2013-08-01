'use strict';
var findexquire     =  require('../findexquire');
var functionComment =  require('function-comment');
var cardinal        =  require('cardinal');
var log             =  require('../log');
var fs              =  require('fs');

function addComment (file, fnsrc, lineno) {
  var src = fs.readFileSync(file, 'utf8');
  var comment = '';

  try {
   comment = functionComment(src, lineno);
  } catch (e) {
    log.sillyln(e);
  }

  return comment.length
    ? comment + '\n' + fnsrc
    : fnsrc;
}

module.exports = function plugSrc(repl) {
  Function.prototype.__defineGetter__('src', function () {
    var fnsrc = this.toString();
    
      var locs = findexquire.find(fnsrc);

      if (locs) {
        locs.forEach(function (loc) {
          fnsrc += '\n// ' + loc.file + ':' + loc.start.line + ':' + loc.start.column;
        });

        if (locs.length === 1) fnsrc = addComment(locs[0].file, fnsrc, locs[0].start.line);
      }

      // make anonymous functions parsable
      fnsrc = fnsrc.replace(/^function[ ]+\(/, 'function fn(');

    try {
      var code = cardinal.highlight(fnsrc, { linenos: true });
      repl.outputStream.write(code);
      return '';
    } catch (e) {
      log.sillyln(e);
      return repl.outputStream.write(fnsrc);
    }

    return fnsrc;
  });
};
