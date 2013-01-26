# replpad [![build status](https://secure.travis-ci.org/thlorenz/replpad.png)](http://next.travis-ci.org/thlorenz/replpad)

Watches files in specified directory and all subdirectories and pipes them to a node repl whenever they change. Adds some extra
functionality to the nodejs repl.

Check out this [demo](http://youtu.be/AuGPd-AAl-8) to get an idea about what it is capable of. (only a subset of
features are shown)

## Installation

    npm install -g replpad

## Usage

    replpad [path/to/root]

**Example:** `replpad .` watches current directory and all sub directories.

If `path/to/root` is omitted then no files are watched.

## Features

- **watches all `*.js` files** inside `root` and all subdirectories and sources a file to the repl once it changes
- **adjusts `__filename`, `__dirname` and `require`** to work for the file that is being sourced and restores `require` to work
  for the repl as before
- **highlights source code**, i.e. when calling to string on a function: `require('fs').readFile.toString()`
- **adds commands and keyboard shortcuts** to make using the repl more convenient
- **vim key bindings**
- **key map support**
- **appends code entered in repl back to file** via keyboard shortcut or `.append` command
- **access core module docs in the repl** via the `dox()` function that is added to every core function, i.e.
  `fs.readdir.dox()`
- ensures sourced code is parsable on a line by line basis before sending to repl by rewriting it
- exposes `module.exports` of last sourced file as `$`
- exposes the underlying repl as `$repl` in order to allow further customizations

**Table of Contents**  *generated with [DocToc](http://doctoc.herokuapp.com/)*

- [Commands](#commands)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Hooks](#hooks)
- [Smart Append](#smart-append)
- [Vim Bindings](#vim-bindings)
- [Using replpad with Vim](#using-replpad-with-vim)

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

.hidden         [off] Set whether hidden properties are included during traversal of an object that is printed to the repl

.highlight      [off] Toggles if syntax highlighted code is printed to the repl before being sourced

.load           Load JS from a file into the REPL session

.save           Save all evaluated commands in this REPL session to a file
```

**Note:** commands that toggle a setting like `.compact` take a second parameter: `on|off`. If it is ommitted the state
is toggled, i.e if it was `on` it is turned `off` and vice versa.

**Note:** when code is syntax highlighted, it is still followed by the compacted code which is necessary in order to
have the repl evaluate it.

## Keyboard Shortcuts

- `Ctrl-L` clears the terminal
- `Ctrl-D` exits replpad
- `Ctrl-A` Appends the **last entered** parsable chunk of code or the last line to the **last file** that was sourced in the repl.

## Hooks

- `$repl.defineCommand` to define new commands i.e.: 

  ```js
  $repl.define('sayhi', { 
      help: 'Says hi via .sayhi'
    , action: function () { console.log('Hi!') }
  })
  ```
- `$repl.prompt = '=> '`

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


## Vim Bindings

A subset of vim bindings are added to `replpad` via [readline-vim](https://github.com/thlorenz/readline-vim).

Consult its readme for [available vim bindings](https://github.com/thlorenz/readline-vim#vim-bindings).

## Using replpad with Vim

- in order to auto update your file whenever you append a repl line to it, you need to `:set autoread`
- in case you are using terminal vim, autoread is not working great, so you should add the
  [WatchFile](http://vim.wikia.com/wiki/Have_Vim_check_automatically_if_the_file_has_changed_externally) script to your
  vim configuration

## Vim like key maps

`replpad` allows you to specify keymaps. 

These are handled by [readline-vim](https://github.com/thlorenz/readline-vim), so in order to learn more please read
[this section](https://github.com/thlorenz/readline-vim#mappings).

## Configuring replpad

`replpad` is fully configurable. 

When launched for the first time it creates a config file at `~/.config/replpad/config.js`. Initially this is a copy of
the [default-config](https://github.com/thlorenz/replpad/blob/master/config/default-config.js), but you can edit it to
change these defaults.

## Roadmap

- more vim bindings
