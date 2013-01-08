var cardinal = require('cardinal');

/**
 * Tries to grab a complete JavaScript snippet from the history. 
 * 
 * @name completeAppend
 * @function
 * @param history {Array[{String}]} last entered lines in reverse order (i.e., last entered line is at index 0)
 * @return {Object} the smallest portion of the history that was parsable or just the last line if none was found as { raw, highlighted }
 */
module.exports = function completeAppend(history) {
  var highlighted
    , code = ''
    , l = history.length;

  for (var i = 0; i < l; i++) {
    try { 
      code = '\n' + history[i] + code;

      highlighted = cardinal.highlight(code);
      // no blow up means code was parsable, so we are done
      return { raw: code, highlighted: highlighted };
    } catch (e) {/* keep trying */ }
  }
  
  code = '\n' + history[0];
  // we got here because no parsable portion was found
  return { raw: code, highlighted: code };
};
