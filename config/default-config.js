'use strict';

/**
 * The replpad version for which this config was originally created.
 * Important when upgrading replpad.
 * @name version
 */
exports.version = '0.10';

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
      , semicolons  :  true
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
 * Can be set in repl via: $repl.prompt = 'your prompt'
 * @name prompt
 */
exports.prompt = 'pad > ';

/**
  * Enable plugins by setting them true, disable them by setting them false.
  * Plugins that are not set to true|false are included by default (for backwards compat)
  * Removing this entire section enables all plugins.
  * @name plugins
  */
exports.plugins = {
    // adds vim key bindings and maps to the repl
    vim: true

    // jumps cursor to matching brace, bracket, paren and quote when it is entered
  , matchtoken: true
};

/**
 * Configure the scriptie talkie feature (activated via '.talk') which evaluates a script in chunks and prints
 * intermediate results.
 * @name scriptietalkie
 */
exports.scriptietalkie = {

    // at what point is an object diff compacted to one line
    joinLinesAt: 20

    // at which length is an object diff line cut off with an ellipsis
  , maxLineLength: 380

    // set to true to activate scriptie talkie when replpad starts, you can toggle this setting via the '.talk' command
  , active: false
};

/**
 * Configure what happens when you execute .dox() on an nmp package, i.e. request.dox()
 * In either case the package homepage and/or gitub url are printed to the terminal.
 * If no internet connection is available the readme will be rendered locally and the path to the file printed and 
 * the file automatically opened in the browser if the `open` flag is set.
 * @name readme
 */
exports.readme = {

    // print rendered readme markdown inside the repl
    render: true

    // automatically open the github url or locally rendered readme file in your browser
  , open: false
};
