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

module.exports = function plugSrc(repl /* not used */) {
  Function.prototype.__defineGetter__('src', function () {
    var fnsrc   =  this.toString();
    var locs    =  findexquire.find(fnsrc);

    var comment =  ''
      , lineno
      , firstline;

    // make anonymous functions parsable
    fnsrc = fnsrc.replace(/^function[ ]+\(/, 'function fn(');

    if (locs) {
      locs.forEach(function (loc) {
        fnsrc += '\n// ' + loc.file + ':' + loc.start.line + ':' + loc.start.column;
      });

      if (locs.length === 1) lineno = locs[0].start.line;
    }

    if (lineno) {
      comment = getComment(locs[0].file, fnsrc, lineno);

      if (comment && comment.startline > 0) { 
        fnsrc = comment.comment + '\n' + fnsrc;
        firstline = comment.startline
      } else {
        firstline = lineno;
      }
    }

    var lineInfo = { linenos: !!lineno, firstline: firstline };
    try {
      return { 
          __replpad_print_raw__: cardinal.highlight(fnsrc, lineInfo)
        , lineInfo: lineInfo 
      };
    } catch (e) {
      log.sillyln(e);
      return { __replpad_print_raw__: fnsrc, lineInfo: lineInfo };
    }
  });
};
