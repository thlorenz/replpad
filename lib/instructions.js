'use strict';

var os= require('os')
  , format = require('util').format
  , colors = require('ansicolors')
  , styles = require('ansistyles')
  , log    = require('./log')
  ;

var specs = { cpus: Object.keys(os.cpus()).length, platform: os.platform(), host: os.hostname() }
  , v = process.versions;

var msgs = [
    ''
  , styles.underline(colors.brightRed('replpad'))
  , ''
  ,   format(colors.cyan('node') +' %s (' + colors.cyan('v8') + ' %s, ' + colors.cyan('uv') + ' %s)', colors.yellow('v' + v.node), colors.yellow('v' + v.v8), colors.yellow('v' + v.uv)) 
    + format(' | %s | %s cpus | %s platform', colors.green(specs.host), colors.green(specs.cpus), colors.green(specs.platform))
  , ''
  , 'If in doubt, enter "' + colors.yellow('.help') + '"'
  , '' 
  ];

module.exports = function () {
  msgs.forEach(function (msg) { log.print(msg); });
};
