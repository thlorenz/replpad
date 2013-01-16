# replpad [![build status](https://secure.travis-ci.org/thlorenz/replpad.png)](http://next.travis-ci.org/thlorenz/replpad)

Watches files in specified directory and all subdirectories and pipes them to a node repl whenever they change. Adds some extra
functionality to the nodejs repl.

Check out this [demo](http://youtu.be/AuGPd-AAl-8) to get an idea about what it is capable of. (only a subset of
features are shown)

## Installation

    npm install -g replpad

## Usage

    replpad [path/to/root]

if `path/to/root` is omitted, the current directory is used as the root

## Features

- **watches all `*.js` files** inside `root` and all subdirectories and sources a file to the repl once it changes
- **adjusts `__filename`, `__dirname` and `require`** to work for the file that is being sourced and restores `require` to work
  for the repl as before
- **highlights source code**, i.e. when calling to string on a function: `require('fs').readFile.toString()`
- **adds commands and keyboard shortcuts** to make using the repl more convenient
- **vim key bindings**
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
  - [Insert Mode](#insert-mode)
  - [Normal Mode](#normal-mode)
    - [Movements](#movements)
    - [Movements combined with Actions](#movements-combined-with-actions)
    - [History](#history)
- [Using replpad with Vim](#using-replpad-with-vim)
- [Yet to come (possibly)](#yet-to-come-possibly)

## Commands

Some commands were added to the built in `repl` commands. Here is a list of all of them:

```
pad > .help
_______________
.append         Appends the last entered parsable chunk of code or the last line to the last file that was sourced in the repl
_______________
.clear          Break, and also clear the local context
_______________
.compact        Toggles if code is compacted before being sourced in the repl [Default on]
_______________
.depth          Set the depth to which an object is traversed when printed to the repl [Default 2]
_______________
.exit           Exit the repl
_______________
.help           Show repl options
_______________
.hidden         Set whether hidden properties are included when an object is traversed when printed to the repl [Default off]
_______________
.highlight      Toggles if syntax highlighted code is printed to the repl before being sourced in the repl [Default off]
_______________
.load           Load JS from a file into the REPL session
_______________
.save           Save all evaluated commands in this REPL session to a file
_______________
```

**Note:** commands that toggle a setting like `.compact` take a second parameter: `on|off`. If it is ommitted, `on` is
used.

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

A subset of vim keybindings is supported by `replpad`:

### Insert Mode

- `Esc`, `Ctrl-[`: normal mode

### Normal Mode

- `i`, `I`, `a`, `A`: insert mode with the usual side effects

#### Movements

- `h` cursor left
- `l` cursor right
- `w` word right
- `b` word left
- `0` beginning of line
- `$` end of line

#### Movements combined with Actions

- `cb`: change word left
- `cw`: change word right
- `cc`, `C` change line
- `db`: delete word left
- `dw`: delete word right
- `dd`, `D` delete line
- `x` delete right
- `X` delete left

#### History

- `k` go back in history
- `j` go forward in history

## Using replpad with Vim

- in order to auto update your file whenever you append a repl line to it, you need to `:set autoread`
- in case you are using terminal vim, autoread is not working great, so you should add the
  [WatchFile](http://vim.wikia.com/wiki/Have_Vim_check_automatically_if_the_file_has_changed_externally) script to your
  vim configuration

## Yet to come (possibly)

- append multiple lines to file i.e. `.append2`, `.append3` ...
- more vim bindings
- make code style used to append code and `toString` a function configurable
