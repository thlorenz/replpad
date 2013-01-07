'use strict';
var log = require('../utl').log;

var vimMode = false
  , buf = [];

// TODO: ignore vim mode if we are piping a file
function tty(s, key) {
    key = key || {};

    if (key.ctrl && key.shift) {
      /* Control and shift pressed */

     /*
      * Mac Lion:
      *   - only shift OR ctrl are recognized
      *   - for special keys like backspace NONE are recognized
      */
      switch (key.name) {
        case 'backspace':
          console.log('backspace');
          this._deleteLineLeft();
          break;

        case 'delete':
          this._deleteLineRight();
          break;
      }

    } else if (key.ctrl) {
      /* Control key pressed */

     /*
      * Mac Lion:
      *   - ctrl-j is recognized as Enter
      */
      switch (key.name) {
        case 'c':
          if (this.listeners('SIGINT').length) {
            this.emit('SIGINT');
          } else {
            // This readline instance is finished
            this.close();
          }
          break;

        case 'h': // delete left
          this._deleteLeft();
          break;

        case 'd': // delete right or EOF
          if (this.cursor === 0 && this.line.length === 0) {
            // This readline instance is finished
            this.close();
          } else if (this.cursor < this.line.length) {
            this._deleteRight();
          }
          break;

        case 'u': // delete the whole line
          this.cursor = 0;
          this.line = '';
          this._refreshLine();
          break;

        case 'k': // delete from current to end of line
          this._deleteLineRight();
          break;

        case 'a': // go to the start of the line
          this._moveCursor(-Infinity);
          break;

        case 'e': // go to the end of the line
          this._moveCursor(+Infinity);
          break;

        case 'b': // back one character
          this._moveCursor(-1);
          break;

        case 'f': // forward one character
          this._moveCursor(+1);
          break;

        case 'n': // next history item
          this._historyNext();
          break;

        case 'p': // previous history item
          this._historyPrev();
          break;

        case 'z':
          if (process.platform == 'win32') break;
          if (this.listeners('SIGTSTP').length) {
            this.emit('SIGTSTP');
          } else {
            process.once('SIGCONT', (function(self) {
              return function() {
                // Don't raise events if stream has already been abandoned.
                if (!self.paused) {
                  // Stream must be paused and resumed after SIGCONT to catch
                  // SIGINT, SIGTSTP, and EOF.
                  self.pause();
                  self.emit('SIGCONT');
                }
                // explictly re-enable "raw mode" and move the cursor to
                // the correct position.
                // See https://github.com/joyent/node/issues/3295.
                self._setRawMode(true);
                self._refreshLine();
              };
            })(this));
            this._setRawMode(false);
            process.kill(process.pid, 'SIGTSTP');
          }
          break;

        case 'w': // delete backwards to a word boundary
        case 'backspace':
          this._deleteWordLeft();
          break;

        case 'delete': // delete forward to a word boundary
          this._deleteWordRight();
          break;

        case 'backspace':
          this._deleteWordLeft();
          break;

        case 'left':
          this._wordLeft();
          break;

        case 'right':
          this._wordRight();
          break;
      }

    } else if (key.meta) {
      /* Meta key pressed */

      switch (key.name) {
        case 'b': // backward word
          this._wordLeft();
          break;

        case 'f': // forward word
          this._wordRight();
          break;

        case 'd': // delete forward word
        case 'delete':
          this._deleteWordRight();
          break;

        case 'backspace': // delete backwards to a word boundary
          this._deleteWordLeft();
          break;
      }

    } else {
      /* No modifier keys used */

      switch (key.name) {
        case 'enter':
          this._line();
          break;

        case 'backspace':
          this._deleteLeft();
          break;

        case 'delete':
          this._deleteRight();
          break;

        case 'tab': // tab completion
          this._tabComplete();
          break;

        case 'left':
          this._moveCursor(-1);
          break;

        case 'right':
          this._moveCursor(+1);
          break;

        case 'home':
          this._moveCursor(-Infinity);
          break;

        case 'end':
          this._moveCursor(+Infinity);
          break;

        case 'up':
          this._historyPrev();
          break;

        case 'down':
          this._historyNext();
          break;

        default:
          if (Buffer.isBuffer(s))
            s = s.toString('utf-8');

          if (s) {
            var lines = s.split(/\r\n|\n|\r/);
            for (var i = 0, len = lines.length; i < len; i++) {
              if (i > 0) {
                this._line();
              }
              this._insertString(lines[i]);
            }
          }
      }
    }
};
