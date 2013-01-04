# replpad

Watches files in specified directory and pipes them to a node repl when ever they change.

Only minor functionality implemented at this point.

Check out this [little screencast](http://youtu.be/AuGPd-AAl-8) to get an idea about what it is capable of.

## installation

    npm install -g replpad

## usage

    replpad [path/to/root]

if `path/to/root` is omitted, the current directory is used as the root

## features

- watches all `*.js` files inside `root` and all subdirectories and sources a file to the repl once it changes
- adjusts `__filename`, `__dirname` and `require` to work for the file that is being sourced and restores `require` to work
  for the repl as before
- ensures sourced code is parsable on a line by line basis before sending to repl by rewriting it
- exposes `module.exports` of last sourced file as `$`
- exposes the underlying repl as `$repl` in order to allow further customizations

## keyboard shortcuts

- `Ctrl-L` clears the terminal
- `Ctrl-D` exits replpad

## hooks

- `$repl.defineCommand` to define new commands i.e.: 

  ```js
  $repl.define('sayhi', { 
      help: 'Says hi via .sayhi'
    , action: function () { console.log('Hi!') }
  })
  ```
- `$repl.prompt = '=> '`
