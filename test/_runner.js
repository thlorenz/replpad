'use strict';
var readdirp = require('readdirp');

readdirp({ root: __dirname, fileFilter: '!_runner.js', directoryFilter: '!fixtures' }, function (err, res) {
  if (err) {
    console.error(err);
    return process.exit(1);
  }
  res.files.forEach(function (entry) { require(entry.fullPath); });
});
