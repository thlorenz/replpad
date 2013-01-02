'use strict';
var repreprep = require('../lib/repreprep')
  , path = require('path');

repreprep(path.join(__dirname, '../test/fixtures'));
