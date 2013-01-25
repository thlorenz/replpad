'use strict';

/**
  * Declare key mappings
  * @name map
  * @function
  * @param nmap {Function} to declare normal mode mappings: nmap(from, to)
  * @param imap {Function} to declare insert mode mappings: imap(from, to)
  */
exports.map = function (nmap, imap) {

  // map 'jk' to 'esc' to switch to normal mode 
  imap('jk', 'esc');        

  // navigate backward in history  via 'ctrl-k'
  nmap('ctrl-k', 'ctrl-p');

};
