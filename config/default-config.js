'use strict';

/**
  * Declares vim like key mappings
  * @name map
  * @function
  * @param nmap {Function} to declare normal mode mappings: nmap(from, to)
  * @param imap {Function} to declare insert mode mappings: imap(from, to)
  */
exports.map = function (nmap, imap) {

  // map 'jk' to 'esc' to switch to normal mode 
  imap('jk', 'esc');        

  // navigate backward in history  via 'ctrl-k' in insert mode
  imap('ctrl-k', 'ctrl-p');

};

/**
 * Properties that configure how code is piped into the repl from a changed file
 * @name feed
 */
exports.feed = {

    /**
    * Configures the format into which code is rewritten before it is piped.
    * Note that some dont have any effect when compact is 'true' as is the default.
    * @name format
    */
    format: {
        indent      :  { style: '  ', base: 0 }
      , quotes      :  'single'
      , json        :  false
      , renumber    :  false
      , hexadecimal :  false
      , escapeless  :  false
      , compact     :  true
      , parentheses :  false
      , semicolons  :  false
    }

    /**
     * Filters specify which directories/files are watched for changes.
     * A filter can be a glob string, and array of glob string or a function returning true | false.
     * More information at: https://github.com/thlorenz/readdirp#filters
     */
  , fileFilter      :  '*.js'
  , directoryFilter :  [ '!.*', '!node_modules' ]

    // The name under which module.exports are exposed in the repl after a file was piped.
  , exports         :  '$'
};


/**
 * Properties that configure how inspected objects are printed.
 * @name inspect
 */
exports.inspect =  {
    /**
    * The default depth to which and object is traversed when printed.
    * Can be set in repl via: .depth
    */
    depth : 2
    /**
    * Configure if hidden properties are included during object traversal.
    * Can be set in repl via: .hidden
    */
  , showHidden: false
};

/**
 * Toggles if piped code is syntax highlighted before being sourced in the repl
 * Can be set in repl via: .highlight
 * @name highlight
 */
exports.highlight = false;


/**
 * Set the repl prompt
 * You may optionally use colors.
 * Can be set in repl via: $repl.prompt = 'your prompt'
 * @name 
 */
exports.prompt = 'pad > ';
