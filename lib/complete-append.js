var cardinal =  require('cardinal')
  , rewrite  =  require('./rewrite')
  , config   =  require('../config/current')
  , utl      =  require('./utl');

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
    , rewritten
    , l = history.length
    , start = 0
    , format = utl.shallowClone(config.feed.format);

  if (l === 0) return null;

  // skip commands, i.e. '.append'
  while (/^[ ]*\.\w+[ ]*$/.test(history[start])) {
    start++;
    if (start == l) return null;
  }

  format.compact = false;
  for (var i = start; i < l; i++) {
    try {
      code = '\n' + history[i] + code;

      rewritten = '\n' + rewrite(code, format);
      highlighted = cardinal.highlight(rewritten);
      // no blow up means code was parsable, so we are done
      return { raw: rewritten, highlighted: highlighted };
    } catch (e) {/* keep trying */ }
  }

  code = '\n' + history[start] + '\n';
  // we got here because no parsable portion was found
  return { raw: code, highlighted: code };
};
