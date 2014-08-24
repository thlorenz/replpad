# replpad [![build status](https://secure.travis-ci.org/thlorenz/replpad.png)](http://next.travis-ci.org/thlorenz/replpad)

[![NPM](https://nodei.co/npm/replpad.png?downloads=true&stars=true)](https://nodei.co/npm/replpad/)

Pipes content of files to a node repl whenever they change to enable a highly interactive coding experience.

Adds keymaps, doc access, vim binding and maps and prints highlighted source of functions right in the repl.

![tty](https://github.com/thlorenz/replpad/raw/master/assets/tty.jpg)

Check out the [replpad home page](http://thlorenz.github.com/replpad/) for demos and tutorials.

## Features

- **watches all `*.js` files** inside `root` and all subdirectories and sources a file to the repl once it changes
- **access core module docs in the repl** via the `dox()` function that is added to every core function, i.e. `fs.readdir.dox()`
- **access user module readmes in the repl** via the `dox()` function that is added to every module installed via npm,
  i.e. `marked.dox()`
- access function's **highlighted source code**, info on **where function was defined** (file, linenumber) and function
  comments and/or **jsdocs** where possible via the `src` property that is added to every function, i.e. `express.logger.src`
- **[scriptie-talkie](https://github.com/thlorenz/scriptie-talkie) support**  (see `.talk` command)
- **adds commands and keyboard shortcuts** 
- **vim key bindings**
- **key map support**
- **parens matching** via match token plugin
- **appends code entered in repl back to file** via keyboard shortcut or `.append` command
- **adjusts `__filename`, `__dirname` and `require`** to work for the file that is being sourced 
- ensures sourced code is parsable on a line by line basis before sending to repl by rewriting it
- exposes `module.exports` of last sourced file as `$`
- exposes the underlying repl as `$repl` in order to allow further customizations

**Table of Contents**  *generated with [DocToc](http://doctoc.herokuapp.com/)*

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [Commands](#commands)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Smart Append](#smart-append)
- [Plugins](#plugins)
  - [Vim](#vim)
    - [Vim Bindings](#vim-bindings)
    - [Vim like key maps](#vim-like-key-maps)
    - [Limitations](#limitations)
  - [match token](#match-token)
- [Using replpad with the Vim Editor](#using-replpad-with-the-vim-editor)
- [Configuring replpad](#configuring-replpad)
- [Roadmap](#roadmap)


## Installation

    npm install -g replpad

## Usage

    replpad [path/to/root]

If `path/to/root` is omitted then no files are watched.

**Example:** `replpad .` watches current directory and all sub directories.

## API

You can use replpad inside of your application and specify repl start options:

```js
var replpad = require('replpad');

var repl = replpad({
    prompt          :  'my-prompt >'
  , input           :  process.stdin
  , output          :  process.stdout
  , ignoreUndefined :  true
  , useColors       :  true
  , useGlobal       :  true
  , terminal        :  true
});
```

## Commands

Some commands were added to the built in `repl` commands. Here is a list of all of them:

```
pad > .help

.append         Appends the last entered parsable chunk of code or the last line to the last file that was sourced in the repl

.clear          Break, and also clear the local context

.compact        [on] Toggles if code is compacted before being sourced to the repl

.depth          [2] Sets the depth to which an object is traversed when printed to the repl

.exit           Exit the repl

.help           Show this list of repl commands

.hidden         [off] Set whether hidden properties are included during traversal of an object that is printed to the
repl

.highlight      [off] Toggles if syntax highlighted code is printed to the repl before being sourced

.load           Load JS from a file into the REPL session

.pack           Load your package.json dependencies and devDependencies into the repl context

.save           Save all evaluated commands in this REPL session to a file
```

**Note:** commands that toggle a setting like `.compact` take a second parameter: `on|off`. If it is ommitted the state
is toggled, i.e if it was `on` it is turned `off` and vice versa.

**Note:** when code is syntax highlighted, it is still followed by the compacted code which is necessary in order to
have the repl evaluate it.

You can add commands to the repl in real time via `$repl.defineCommand`

```js
$repl.define('sayhi', { 
    help: 'Says hi via .sayhi'
  , action: function () { console.log('Hi!') }
})
```

## Keyboard Shortcuts

- `Ctrl-L` clears the terminal
- `Ctrl-D` exits replpad
- `Ctrl-A` Appends the **last entered** parsable chunk of code or the last line to the **last file** that was sourced in the repl.

## Smart Append

When the `.append` command or the append keyboard shortcut is executed, `replpad` will attempt to find a parsable chunk
of code to append. If the last line is parsable or no parsable chunk is found, it will append the last line.

**Example:**

Assume we entered:
```js
2 + 3
function foo() {
  var a = 2;
  return a;
}
```

The first valid JavaScript are the last 4 lines combined. Therefore the entire function `foo` will be appended. This is
makes more sense than appending just `}` for instance.

Additionally the code is reformatted with 2 space indents.

## Plugins 

Plugins can be enabled/disabled in the lower portion of the replpad config file
([default](https://github.com/thlorenz/replpad/blob/master/config/default-config.js).

The following plugins are available.

### Vim

#### Vim Bindings

If enabled, a subset of vim bindings are added to `replpad` via [readline-vim](https://github.com/thlorenz/readline-vim).

Consult its readme for [available vim bindings](https://github.com/thlorenz/readline-vim#vim-bindings).

#### Vim like key maps

`replpad` allows you to specify keymaps. 

`imap` is used to map keys in **insert** mode and `nmap` to map keys in **normal** mode.

```js
// map 'ctrl-t' to 'esc', allowing to switch to normal mode via 'ctrl-t'
$repl.imap('ctrl-t', 'esc'); 

// go forward in history via 'ctrl-space' in normal mode
$repl.nmap('ctrl-space', 'j')
```
You can list all registered mappings via: `$repl.maps`.

These are handled by [readline-vim](https://github.com/thlorenz/readline-vim), so in order to learn more please read
[this section](https://github.com/thlorenz/readline-vim#mappings).

You can also declare mappings to be applied at startup by including them inside the map section of your config file as
explained in [configuring replpad](#configuring-replpad).

#### Limitations

Mappings are limited by what the underlying nodejs `readline` supports. Consult [this
section](https://github.com/thlorenz/stringify-key#limitations) for more information.

In general I found that only a few mappings in `normal` mode have the desired effect. In `insert` mode things are
somewhat better.

### match token

If enabled, it will match parens, braces, brackets and quotes by jumping the cursor to the matching token [emacs
style](http://www.delorie.com/gnu/docs/emacs/emacs_284.html).

## Using replpad with the Vim Editor

- in order to auto update your file whenever you append a repl line to it, you need to `:set autoread`
- in case you are using terminal vim, autoread is not working great, so you should add the
  [WatchFile](http://vim.wikia.com/wiki/Have_Vim_check_automatically_if_the_file_has_changed_externally) script to your
  vim configuration

## Configuring replpad

`replpad` is fully configurable. 

When launched for the first time it creates a config file at `~/.config/replpad/config.js`. Initially this is a copy of
the [default-config](https://github.com/thlorenz/replpad/blob/master/config/default-config.js), but you can edit it to
change these defaults.

Reading the comments in that file should give you enough information to tweak it.

## Roadmap

- more vim bindings
- only pipe part of a file enclosed by `start/stop` comments
- pause/resume feeding files via command
- list an object's properties by type (i.e. `Function`, `Object`, `String`)

