# replpad

Watches files in specified directory and all subdirectories and pipes them to a node repl whenever they change. Adds some extra
functionality to the nodejs repl.

Check out this [demo](http://youtu.be/AuGPd-AAl-8) to get an idea about what it is capable of. (only a subset of
features are shown)

## installation

    npm install -g replpad

## usage

    replpad [path/to/root]

if `path/to/root` is omitted, the current directory is used as the root

## features

- watches all `*.js` files inside `root` and all subdirectories and sources a file to the repl once it changes
- adjusts `__filename`, `__dirname` and `require` to work for the file that is being sourced and restores `require` to work
  for the repl as before
- highlights source code, i.e. when calling to string on a function: `require('fs').readFile.toString()`
- ensures sourced code is parsable on a line by line basis before sending to repl by rewriting it
- exposes `module.exports` of last sourced file as `$`
- exposes the underlying repl as `$repl` in order to allow further customizations

## additional commands

Commands in addition to default node repl commands:

```sh
pad > .help
.append	Appends the last entered line to the last file that was sourced in the repl.
```

## keyboard shortcuts

- `Ctrl-L` clears the terminal
- `Ctrl-D` exits replpad
- `Ctrl-A` Appends the **last entered** line to the **last file** that was sourced in the repl.

## hooks

- `$repl.defineCommand` to define new commands i.e.: 

  ```js
  $repl.define('sayhi', { 
      help: 'Says hi via .sayhi'
    , action: function () { console.log('Hi!') }
  })
  ```
- `$repl.prompt = '=> '`

## using replpad with vim

- in order to auto update your file whenever you append a repl line to it, you need to `:set autoread`
- in case you are using terminal vim, autoread is not working great, so you should add the
  [WatchFile](http://vim.wikia.com/wiki/Have_Vim_check_automatically_if_the_file_has_changed_externally) script to your
  vim configuration

## yet to come (possibly)

- append multiple lines to file i.e. `.append2`, `.append3` ...
- vim like bindings
