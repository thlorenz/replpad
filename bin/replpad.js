#!/usr/bin/env node

'use strict';
var repreprep = require('..')
  , path = require('path');

var root = process.argv.length > 2 ? path.resolve(process.argv[2]) : null;

repreprep(root);
