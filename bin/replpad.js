#!/usr/bin/env node

'use strict';
var repreprep = require('../lib/repreprep')
  , path = require('path');

var root = process.argv.length > 2 ? path.resolve(process.argv[2]) : process.cwd();

repreprep(root);
