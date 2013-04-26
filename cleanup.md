# Refactor

- prompt and vimrli need to work together better, i.e. vim-rli is only there if vim plugin is used
- things like repl, vimrli, etc., should be considered part of the app state and be requireable instead of being passed
  around
- in order for this to work, we need to get into a fully initialized state before activateing anything that depends on
  those

# Test

- current plugins should be easily testable
- rewrite already contains test body
- feed Edits

# No tests needed for

- vimrli
- instructions
- log
- state
- utl

- plugins
  - commands
  - src
    

# Hard to test, so maybe not worth it

- watcher
- core dox (may change with node 0.10 since modules are preloaded)
- anything in config

# Tested

- complete-append
