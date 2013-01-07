'use strict';
var log = require('../utl').log
  , state = require('../state')
  , indicatorTime = 50;

module.exports = function override_ttyWrite(repl) {
  var original_ttyWrite = repl.rli._ttyWrite
    , normal = false
    , buf = [];

  // __ttyWrite has been here since 0.2, so I think we are safe to assume it will be used in the future
  repl.rli._ttyWrite = function(code, key) {
    var self = this;
    key = key || {};

    function normalMode() {
      self._moveCursor(-1);
      normal = true;
    }

    function insertMode() {
      normal = false;
    }

    if (state.feedingFile) {
      // makes sense to be in insert mode after file is piped
      normal = false;
      return original_ttyWrite.apply(repl.rli, arguments);
    }

    // normal mode via escape or ctrl-[
    if (key.name == 'escape') return normalMode();
    if (key.name == '[' && key.ctrl) return normalMode();

    if (!normal) return original_ttyWrite.apply(repl.rli, arguments);

    function deleteLine() {
      self._deleteLineLeft();
      self._deleteLineRight();
    }

    var prev = buf.pop();
    switch(key.name) {
      // insert mode via i
      case 'i':
        if (key.shift) return this._moveCursor(-Infinity), insertMode();
        return insertMode();
      // insert mode via a
      case 'a':
        if (key.shift) this._moveCursor(Infinity), insertMode();
        return this._moveCursor(+1), insertMode();
        break;
        
      // change line via 'cc' or 'C'
      case 'c':
        if (key.shift) return deleteLine(), insertMode();
        if (!prev) return buf.push('c');
        if (prev == 'c') return deleteLine(), insertMode();
        break;
      // delete line via 'dd' or 'D'
      case 'd':
        if (key.shift) return deleteLine();
        if (!prev) return buf.push('d');
        if (prev == 'd') return deleteLine();
        break;

      // movements
      case 'h':
        if (prev == 'd') return this._deleteLeft();
        return this._moveCursor(-1);
      case 'l':
        if (prev == 'd') return this._deleteRight();
        return this._moveCursor(+1);
      case 'b':
        if (prev == 'd') return this._deleteWordLeft();
        if (prev == 'c') return this._deleteWordLeft(), insertMode();
        return this._wordLeft();
      case 'w':
        if (prev == 'd') return this._deleteWordRight();
        if (prev == 'c') { 
          this._deleteWordRight();
          return insertMode();
        }
        return this._wordRight();

      // deletion
      case 'x':
        return key.shift 
          ? this._deleteLeft() 
          : this._deleteRight(); 

      // history
      case 'k':
        return this._historyPrev();
      case 'j':
        return this._historyNext();

      // enter
      case 'enter':
        return this._line(), insertMode();
    }

    switch (code) {
      case '0':
        return this._moveCursor(-Infinity);
      case '$': 
        return this._moveCursor(Infinity);
    }
  };
};
